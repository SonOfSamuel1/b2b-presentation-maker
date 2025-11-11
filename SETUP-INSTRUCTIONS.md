# Church Presentation Image Download - Setup Instructions

## Overview
This automated script helps you download 8 high-quality images for your church presentation from Unsplash and Pexels. The script handles searching automatically and pauses to let you select the best image for each category.

## Prerequisites

### 1. Node.js
You already have Node.js v22.21.0 installed - perfect!

### 2. Install Playwright

Run these commands in your terminal:

```bash
# Navigate to your project directory
cd "/Users/terrancebrandon/Desktop/Code Projects (Official)/App- B2B- Presentation Maker"

# Initialize npm (if not already done)
npm init -y

# Install Playwright
npm install playwright

# Install Playwright browsers
npx playwright install chromium
```

This will download the Chromium browser needed for automation (approximately 400MB).

## How to Run the Script

### Step 1: Open Terminal
Open Terminal and navigate to your project directory:

```bash
cd "/Users/terrancebrandon/Desktop/Code Projects (Official)/App- B2B- Presentation Maker"
```

### Step 2: Run the Script
Execute the download script:

```bash
node download-church-images.js
```

### Step 3: Follow the Prompts

The script will:

1. **Automatically search** for each image on Unsplash
2. **Display search results** in the browser
3. **Pause and show you instructions** like this:

```
======================================================================
IMAGE SELECTION REQUIRED
======================================================================
Image: Church Building Exterior
Search Query: "modern church building exterior"
Required Dimensions: 600x600px (square) or larger
Style: Professional, welcoming, contemporary church architecture
Save As: church-exterior.jpg

INSTRUCTIONS:
1. Review the search results on the page
2. Click on your preferred image
3. Download the high-resolution version
4. Save it as: church-exterior.jpg
5. Move it to: /Users/terrancebrandon/.../images/

Press ENTER when you have completed the download...
======================================================================
```

4. **Wait for you to**:
   - Review the search results
   - Click on your favorite image
   - Click the download button (usually says "Download free" or "Free download")
   - Save the file with the correct name in the images folder
   - Press ENTER to continue

5. **Move to the next image** and repeat

## Download Instructions for Each Site

### Unsplash.com (Primary Source)
1. Click on the image you like
2. Click the green "Download free" button in the top right
3. The image will download automatically
4. Rename it to the specified filename
5. Move it to the images folder

### Pexels.com (Backup Source)
1. Click on the image you like
2. Click the green "Free Download" dropdown
3. Select "Original" or the largest size available
4. The image will download
5. Rename it to the specified filename
6. Move it to the images folder

## File Organization

All images should be saved to:
```
/Users/terrancebrandon/Desktop/Code Projects (Official)/App- B2B- Presentation Maker/12stone-church-presentation/images/
```

The script creates this folder automatically.

## Images to Download (8 Total)

| # | Image Type | Filename | Search Query |
|---|------------|----------|--------------|
| 1 | Church Building Exterior | `church-exterior.jpg` | modern church building exterior |
| 2 | Worship Service | `worship-service.jpg` | church worship service congregation |
| 3 | Small Group Bible Study | `ministry-discipleship.jpg` | small group bible study diverse |
| 4 | Kids Church Ministry | `ministry-kids.jpg` | children church ministry kids |
| 5 | Leadership Training | `ministry-leadership.jpg` | leadership training seminar professional |
| 6 | Community Service/Outreach | `community-outreach.jpg` | community service volunteers helping |
| 7 | Mission Trip/Global Missions | `global-missions.jpg` | mission trip africa building school |
| 8 | Church Growth/Large Congregation | `church-growth-2011.jpg` | large church crowd worship |

## Quality Guidelines

For each image, look for:
- **High resolution**: At least 1920px on the longest side
- **Professional quality**: Good lighting, composition, and focus
- **Authentic feel**: Not overly staged or stock-photo-like
- **Diverse representation**: When showing people, look for diversity
- **Appropriate style**: Matches the description for that image type

## After Completion

The script will generate a final report showing:
- How many images were successfully downloaded
- Which images (if any) need manual attention
- File paths for all downloaded images

A detailed JSON report will be saved to:
```
/Users/terrancebrandon/Desktop/Code Projects (Official)/App- B2B- Presentation Maker/12stone-church-presentation/images/download-report.json
```

## Troubleshooting

### Script won't start
- Make sure you installed Playwright: `npm install playwright`
- Make sure you installed browsers: `npx playwright install chromium`

### Can't find the downloaded images
- Check your browser's default download folder (usually ~/Downloads)
- Move them to the images folder manually
- Make sure to rename them to match the required filenames

### Search results aren't good
- The script tries Unsplash first, then Pexels
- You can manually go to either site and search yourself
- Use the search queries provided in the script output

### Want to skip an image
- Just press ENTER without downloading
- The script will mark it as "failed" in the report
- You can download it manually later

## Manual Download (If Needed)

If the script has issues or you prefer manual download:

1. Visit https://unsplash.com or https://www.pexels.com
2. Search for each image using the search queries above
3. Download the highest resolution available
4. Save with the correct filename
5. Move to: `/Users/terrancebrandon/Desktop/Code Projects (Official)/App- B2B- Presentation Maker/12stone-church-presentation/images/`

## Support

If you encounter any issues:
1. Check the screenshots folder for visual debugging
2. Review the download-report.json for details
3. Make sure your internet connection is stable
4. Try running the script again - it's safe to re-run

## License & Attribution

Both Unsplash and Pexels provide free images. However:
- **Unsplash**: Free to use, no attribution required (but appreciated)
- **Pexels**: Free to use, no attribution required

Consider giving credit to photographers if possible, especially for church presentations.

## Time Estimate

Expect the entire process to take approximately:
- 15-25 minutes for all 8 images
- 2-3 minutes per image (search, review, select, download)

The script automates the searching to save you time!
