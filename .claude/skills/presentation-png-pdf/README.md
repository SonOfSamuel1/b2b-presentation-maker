# Presentation PNG/PDF Creator

A Claude skill for creating high-quality presentation slides as PNG images and compiled PDFs with custom SVG graphics and AI-generated photos.

## Quick Setup

1. **Install dependencies**:
```bash
cd .claude/skills/presentation-png-pdf
npm install
```

2. **Configure OpenRouter** (required for image generation):
```bash
cp .env.example .env
# Edit .env and add your OpenRouter API key:
# OPENROUTER_API_KEY=sk-or-v1-your_key_here
```

3. **Use with Claude**:
```
"Create a presentation about [topic]"
```

## Features

- 📊 High-res PNG slides (3840x2160)
- 📄 Compiled PDF output
- 🎨 Custom SVG graphics (no emojis)
- 🖼️ AI-generated photos (OpenRouter)
- 🎭 Style guide integration
- 📝 Multiple input formats

## Output

All presentations saved to:
```
/Users/terrancebrandon/Desktop/AI Presentations/
```

## Documentation

See [SKILL.md](./SKILL.md) for complete documentation.

## Requirements

- Node.js 16+
- OpenRouter API key
- Internet connection (for fonts & image generation)

## License

MIT
