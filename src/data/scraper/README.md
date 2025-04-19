# DiscoverJesus.com Scraper

This Python script scrapes summaries from DiscoverJesus.com and saves them in a format compatible with the UrantiaBookPod React application.

## Setup

1. Create a Python virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# On macOS/Linux:
source venv/bin/activate

# On Windows:
.\venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

1. Edit the `urls` list in `scrape_discover_jesus.py` to include all the URLs you want to scrape.

2. Run the scraper:
```bash
python scrape_discover_jesus.py
```

The script will:
- Scrape each URL with a 1-second delay between requests
- Save progress to `progress.json` after each successful scrape
- Save the final results to:
  - `src/data/discoverJesusSummaries.ts` (TypeScript format for the React app)
  - `scraper/summaries.json` (Raw JSON data)

## Features

- Automatic retries with exponential backoff
- Progress saving
- Browser-like headers to avoid blocking
- TypeScript-compatible output
- Error handling and logging 