# Presentation PNG/PDF Creator

Generate high-quality 16:9 presentation slides as PNG images and compiled PDF with custom SVG graphics and AI-generated photos.

## Overview

This skill creates professional presentations with:
- **High-resolution PNG slides** (3840x2160 @ 2x scale)
- **Compiled PDF** with all slides
- **Custom SVG graphics** (no emojis, only vector graphics)
- **AI-generated photos** via OpenRouter gpt-image-1
- **Style guide integration** from workspace and desktop folders
- **Multiple input formats** (markdown, outline, plain text, JSON)

## Quick Start

1. **Set up OpenRouter API key** (required for image generation):
   ```bash
   cd .claude/skills/presentation-png-pdf
   cp .env.example .env
   # Edit .env and add your OpenRouter API key
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Use the skill** in conversation with Claude:
   ```
   User: "Create a 10-slide presentation about AI in healthcare"
   Claude: [Uses this skill to guide you through the process]
   ```

## Features

### 1. Style Guide Discovery
- Automatically scans workspace for style guides
- Scans `/Users/terrancebrandon/Desktop/TB Presentation Styles/`
- Presents numbered menu for selection
- Includes "No defined style (AI-led)" option

### 2. Content Parsing
Supports multiple input formats:
- **Markdown**: `# Slide Title` creates slides
- **Outline**: Numbered/bulleted structure
- **Plain Text**: Auto-split by paragraphs
- **JSON**: Structured slide data

### 3. SVG Graphics
Custom vector graphics (zero emojis):
- Icons (checkmark, arrow, star, lightbulb, target, rocket, etc.)
- Charts (bar, line, pie, donut)
- Patterns (dots, grid, waves)
- Illustrations (abstract, tech-themed)

### 4. Image Generation
- Automatic detection of slides needing photos
- OpenRouter gpt-image-1 integration
- Smart aspect ratio selection (16:9, 1:1, 9:16)
- Professional, corporate aesthetic

### 5. High-Resolution Output
- **PNG slides**: 3840x2160 pixels (2x scale)
- **PDF compilation**: Full resolution preserved
- **File organization**: Timestamped folders

## Usage Examples

### Example 1: Markdown Input
```markdown
# AI in Healthcare
The future of medical technology

## Key Benefits
- Faster diagnosis
- Personalized treatment
- Reduced costs
- Better outcomes

## Market Size
The healthcare AI market is growing rapidly

## Implementation Strategy
1. Pilot programs
2. Staff training
3. Full rollout
```

### Example 2: Outline Input
```
1. Company Overview
  - Founded in 2020
  - 50+ employees
  - $5M ARR
2. Product Features
  - Real-time analytics
  - AI-powered insights
  - Easy integration
3. Market Opportunity
  - $10B TAM
  - Growing 25% annually
```

### Example 3: Conversational Input
```
User: "Create a presentation about our new product launch.
       Include an intro slide, 3 slides about features,
       pricing, and a call to action."
```

## Workflow

1. **Content Input**: Claude asks for presentation content
2. **Style Selection**: Presents numbered menu of available styles
3. **Parsing**: Converts content into structured slides
4. **Image Generation**: Creates photos for hero slides (if needed)
5. **HTML Generation**: Builds slide HTML with SVG graphics
6. **Screenshot Capture**: Puppeteer captures 2x resolution PNGs
7. **PDF Compilation**: Combines PNGs into single PDF
8. **Delivery**: Files saved to Desktop/AI Presentations

## Output Structure

```
/Users/terrancebrandon/Desktop/AI Presentations/
└── my-presentation-2024-01-15/
    ├── my-presentation.pdf              # Compiled PDF
    ├── slides/                           # Individual PNGs
    │   ├── my-presentation-slide-01.png
    │   ├── my-presentation-slide-02.png
    │   └── ...
    └── images/ (optional)                # Generated images
        └── slide-1-image.png
```

## Configuration

### Environment Variables (.env)

```bash
# OpenRouter API (required for image generation)
OPENROUTER_API_KEY=sk-or-v1-your_api_key_here
OPENROUTER_REFERER=https://your-site.com

# Screenshot Settings
SCREENSHOT_SCALE=2          # 1=standard, 2=high-res, 4=print
SCREENSHOT_DELAY=2000       # ms to wait for fonts/images

# Output Settings
OUTPUT_DIR=/Users/terrancebrandon/Desktop/AI Presentations
DEFAULT_STYLE=pitch-deck

# Image Generation
IMAGE_MODEL=openai/dall-e-3
IMAGE_QUALITY=hd
```

### Presets

**Screen Quality** (default): 3840x2160
```javascript
screenshotGen.setPreset('screen');
```

**Print Quality**: 7680x4320
```javascript
screenshotGen.setPreset('print');
```

**Web Quality**: 1920x1080
```javascript
screenshotGen.setPreset('web');
```

