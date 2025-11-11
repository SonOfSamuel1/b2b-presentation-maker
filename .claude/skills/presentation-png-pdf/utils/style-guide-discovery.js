const fs = require('fs').promises;
const path = require('path');

class StyleGuideDiscovery {
  constructor() {
    this.workspaceRoot = process.cwd();
    this.desktopStylesPath = '/Users/terrancebrandon/Desktop/TB Presentation Styles';
    this.styleGuides = [];
  }

  /**
   * Discover all style guides in workspace and desktop folder
   * @returns {Promise<Array>} Array of style guide objects
   */
  async discoverAll() {
    this.styleGuides = [];

    // Search workspace
    await this.searchDirectory(this.workspaceRoot, 'workspace');

    // Search desktop TB Presentation Styles folder
    try {
      await this.searchDirectory(this.desktopStylesPath, 'desktop');
    } catch (error) {
      console.log(`Note: TB Presentation Styles folder not found at ${this.desktopStylesPath}`);
    }

    // Add "No defined style" option
    this.styleGuides.push({
      id: 'ai-led',
      name: 'No defined style (AI-led)',
      description: 'Let AI determine the visual style based on content',
      location: 'built-in',
      path: null
    });

    return this.styleGuides;
  }

  /**
   * Search a directory for style guide files
   * @param {string} dirPath - Directory to search
   * @param {string} location - Location label (workspace/desktop)
   */
  async searchDirectory(dirPath, location) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // Skip node_modules and hidden directories
          if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
            continue;
          }
          // Recursively search subdirectories (max depth 3)
          if (fullPath.split(path.sep).length - this.workspaceRoot.split(path.sep).length <= 3) {
            await this.searchDirectory(fullPath, location);
          }
        } else if (entry.isFile()) {
          // Check if file matches style guide patterns
          if (this.isStyleGuide(entry.name)) {
            const styleGuide = await this.parseStyleGuide(fullPath, location);
            if (styleGuide) {
              this.styleGuides.push(styleGuide);
            }
          }
        }
      }
    } catch (error) {
      // Silently skip directories we can't read
      return;
    }
  }

  /**
   * Check if filename matches style guide patterns
   * @param {string} filename - Filename to check
   * @returns {boolean} Whether file is likely a style guide
   */
  isStyleGuide(filename) {
    const patterns = [
      /-style\.md$/i,
      /-style-guide/i,
      /style-guide-summary/i,
      /presentation.*style/i,
      /pitch.*deck.*style/i,
      /design.*system/i
    ];

    return patterns.some(pattern => pattern.test(filename));
  }

  /**
   * Parse a style guide file and extract metadata
   * @param {string} filePath - Path to style guide file
   * @param {string} location - Location label
   * @returns {Promise<Object>} Style guide object
   */
  async parseStyleGuide(filePath, location) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const filename = path.basename(filePath, '.md');

      // Extract title from first heading
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : this.formatName(filename);

      // Extract description from content
      const descMatch = content.match(/^##?\s*(?:Description|Overview|About)\s*\n+(.+?)(?:\n#|$)/is);
      const description = descMatch ? descMatch[1].trim().substring(0, 150) : 'No description available';

      // Detect style type
      const type = this.detectStyleType(content, filename);

      return {
        id: this.generateId(filename),
        name: title,
        description: description,
        location: location,
        path: filePath,
        type: type,
        filename: filename
      };
    } catch (error) {
      console.error(`Error parsing style guide ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * Format filename into readable name
   * @param {string} filename - Filename to format
   * @returns {string} Formatted name
   */
  formatName(filename) {
    return filename
      .replace(/-style-guide/i, '')
      .replace(/-style/i, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  /**
   * Generate unique ID from filename
   * @param {string} filename - Filename
   * @returns {string} Unique ID
   */
  generateId(filename) {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Detect style type from content
   * @param {string} content - File content
   * @param {string} filename - Filename
   * @returns {string} Style type
   */
  detectStyleType(content, filename) {
    const contentLower = content.toLowerCase();
    const filenameLower = filename.toLowerCase();

    if (filenameLower.includes('pitch') || contentLower.includes('pitch deck')) {
      return 'pitch-deck';
    }
    if (filenameLower.includes('startup') || contentLower.includes('startup')) {
      return 'startup';
    }
    if (filenameLower.includes('corporate') || filenameLower.includes('b2b')) {
      return 'corporate';
    }
    if (filenameLower.includes('luxury') || contentLower.includes('luxury')) {
      return 'luxury';
    }

    return 'general';
  }

  /**
   * Present style guides as numbered menu
   * @param {Array} guides - Array of style guides (optional, uses discovered if not provided)
   * @returns {string} Formatted menu
   */
  formatMenu(guides = null) {
    const styleGuides = guides || this.styleGuides;

    if (styleGuides.length === 0) {
      return 'No style guides found.';
    }

    let menu = 'Available Presentation Styles:\n\n';

    styleGuides.forEach((guide, index) => {
      const number = index + 1;
      const location = guide.location === 'workspace' ? '📁 Workspace' :
                      guide.location === 'desktop' ? '💼 Desktop' :
                      '🤖 Built-in';

      menu += `${number}. ${guide.name}\n`;
      menu += `   ${location} | ${guide.type}\n`;
      menu += `   ${guide.description.substring(0, 80)}${guide.description.length > 80 ? '...' : ''}\n\n`;
    });

    return menu;
  }

  /**
   * Get style guide by selection number
   * @param {number} selection - Selected number (1-based)
   * @returns {Object|null} Selected style guide
   */
  getBySelection(selection) {
    const index = parseInt(selection) - 1;

    if (index < 0 || index >= this.styleGuides.length) {
      return null;
    }

    return this.styleGuides[index];
  }

  /**
   * Load and parse style guide content
   * @param {Object} styleGuide - Style guide object
   * @returns {Promise<Object>} Parsed style guide with design tokens
   */
  async loadStyleGuide(styleGuide) {
    if (styleGuide.id === 'ai-led') {
      return {
        id: 'ai-led',
        name: 'AI-led Style',
        tokens: this.getDefaultTokens(),
        customCSS: null
      };
    }

    try {
      const content = await fs.readFile(styleGuide.path, 'utf-8');
      const tokens = this.extractDesignTokens(content);

      return {
        ...styleGuide,
        tokens: tokens,
        customCSS: this.generateCSS(tokens)
      };
    } catch (error) {
      console.error(`Error loading style guide ${styleGuide.path}:`, error.message);
      return null;
    }
  }

  /**
   * Extract design tokens from style guide content
   * @param {string} content - Style guide content
   * @returns {Object} Design tokens
   */
  extractDesignTokens(content) {
    const tokens = {
      colors: this.extractColors(content),
      fonts: this.extractFonts(content),
      spacing: this.extractSpacing(content),
      effects: this.extractEffects(content)
    };

    return tokens;
  }

  /**
   * Extract color values from content
   * @param {string} content - Content to parse
   * @returns {Object} Color tokens
   */
  extractColors(content) {
    const colors = {};

    // Try to find labeled colors first (more accurate)
    const labelPatterns = [
      // Match patterns like "**Light Blue (Accent)**: `#A7D4F0`"
      { pattern: /\*\*[^*]*(accent|light blue)[^*]*\*\*[:\s]+`#([0-9A-Fa-f]{6})`/i, key: 'accent' },
      { pattern: /\*\*[^*]*(dark charcoal|text on light)[^*]*\*\*[:\s]+`#([0-9A-Fa-f]{6})`/i, key: 'text' },
      { pattern: /\*\*[^*]*(medium gray|secondary)[^*]*\*\*[:\s]+`#([0-9A-Fa-f]{6})`/i, key: 'secondary' },
      { pattern: /\*\*[^*]*(primary background|light gray.*background)[^*]*\*\*[:\s]+`#([0-9A-Fa-f]{6})`/i, key: 'background' },
      { pattern: /\*\*[^*]*(primary color|primary)[^*]*\*\*[:\s]+`#([0-9A-Fa-f]{6})`/i, key: 'primary' }
    ];

    for (const { pattern, key } of labelPatterns) {
      const match = content.match(pattern);
      if (match) {
        colors[key] = '#' + match[2];
      }
    }

    // If we didn't find labeled colors, fall back to extracting all hex colors
    if (Object.keys(colors).length === 0) {
      const hexMatches = content.matchAll(/#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g);
      const hexColors = [...hexMatches].map(m => '#' + m[1]);

      if (hexColors.length > 0) {
        colors.primary = hexColors[0];
        colors.secondary = hexColors[1] || hexColors[0];
        colors.accent = hexColors[2] || hexColors[0];
        colors.background = hexColors[3] || '#FFFFFF';
        colors.text = hexColors[4] || '#000000';
      }
    }

    // Extract rgb colors if hex not found
    if (!colors.primary) {
      const rgbMatches = content.matchAll(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g);
      const rgbColors = [...rgbMatches].map(m => `rgb(${m[1]}, ${m[2]}, ${m[3]})`);

      if (rgbColors.length > 0) {
        colors.primary = rgbColors[0];
        colors.secondary = rgbColors[1] || rgbColors[0];
      }
    }

    // Ensure we have all required colors
    colors.primary = colors.primary || '#2563EB';
    colors.secondary = colors.secondary || '#1E40AF';
    colors.accent = colors.accent || colors.primary;
    colors.background = colors.background || '#FFFFFF';
    colors.text = colors.text || '#111827';

    return colors;
  }

  /**
   * Extract font definitions
   * @param {string} content - Content to parse
   * @returns {Object} Font tokens
   */
  extractFonts(content) {
    const fonts = {};

    // Look for explicitly mentioned fonts - match patterns like **Primary Font**: **"Inter"**
    const fontPatterns = [
      /\*\*Primary Font\*\*[:\s]+\*\*"([^"]+)"\*\*/i,
      /Primary Font[:\s]+\*?\*?"?([^"\n*]+)"?\*?\*/i,
      /Font Families[:\s]+[^:]*Primary[:\s]+\*?\*?"?([^"\n*]+)"?\*?\*/i,
      /font[-\s]family[:\s]+([^;\n]+)/i
    ];

    for (const pattern of fontPatterns) {
      const match = content.match(pattern);
      if (match) {
        fonts.primary = match[1].trim().replace(/['"]/g, '');
        break;
      }
    }

    // Default fonts if not found
    fonts.primary = fonts.primary || 'Inter, system-ui, sans-serif';
    fonts.heading = fonts.heading || fonts.primary;
    fonts.body = fonts.body || fonts.primary;

    return fonts;
  }

  /**
   * Extract spacing values
   * @param {string} content - Content to parse
   * @returns {Object} Spacing tokens
   */
  extractSpacing(content) {
    return {
      small: '16px',
      medium: '32px',
      large: '64px',
      xlarge: '96px'
    };
  }

  /**
   * Extract visual effects
   * @param {string} content - Content to parse
   * @returns {Object} Effect tokens
   */
  extractEffects(content) {
    return {
      borderRadius: '8px',
      shadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: '0.3s ease'
    };
  }

  /**
   * Generate CSS from design tokens
   * @param {Object} tokens - Design tokens
   * @returns {string} CSS code
   */
  generateCSS(tokens) {
    return `
:root {
  /* Colors */
  --color-primary: ${tokens.colors.primary || '#6B7BC1'};
  --color-secondary: ${tokens.colors.secondary || '#4A5899'};
  --color-accent: ${tokens.colors.accent || '#F4B8A8'};
  --color-background: ${tokens.colors.background || '#FFFFFF'};
  --color-text: ${tokens.colors.text || '#000000'};

  /* Fonts */
  --font-primary: ${tokens.fonts.primary || 'Inter, sans-serif'};
  --font-heading: ${tokens.fonts.heading || 'Inter, sans-serif'};
  --font-body: ${tokens.fonts.body || 'Inter, sans-serif'};

  /* Spacing */
  --spacing-small: ${tokens.spacing.small};
  --spacing-medium: ${tokens.spacing.medium};
  --spacing-large: ${tokens.spacing.large};
  --spacing-xlarge: ${tokens.spacing.xlarge};

  /* Effects */
  --border-radius: ${tokens.effects.borderRadius};
  --shadow: ${tokens.effects.shadow};
  --transition: ${tokens.effects.transition};
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-background);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--color-primary);
}
    `.trim();
  }

  /**
   * Get default design tokens for AI-led style
   * @returns {Object} Default tokens
   */
  getDefaultTokens() {
    return {
      colors: {
        primary: '#2563EB',
        secondary: '#1E40AF',
        accent: '#F59E0B',
        background: '#FFFFFF',
        text: '#111827'
      },
      fonts: {
        primary: 'Inter, system-ui, sans-serif',
        heading: 'Inter, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif'
      },
      spacing: {
        small: '16px',
        medium: '32px',
        large: '64px',
        xlarge: '96px'
      },
      effects: {
        borderRadius: '8px',
        shadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: '0.3s ease'
      }
    };
  }
}

module.exports = StyleGuideDiscovery;
