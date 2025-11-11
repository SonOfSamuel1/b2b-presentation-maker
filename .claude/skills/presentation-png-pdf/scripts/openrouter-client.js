const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

class OpenRouterClient {
  constructor() {
    this.baseUrl = 'https://openrouter.ai/api/v1';
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.referer = process.env.OPENROUTER_REFERER || 'https://github.com/yourusername';
    this.imageModel = process.env.IMAGE_MODEL || 'openai/dall-e-3';
    this.imageQuality = process.env.IMAGE_QUALITY || 'hd';
  }

  /**
   * Determine optimal image aspect ratio based on slide context
   * @param {string} slideType - Type of slide (hero, content, data, etc.)
   * @param {string} position - Image position on slide (full, left, right, center)
   * @returns {string} Aspect ratio (16:9, 1:1, 9:16)
   */
  determineAspectRatio(slideType, position = 'full') {
    const aspectRatios = {
      hero: '16:9',      // Full-width hero images
      background: '16:9', // Background images
      full: '16:9',      // Full slide images
      portrait: '9:16',  // Vertical images
      square: '1:1',     // Icon-style images
      left: '1:1',       // Side-by-side content
      right: '1:1'       // Side-by-side content
    };

    return aspectRatios[slideType] || aspectRatios[position] || '16:9';
  }

  /**
   * Convert aspect ratio to pixel dimensions
   * @param {string} aspectRatio - Aspect ratio (16:9, 1:1, 9:16)
   * @returns {string} Pixel dimensions
   */
  getImageSize(aspectRatio) {
    const sizes = {
      '16:9': '1792x1024',  // Wide landscape
      '1:1': '1024x1024',   // Square
      '9:16': '1024x1792'   // Tall portrait
    };

    return sizes[aspectRatio] || sizes['16:9'];
  }

  /**
   * Generate an image using OpenRouter's image generation API
   * @param {string} prompt - Image generation prompt
   * @param {Object} options - Generation options
   * @returns {Promise<string>} URL of generated image
   */
  async generateImage(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not found. Please set OPENROUTER_API_KEY in .env file.');
    }

    const aspectRatio = this.determineAspectRatio(
      options.slideType || 'full',
      options.position || 'full'
    );
    const size = this.getImageSize(aspectRatio);

    console.log(`Generating image: ${prompt.substring(0, 50)}...`);
    console.log(`  Aspect ratio: ${aspectRatio}, Size: ${size}`);

    try {
      const response = await axios.post(
        `${this.baseUrl}/images/generations`,
        {
          model: this.imageModel,
          prompt: prompt,
          n: 1,
          size: size,
          quality: this.imageQuality,
          style: options.style || 'vivid'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': this.referer,
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60 second timeout
        }
      );

      if (response.data && response.data.data && response.data.data[0]) {
        const imageUrl = response.data.data[0].url;
        console.log(`  ✓ Image generated successfully`);
        return imageUrl;
      } else {
        throw new Error('Unexpected response format from OpenRouter API');
      }
    } catch (error) {
      if (error.response) {
        console.error('OpenRouter API error:', error.response.status, error.response.data);
        throw new Error(`Image generation failed: ${error.response.data.error?.message || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('No response from OpenRouter API. Check your internet connection.');
      } else {
        throw new Error(`Image generation error: ${error.message}`);
      }
    }
  }

  /**
   * Download an image from URL and save to file
   * @param {string} imageUrl - URL of image to download
   * @param {string} outputPath - Path to save image
   * @returns {Promise<string>} Path to saved image
   */
  async downloadImage(imageUrl, outputPath) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 30000
      });

      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, response.data);

      console.log(`  ✓ Image saved to ${outputPath}`);
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to download image: ${error.message}`);
    }
  }

  /**
   * Generate and download an image in one step
   * @param {string} prompt - Image generation prompt
   * @param {string} outputPath - Path to save image
   * @param {Object} options - Generation options
   * @returns {Promise<string>} Path to saved image
   */
  async generateAndDownload(prompt, outputPath, options = {}) {
    const imageUrl = await this.generateImage(prompt, options);
    return await this.downloadImage(imageUrl, outputPath);
  }

  /**
   * Generate prompts for slides that need images
   * @param {Object} slide - Slide data
   * @returns {string|null} Image generation prompt or null
   */
  generateImagePrompt(slide) {
    // Analyze slide content to determine if it needs an image
    const needsImage = this.slideNeedsImage(slide);

    if (!needsImage) {
      return null;
    }

    // Generate contextual prompt based on slide content
    const basePrompt = slide.title || slide.content?.substring(0, 100);

    // Enhance prompt for professional presentation imagery
    const enhancedPrompt = `Professional, high-quality photograph for a business presentation slide. ${basePrompt}. Clean, modern, corporate aesthetic. Avoid text, logos, or people's faces. Focus on abstract concepts, technology, or elegant compositions.`;

    return enhancedPrompt;
  }

  /**
   * Determine if a slide needs a generated image
   * @param {Object} slide - Slide data
   * @returns {boolean} Whether slide needs an image
   */
  slideNeedsImage(slide) {
    // Hero slides typically need images
    if (slide.type === 'hero' || slide.type === 'title') {
      return true;
    }

    // Slides with image placeholders
    if (slide.needsImage === true) {
      return true;
    }

    // Slides with specific image prompts
    if (slide.imagePrompt) {
      return true;
    }

    // By default, don't generate images (SVGs will be used)
    return false;
  }
}

module.exports = OpenRouterClient;
