# UBPod Translation Review System - Setup Instructions

## For Project Owner (Gabriel)

### Step 1: Create Google Sheets

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: `UBPod Translation Review - Spanish` (or French/Portuguese)

### Step 2: Add Apps Script

1. In your spreadsheet, go to **Extensions > Apps Script**
2. Delete any existing code in `Code.gs`
3. Copy all the code from the following files in order:
   - `Code.gs` - Main script
   - Click the **+** next to Files and select **Script**
   - Name it `Import.gs` and paste the import code
   - Repeat for `Export.gs` and `Screenshots.gs`
   - Click **+** next to Files and select **HTML**
   - Name it `ImportDialog.html` and paste the HTML code

### Step 3: Configure Settings

1. Save all files (Ctrl+S or Cmd+S)
2. Go back to your spreadsheet
3. Refresh the page (F5)
4. You should see a new menu: **UBPod Translations**
5. Click **UBPod Translations > Settings**
6. Fill in the Settings sheet:
   ```
   language: es (or fr, pt)
   githubRepo: your-username/ubpod-new
   baseUrl: https://raw.githubusercontent.com/your-username/ubpod-new/main
   screenshotApiKey: (optional - get from screenshotmachine.com)
   ```

### Step 4: Import Translations

1. Click **UBPod Translations > Import JSON Files**
2. Select the language
3. Click **Import Translations**
4. Wait for the import to complete (may take 1-2 minutes)

### Step 5: Share with Reviewers

1. Click the **Share** button in the top right
2. Add reviewer emails with **Editor** access
3. Send them the `REVIEWER_GUIDE.md` instructions

## For Each Language

Create separate spreadsheets for each language:
- Spanish: `UBPod Translation Review - Spanish`
- French: `UBPod Translation Review - French`
- Portuguese: `UBPod Translation Review - Portuguese`

## Troubleshooting

### "Script not authorized" error
1. When you first run the script, you'll get an authorization prompt
2. Click **Review Permissions**
3. Choose your Google account
4. Click **Advanced** > **Go to UBPod Translations (unsafe)**
5. Click **Allow**

### Import fails
- Check that your GitHub repository is public
- Verify the baseUrl in Settings is correct
- Make sure the JSON files exist at the specified paths

### Screenshots not working
1. Get a free API key from [screenshotmachine.com](https://www.screenshotmachine.com)
2. Add it to the Settings sheet
3. Run **Update Screenshots**

## API Keys for Screenshots (Optional)

Free options:
- [ScreenshotMachine](https://www.screenshotmachine.com) - 100 free/month
- [ApiFlash](https://apiflash.com) - 100 free/month
- [Urlbox](https://urlbox.io) - 1,000 free/month

## Next Steps

1. Import translations for each language
2. Share with reviewers
3. Monitor progress in the **Review Status** sheet
4. Export completed translations when ready