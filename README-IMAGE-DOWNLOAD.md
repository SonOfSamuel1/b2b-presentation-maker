# Church Presentation Image Downloader

Automated Playwright script to help download 8 high-quality images for your church presentation from Unsplash and Pexels.

## Quick Start (Easiest Method)

### Option 1: One-Command Setup and Run
```bash
cd "/Users/terrancebrandon/Desktop/Code Projects (Official)/App- B2B- Presentation Maker"
./install-and-run.sh
```

This single command will:
- Install all dependencies
- Set up Playwright and Chromium browser
- Create the output folders
- Run the image downloader

### Option 2: Manual Setup
```bash
# Navigate to project
cd "/Users/terrancebrandon/Desktop/Code Projects (Official)/App- B2B- Presentation Maker"

# Install dependencies
npm install playwright
npx playwright install chromium

# Run the script
node download-church-images.js
```

## What This Script Does

1. **Automates searching** - Opens Unsplash/Pexels and searches for each image type
2. **Shows you results** - Browser opens with search results
3. **Pauses for your selection** - You review and download the image you like best
4. **Continues automatically** - Press ENTER to move to the next image
5. **Generates report** - Creates a summary of all downloads

## Images That Will Be Downloaded (8 Total)

1. **Church Building Exterior** - Modern, welcoming architecture
2. **Worship Service** - Congregation with raised hands
3. **Small Group Bible Study** - Intimate discussion setting
4. **Kids Church Ministry** - Children engaged in activities
5. **Leadership Training** - Professional development setting
6. **Community Service/Outreach** - Volunteers serving community
7. **Mission Trip/Global Missions** - International development work
8. **Church Growth/Large Congregation** - Large attendance view

## Output Location

All images will be saved to:
```
12stone-church-presentation/images/
```

## Requirements

- Node.js (already installed - v22.21.0)
- Internet connection
- Approximately 400MB disk space for Playwright/Chromium
- 15-25 minutes of time

## How It Works

### For Each Image:

1. Script searches Unsplash automatically
2. Browser shows search results
3. You see instructions like this:

```
======================================================================
IMAGE SELECTION REQUIRED
======================================================================
Image: Church Building Exterior
Search Query: "modern church building exterior"
Save As: church-exterior.jpg

INSTRUCTIONS:
1. Review the search results
2. Click your preferred image
3. Download high-resolution version
4. Save with the correct filename
5. Press ENTER to continue
======================================================================
```

4. You download the image you like
5. Press ENTER to continue
6. Repeat for next image

### Why Human-in-the-Loop?

This script uses a "human-in-the-loop" approach where you manually select each image because:
- **Quality matters** - You can judge which image best fits your presentation
- **Authentic selection** - Avoid overly staged or inappropriate images
- **Creative control** - Choose images that match your church's style and values
- **License compliance** - Ensure you're selecting genuinely free images

## Files Created

### Main Script
- `download-church-images.js` - The automation script

### Documentation
- `SETUP-INSTRUCTIONS.md` - Detailed setup guide
- `README-IMAGE-DOWNLOAD.md` - This file (quick reference)

### Output Files
- `12stone-church-presentation/images/` - Downloaded images
- `12stone-church-presentation/images/download-report.json` - Summary report
- `screenshots/` - Screenshots of search results (for debugging)

## Troubleshooting

### "Cannot find module 'playwright'"
```bash
npm install playwright
npx playwright install chromium
```

### "Images not appearing in folder"
- Check your browser's Downloads folder
- Manually move images to the images folder
- Ensure you're renaming them correctly

### "Search results aren't good"
- Try the alternate search queries mentioned in prompts
- Manually visit Unsplash.com or Pexels.com
- Use similar search terms

### "Want to skip an image"
- Just press ENTER without downloading
- Download it manually later
- Script will mark it in the report

## Image Quality Guidelines

Look for:
- High resolution (1920px+ on longest side)
- Professional photography quality
- Authentic, not overly staged
- Diverse representation
- Good lighting and composition
- Appropriate for church context

## License Information

**Unsplash**: Free to use, no attribution required
**Pexels**: Free to use, no attribution required

Both platforms provide images under generous licenses perfect for presentations.

## Time Estimate

- Setup (first time): 5-10 minutes
- Image downloads: 15-20 minutes
- Total: 20-30 minutes

## Support

For detailed instructions, see: `SETUP-INSTRUCTIONS.md`

For issues:
1. Check the screenshots folder for debugging
2. Review download-report.json for details
3. Try running the script again (safe to re-run)

## Quick Commands Reference

```bash
# Navigate to project
cd "/Users/terrancebrandon/Desktop/Code Projects (Official)/App- B2B- Presentation Maker"

# One-command run
./install-and-run.sh

# Or manual run
node download-church-images.js

# Check output
ls -la "12stone-church-presentation/images/"

# View report
cat "12stone-church-presentation/images/download-report.json"
```

---

**Created**: 2025-11-10
**Purpose**: Automate church presentation image downloads with quality control