## Style Guide Format

To create a new style guide that will be auto-discovered:

```markdown
# My Brand Style Guide

## Description
Professional corporate presentation style for [Brand Name]

## Colors
Primary: #2563EB
Secondary: #1E40AF
Accent: #F59E0B
Background: #FFFFFF
Text: #111827

## Fonts
Font Family: Inter, system-ui, sans-serif

## Additional Styles
[Any custom CSS or design tokens]
```

Save as:
- `my-brand-style.md` (workspace root)
- `.claude/skills/my-brand-style.md` (Claude skill)
- `/Users/terrancebrandon/Desktop/TB Presentation Styles/my-brand-style.md`

## Advanced Features

### Custom SVG Graphics

```javascript
const SVGGenerator = require('./utils/svg-generator');
const svg = new SVGGenerator({ primary: '#2563EB' });

// Generate icon
const icon = svg.generate('icon', { name: 'rocket', size: 64 });

// Generate chart
const chart = svg.generate('chart', {
  type: 'bar',
  values: [40, 65, 85, 70, 90],
  labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']
});

// Generate pattern
const pattern = svg.generate('pattern', {
  patternType: 'dots',
  spacing: 50,
  color: '#2563EB'
});
```

### Image Generation Options

```javascript
const OpenRouterClient = require('./scripts/openrouter-client');
const client = new OpenRouterClient();

await client.generateImage('Modern tech office space', {
  slideType: 'hero',    // hero, content, background
  position: 'full',     // full, left, right, square
  style: 'vivid'        // vivid, natural
});
```

### Content Parser API

```javascript
const ContentParser = require('./utils/content-parser');
const parser = new ContentParser();

const slides = parser.parse(content, 'markdown');
const validation = parser.validate(slides);

if (!validation.valid) {
  console.error(validation.errors);
}
```

## Troubleshooting

### No images generated
- Check OpenRouter API key in `.env`
- Verify `OPENROUTER_API_KEY` is set correctly
- Check API quota/credits

### Fonts not loading
- Increase `SCREENSHOT_DELAY` in `.env`
- Check internet connection (fonts load from Google Fonts)

### PDF too large
- Use `compileCompressed()` method
- Reduce `SCREENSHOT_SCALE` to 1

### Style guide not detected
- Ensure filename matches pattern: `*-style.md` or `*-style-guide*.md`
- Check file is in workspace root, `.claude/skills/`, or Desktop folder

## Dependencies

- **puppeteer**: Browser automation for screenshots
- **pdf-lib**: PDF creation and manipulation
- **axios**: HTTP client for API calls
- **sharp**: Image optimization (optional)
- **dotenv**: Environment variable management

## Performance

- **Processing time**: ~2-3 seconds per slide
- **Memory usage**: ~500MB for browser
- **File sizes**:
  - PNG (2x): ~2-3 MB per slide
  - PDF: ~2-5 MB total (compressed)

## Limitations

- Maximum 50 slides per presentation (performance)
- OpenRouter API rate limits apply
- Requires active internet connection for fonts and images

## Best Practices

1. **Keep slides focused**: 5-7 bullets max per slide
2. **Use high-contrast colors**: Better for screenshots
3. **Limit image generation**: Photos only where needed (saves costs)
4. **Organize style guides**: Use consistent naming
5. **Test styles**: Preview with sample content first

## Integration with Other Skills

This skill works well with:
- **presentation-style-pitch-deck**: Professional investor pitch styling
- **dwco-style**: Corporate B2B presentations
- **startup-presentation-style**: Startup pitch decks

## API Reference

### PresentationCreator

```javascript
const PresentationCreator = require('./scripts/create-presentation');
const creator = new PresentationCreator();

// Set content
creator.setContent(markdownContent, 'markdown');

// Select style (1-based index)
await creator.setStyleBySelection(1);

// Set name
creator.setPresentationName('My Presentation');

// Run workflow
await creator.create();
```

### Standalone Usage

Each component can be used independently:

```javascript
// Parse content
const parser = new ContentParser();
const slides = parser.parse(content, 'markdown');

// Discover styles
const discovery = new StyleGuideDiscovery();
const guides = await discovery.discoverAll();

// Generate HTML
const htmlGen = new HTMLGenerator(styleGuide);
await htmlGen.generateAll(slides, outputDir);

// Capture screenshots
const screenshots = new ScreenshotGenerator();
await screenshots.generateAll(htmlPaths, outputDir);

// Compile PDF
const pdf = new PDFCompiler();
await pdf.compile(pngPaths, 'output.pdf');
```

## Support

For issues or questions:
1. Check this documentation
2. Review console error messages
3. Verify `.env` configuration
4. Check OpenRouter API status

## License

MIT License - Created by Terrance Brandon with Claude

## Version

1.0.0 - Initial release
