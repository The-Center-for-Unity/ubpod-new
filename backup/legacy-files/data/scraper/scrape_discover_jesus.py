import requests
from bs4 import BeautifulSoup
import json
import time
from pathlib import Path
import os
import re
import logging
import datetime

class DiscoverJesusScraper:
    def __init__(self):
        self.base_url = "https://discoverjesus.com"
        self.session = requests.Session()
        # Add headers to mimic a browser
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
        })
        
        # Create necessary directories
        os.makedirs('scraper', exist_ok=True)
        os.makedirs('src/data', exist_ok=True)
        
        # Store the root directory (one level up from scraper)
        self.root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        # URL corrections map
        self.url_corrections = {
            # Event corrections
            "conference-with-john-s-apostles": "conference-with-johns-apostles",
            "jesus-establishes-the-women-s-corps": "jesus-establishes-the-womens-corps",
            "jesus-first-passover-age": "jesus-first-passover-age-13",
            "pilate-s-last-appeal-and-surrender": "pilates-last-appeal-and-surrender",
            "training-the-kingdom-s-messengers": "training-the-kingdoms-messengers",
            
            # Group corrections
            "zebedee-s-family": "zebedees-family",
            "women-s-evangelistic-corps": "womens-evangelistic-corps",
            
            # Person corrections
            "philip": "philip-apostle-of-jesus",
            "apostle-of-jesus": "philip-apostle-of-jesus",
            "of-sepphoris": "rebecca-of-sepphoris",
            "elizabeth": "elizabeth-mother-of-john-the-baptist",
            "mother-of-john-the-baptist": "elizabeth-mother-of-john-the-baptist",
            "mother-of-jesus": "mary-mother-of-jesus",
            "father-of-jesus": "joseph-father-of-jesus",
            "wife-of-elijah-mark": "mary-wife-of-elijah-mark",
            "wife-of-zebedee": "salome-wife-of-zebedee",
            "brother-of-jesus": "james-brother-of-jesus",  # Default to James, others need context
            "sister-of-jesus": "ruth-sister-of-jesus",    # Default to Ruth, others need context
            "of-bethany": "martha-of-bethany",           # Default to Martha, Mary needs context
            
            # Topic corrections
            "jesus-divine-human-nature": "jesus-combined-nature-human-and-divine",
            "jesus-combined-nature": "jesus-combined-nature-human-and-divine",
            "jesus-return-second-coming": "jesus-return-the-masters-second-coming",
            "jesus-personal-ministry-as-he-passed-by": "jesus-ministry-as-he-passed-by",
            
            # Category corrections
            "person/establishing-jesus-ancestry": "topic/establishing-jesus-ancestry"
        }

    def sanitize_url_part(self, text):
        """
        Sanitize text to match the website's URL pattern with corrections
        """
        # First apply the basic sanitization
        text = text.lower()
        text = text.replace("'", "").replace('"', '')
        text = text.replace('–', '-').replace('—', '-').replace('_', '-')
        text = re.sub(r'[^\w\-]', '-', text)
        text = re.sub(r'-+', '-', text)
        text = text.strip('-')
        
        # Check if this URL part needs correction
        if text in self.url_corrections:
            return self.url_corrections[text]
            
        # Special handling for "of-bethany" to differentiate between Martha and Mary
        if text == "of-bethany":
            # You'll need to check the context to determine if it's Martha or Mary
            # This will need to be handled in the URL generation logic
            pass
            
        return text

    def get_page(self, url):
        """Fetch a page with error handling and retries"""
        max_retries = 3
        for attempt in range(max_retries):
            try:
                print(f"\nAttempting to fetch {url} (attempt {attempt + 1}/{max_retries})")
                response = self.session.get(url)
                response.raise_for_status()
                
                # Save the HTML response for debugging
                debug_path = os.path.join(self.root_dir, 'scraper/debug')
                os.makedirs(debug_path, exist_ok=True)
                page_name = url.split('/')[-1] or 'index'
                with open(os.path.join(debug_path, f"{page_name}.html"), 'w', encoding='utf-8') as f:
                    f.write(response.text)
                
                print(f"Successfully fetched {url}")
                print(f"Response status: {response.status_code}")
                print(f"Response length: {len(response.text)} bytes")
                return response.text
            except requests.RequestException as e:
                print(f"Error fetching {url} (attempt {attempt + 1}): {str(e)}")
                if attempt == max_retries - 1:
                    raise
                time.sleep(2 ** attempt)  # Exponential backoff

    def extract_urls_from_tree(self, tree_file_path):
        """Extract URLs from the tree-level6.txt file"""
        # Use absolute path
        abs_path = os.path.join(self.root_dir, tree_file_path)
        print(f"Reading tree file from: {abs_path}")
        
        urls = []
        total_files = 0
        skipped_files = {
            'not_entry': 0,
            'docx_txt': 0,
            'no_hyphen': 0,
            'unknown_category': 0
        }
        
        with open(abs_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                
                # Count total potential files
                if line.startswith('├── ') or line.startswith('└── '):
                    total_files += 1
                    # Remove the tree symbols
                    filename = line[4:].strip()
                    
                    # Debug print
                    print(f"\nProcessing: {filename}")
                    
                    # Skip the .docx and .txt files
                    if filename.endswith(('.docx', '.txt')):
                        print(f"Skipping docx/txt file: {filename}")
                        skipped_files['docx_txt'] += 1
                        continue
                    
                    # Remove the .mp3 extension and number suffix
                    filename = filename.replace('.mp3', '')
                    filename = re.sub(r'\d+$', '', filename)  # Remove trailing numbers
                    
                    # Try to extract category and title
                    category = None
                    title = None
                    
                    # First try splitting on both regular hyphen and em dash with spaces
                    if ' - ' in filename:
                        parts = filename.split(' - ', 1)
                        category, title = parts
                    elif ' – ' in filename:
                        parts = filename.split(' – ', 1)
                        category, title = parts
                    
                    # Special handling for Bethany cases
                    if "Martha of Bethany" in filename:
                        category = "Person"
                        title = "martha-of-bethany"
                    elif "Mary of Bethany" in filename:
                        category = "Person"
                        title = "mary-of-bethany"
                    elif not category:
                        # Try to extract category from the start of the filename
                        for cat in ['Person', 'Event', 'Topic', 'Group', 'Relationship', 'Object']:
                            if filename.startswith(cat):
                                category = cat
                                title = filename[len(cat):].strip()
                                # Handle both types of dashes after category
                                if title.startswith(' - '):
                                    title = title[3:]
                                elif title.startswith(' – '):
                                    title = title[3:]
                                break
                    
                    # If still no category found, try to infer from content
                    if not category:
                        if any(word in filename for word in ['Jesus', 'Mary', 'Joseph', 'John', 'Peter', 'Paul']):
                            category = 'Person'
                            title = filename
                        elif any(word in filename for word in ['Baptism', 'Birth', 'Death', 'Resurrection']):
                            category = 'Event'
                            title = filename
                        elif any(word in filename for word in ['Establishing', 'Concepts', 'History', 'Philosophy']):
                            category = 'Topic'
                            title = filename
                        else:
                            print(f"No category found in: {filename}")
                            skipped_files['no_hyphen'] += 1
                            continue
                    
                    # Clean up the category
                    category = category.strip().lower()
                    original_category = category
                    
                    # Map category
                    if category.startswith('person'):
                        category = 'person'
                    elif category.startswith('event'):
                        category = 'event'
                    elif category.startswith('topic'):
                        category = 'topic'
                    elif category.startswith('group'):
                        category = 'group'
                    elif category.startswith('relationship'):
                        category = 'relationship'
                    elif category.startswith('object'):
                        category = 'object'
                    else:
                        print(f"Unknown category '{original_category}' in: {filename}")
                        skipped_files['unknown_category'] += 1
                        continue
                    
                    # Clean up the title and apply corrections
                    url_title = self.sanitize_url_part(title)
                    
                    # Create the URL
                    url = f"{self.base_url}/{category}/{url_title}"
                    
                    # Check if this specific URL needs category correction
                    category_specific_url = f"{category}/{url_title}"
                    if category_specific_url in self.url_corrections:
                        corrected_path = self.url_corrections[category_specific_url]
                        url = f"{self.base_url}/{corrected_path}"
                    
                    # Print debug info
                    print(f"✓ Category: {category}")
                    print(f"✓ Original title: {title}")
                    print(f"✓ Sanitized title: {url_title}")
                    print(f"✓ Generated URL: {url}")
                    print("---")
                    
                    urls.append(url)
                else:
                    skipped_files['not_entry'] += 1
        
        # Print summary
        print("\nFile Processing Summary:")
        print(f"Total lines in file: {total_files}")
        print(f"Generated URLs: {len(urls)}")
        print("\nSkipped files breakdown:")
        print(f"- Not file entries: {skipped_files['not_entry']}")
        print(f"- Docx/txt files: {skipped_files['docx_txt']}")
        print(f"- No hyphen separator: {skipped_files['no_hyphen']}")
        print(f"- Unknown categories: {skipped_files['unknown_category']}")
        
        return urls

    def scrape_summary(self, url):
        """Scrape summary data from a single page"""
        html = self.get_page(url)
        soup = BeautifulSoup(html, 'html.parser')
        
        # Get the ID from the URL
        path_parts = url.split('/')
        page_id = '/'.join(path_parts[-2:])  # Include category (person/event/etc)
        
        print(f"\nScraping content for {page_id}:")
        
        # Find the title
        title = soup.find('h1', class_='entry-title')
        title_text = title.text.strip() if title else None
        print(f"Found title: {title_text}")
        
        # Find the short summary (subtitle)
        short_summary = soup.find('div', class_='entry-subtitle')
        short_summary_text = short_summary.text.strip() if short_summary else None
        print(f"Found short summary: {short_summary_text}")
        
        # Find the full summary
        summary_section = soup.find('div', class_='summary-section')
        full_summary_text = summary_section.text.strip() if summary_section else None
        print(f"Found full summary: {full_summary_text}")
        
        # If we didn't find the elements with the expected classes, try alternative selectors
        if not title_text:
            title = soup.find('h1')  # Try any h1
            title_text = title.text.strip() if title else None
            print(f"Found title (alternative): {title_text}")
        
        if not short_summary_text:
            # Try to find a subtitle-like element
            candidates = soup.find_all(['h2', 'div', 'p'], class_=lambda x: x and ('subtitle' in x.lower() or 'summary' in x.lower()))
            if candidates:
                short_summary_text = candidates[0].text.strip()
                print(f"Found short summary (alternative): {short_summary_text}")
        
        if not full_summary_text:
            # Try to find a main content area
            content = soup.find(['article', 'main', 'div'], class_=lambda x: x and ('content' in x.lower() or 'entry' in x.lower()))
            if content:
                paragraphs = content.find_all('p')
                full_summary_text = '\n'.join(p.text.strip() for p in paragraphs[:3])  # Take first 3 paragraphs
                print(f"Found full summary (alternative): {full_summary_text}")
        
        return {
            "id": page_id,
            "title": title_text,
            "shortSummary": short_summary_text,
            "fullSummary": full_summary_text,
            "sourceUrl": url
        }

    def save_to_typescript(self, summaries, output_path):
        """Save the summaries as a TypeScript file"""
        # Convert to the format expected by the React app
        ts_data = {
            summary["id"]: {
                "id": summary["id"],
                "shortSummary": summary["shortSummary"],
                "fullSummary": summary["fullSummary"]
            }
            for summary in summaries
            if summary["shortSummary"] or summary["fullSummary"]  # Only include entries with content
        }
        
        # Create TypeScript content
        ts_content = """// Auto-generated from Python scraper
export interface DiscoverJesusSummary {
  id: string;
  shortSummary: string;
  fullSummary: string;
}

export const discoverJesusSummaries: Record<string, DiscoverJesusSummary> = """
        
        # Add the data as JSON
        ts_content += json.dumps(ts_data, indent=2)
        ts_content += ";\n"
        
        # Use absolute path for output
        abs_output_path = os.path.join(self.root_dir, output_path)
        
        # Write the file
        with open(abs_output_path, 'w', encoding='utf-8') as f:
            f.write(ts_content)

    def scrape_all(self, urls):
        """Scrape all provided URLs"""
        summaries = []
        for url in urls:
            try:
                print(f"\nScraping {url}...")
                summary = self.scrape_summary(url)
                if summary["shortSummary"] or summary["fullSummary"]:
                    summaries.append(summary)
                    print(f"Successfully scraped content for {url}")
                else:
                    print(f"No content found for {url}")
                
                # Save progress after each successful scrape
                self.save_progress(summaries)
                
                # Be nice to the server
                time.sleep(2)  # Increased delay to be more conservative
            except Exception as e:
                print(f"Error scraping {url}: {str(e)}")
                # Save the error for debugging
                with open(os.path.join(self.root_dir, 'scraper/errors.log'), 'a') as f:
                    f.write(f"{url}: {str(e)}\n")
        return summaries

    def save_progress(self, summaries):
        """Save progress to a JSON file"""
        progress_path = os.path.join(self.root_dir, 'scraper/progress.json')
        with open(progress_path, 'w', encoding='utf-8') as f:
            json.dump(summaries, f, indent=2)

def save_summary_log(validation_results, timestamp):
    """Create a summary log file with valid and invalid URLs"""
    summary_log_file = f'scraper/logs/url_summary_{timestamp}.log'
    
    with open(summary_log_file, 'w') as f:
        f.write("=== URL VALIDATION SUMMARY ===\n\n")
        
        # Write valid URLs
        f.write("VALID URLs:\n")
        f.write("===========\n")
        for url in validation_results['success']:
            f.write(f"✓ {url}\n")
        f.write(f"\nTotal Valid URLs: {len(validation_results['success'])}\n\n")
        
        # Write redirecting URLs
        if validation_results['redirect']:
            f.write("\nREDIRECTING URLs:\n")
            f.write("================\n")
            for old_url, new_url in validation_results['redirect']:
                f.write(f"⚠ {old_url}\n  → {new_url}\n")
            f.write(f"\nTotal Redirecting URLs: {len(validation_results['redirect'])}\n\n")
        
        # Write invalid URLs
        if validation_results['not_found']:
            f.write("\nINVALID URLs (404):\n")
            f.write("=================\n")
            for url in validation_results['not_found']:
                f.write(f"✗ {url}\n")
            f.write(f"\nTotal Invalid URLs: {len(validation_results['not_found'])}\n\n")
        
        # Write error URLs
        if validation_results['error']:
            f.write("\nERROR URLs:\n")
            f.write("===========\n")
            for url, error in validation_results['error']:
                f.write(f"⚠ {url}\n  Error: {error}\n")
            f.write(f"\nTotal Error URLs: {len(validation_results['error'])}\n")
    
    return summary_log_file

def main():
    # Set up logging
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    log_file = f'scraper/logs/url_validation_{timestamp}.log'
    os.makedirs('scraper/logs', exist_ok=True)
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()
        ]
    )
    
    tree_file_path = "docs/New Series/tree-level6.txt"
    logging.info(f"Starting URL validation from {tree_file_path}")
    
    scraper = DiscoverJesusScraper()
    
    logging.info("Extracting URLs from tree file...")
    urls = scraper.extract_urls_from_tree(tree_file_path)
    logging.info(f"Found {len(urls)} URLs to validate")
    
    # First, validate all URLs without scraping
    logging.info("\nValidating URLs...")
    valid_urls = []
    invalid_urls = {}
    validation_results = {
        'success': [],
        'redirect': [],
        'not_found': [],
        'error': []
    }
    
    for url in urls:
        try:
            logging.info(f"\nChecking URL: {url}")
            response = scraper.session.head(url, allow_redirects=True)
            
            if response.status_code == 200:
                if response.url == url:
                    logging.info(f"✓ Valid URL: {url}")
                    validation_results['success'].append(url)
                    valid_urls.append(url)
                else:
                    logging.warning(f"⚠ URL redirects: {url} -> {response.url}")
                    validation_results['redirect'].append((url, response.url))
            else:
                logging.error(f"✗ Invalid URL (status {response.status_code}): {url}")
                validation_results['not_found'].append(url)
                # Extract category and title from URL
                parts = url.split('/')
                category = parts[-2]
                title = parts[-1]
                invalid_urls[url] = {
                    "category": category,
                    "title": title,
                    "status_code": response.status_code,
                    "correct_url": ""  # To be filled out manually
                }
        except requests.RequestException as e:
            logging.error(f"✗ Error checking URL: {url}")
            logging.error(f"  Error: {str(e)}")
            validation_results['error'].append((url, str(e)))
            # Also add failed requests to invalid URLs
            parts = url.split('/')
            category = parts[-2]
            title = parts[-1]
            invalid_urls[url] = {
                "category": category,
                "title": title,
                "error": str(e),
                "correct_url": ""  # To be filled out manually
            }
        
        # Small delay between checks
        time.sleep(0.5)
    
    # Create summary log file
    summary_log_file = save_summary_log(validation_results, timestamp)
    
    # Write validation summary to log
    logging.info("\nURL Validation Summary:")
    logging.info(f"Total URLs: {len(urls)}")
    logging.info(f"Valid URLs: {len(validation_results['success'])}")
    logging.info(f"Redirecting URLs: {len(validation_results['redirect'])}")
    logging.info(f"Not Found URLs: {len(validation_results['not_found'])}")
    logging.info(f"Error URLs: {len(validation_results['error'])}")
    
    # Log detailed results
    if validation_results['redirect']:
        logging.info("\nRedirecting URLs:")
        for old_url, new_url in validation_results['redirect']:
            logging.info(f"  {old_url} -> {new_url}")
    
    if validation_results['not_found']:
        logging.info("\nNot Found URLs:")
        for url in validation_results['not_found']:
            logging.info(f"  {url}")
    
    if validation_results['error']:
        logging.info("\nError URLs:")
        for url, error in validation_results['error']:
            logging.info(f"  {url}: {error}")
    
    # Save valid URLs for reference
    with open(os.path.join(scraper.root_dir, 'scraper/valid_urls.json'), 'w') as f:
        json.dump(valid_urls, f, indent=2)
    
    # Save invalid URLs for manual correction
    with open(os.path.join(scraper.root_dir, 'scraper/invalid_urls.json'), 'w') as f:
        json.dump(invalid_urls, f, indent=2, sort_keys=True)
    
    logging.info(f"\nLog files have been saved to:")
    logging.info(f"- Detailed log: {log_file}")
    logging.info(f"- Summary log: {summary_log_file}")
    logging.info("Invalid URLs have been saved to 'scraper/invalid_urls.json'")
    
    if len(valid_urls) == 0:
        logging.error("\nNo valid URLs found. Please check the URL generation logic.")
        return
    
    # Ask to proceed with scraping only if we haven't found invalid URLs
    if len(invalid_urls) > 0:
        logging.warning("\nPlease fix invalid URLs before proceeding with scraping.")
        return
        
    proceed = input("\nDo you want to proceed with scraping the valid URLs? (y/n): ")
    if proceed.lower() != 'y':
        logging.info("Exiting before scraping...")
        return
    
    logging.info("\nStarting full scrape...")
    summaries = scraper.scrape_all(valid_urls)
    
    # Save as TypeScript file
    output_path = "src/data/discoverJesusSummaries.ts"
    scraper.save_to_typescript(summaries, output_path)
    print(f"\nSaved {len(summaries)} summaries to {output_path}")
    
    # Save raw data as JSON
    summaries_path = os.path.join(scraper.root_dir, 'scraper/summaries.json')
    with open(summaries_path, 'w', encoding='utf-8') as f:
        json.dump(summaries, f, indent=2)
    print("Saved raw data to scraper/summaries.json")

if __name__ == "__main__":
    main() 