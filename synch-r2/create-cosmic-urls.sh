#!/bin/bash

# R2 Configuration
# Load from environment variables
BUCKET_ID=${R2_BUCKET_ID:-""}
if [ -z "$BUCKET_ID" ]; then
    echo "Error: Missing required environment variable R2_BUCKET_ID"
    echo "Please set it in your environment or .env file before running this script."
    echo "Example: export R2_BUCKET_ID=your_bucket_id"
    exit 1
fi

BASE_URL="https://pub-${BUCKET_ID}.r2.dev"

# Create the mapping file
echo "{" > "src/data/json/cosmic-series-urls.json"
echo "  \"cosmicSeriesUrls\": {" >> "src/data/json/cosmic-series-urls.json"

# Function to add a mapping
add_mapping() {
    cosmic_file=$1
    paper_file=$2
    encoded_file=$(echo "$paper_file" | python3 -c 'import urllib.parse; import sys; print(urllib.parse.quote(sys.stdin.read().strip()))')
    url="${BASE_URL}/${encoded_file}"
    echo "    \"${cosmic_file}\": \"${url}\"," >> "src/data/json/cosmic-series-urls.json"
}

# Add mappings for each cosmic series episode
add_mapping "cosmic-1-1.mp3" "Paper 1 - The Universal Father.mp3"
add_mapping "cosmic-1-2.mp3" "Paper 12 - The Universe of Universes.mp3"
add_mapping "cosmic-1-3.mp3" "Paper 13 - The Sacred Spheres of Paradise.mp3"
add_mapping "cosmic-1-4.mp3" "Paper 15 - The Seven Superuniverses.mp3"
add_mapping "cosmic-1-5.mp3" "Paper 42 - Energy—Mind and Matter.mp3"
add_mapping "cosmic-2-1.mp3" "Paper 6 - The Eternal Son.mp3"
add_mapping "cosmic-2-2.mp3" "Paper 8 - The Infinite Spirit.mp3"
add_mapping "cosmic-2-3.mp3" "Paper 10 - The Paradise Trinity.mp3"
add_mapping "cosmic-2-4.mp3" "Paper 20 - The Paradise Sons of God.mp3"
add_mapping "cosmic-2-5.mp3" "Paper 16 - Ministering Spirits of Space.mp3"
add_mapping "cosmic-3-1.mp3" "Paper 107 - Origin and Nature of Thought Adjusters.mp3"
add_mapping "cosmic-3-2.mp3" "Paper 108 - Mission and Ministry of Thought Adjusters.mp3"
add_mapping "cosmic-3-3.mp3" "Paper 110 - Relation of Adjusters to Individual Mortals.mp3"
add_mapping "cosmic-3-4.mp3" "Paper 111 - The Adjuster and the Soul.mp3"
add_mapping "cosmic-3-5.mp3" "Paper 112 - Personality Survival.mp3"
add_mapping "cosmic-4-1.mp3" "Paper 32 - The Evolution of Local Universes.mp3"
add_mapping "cosmic-4-2.mp3" "Paper 33 - Administration of the Local Universe.mp3"
add_mapping "cosmic-4-3.mp3" "Paper 34 - The Local Universe Mother Spirit.mp3"
add_mapping "cosmic-4-4.mp3" "Paper 35 - The Local Universe Sons of God.mp3"
add_mapping "cosmic-4-5.mp3" "Paper 41 - Physical Aspects of the Local Universe.mp3"

# Remove trailing comma and close JSON
sed -i '' '$ s/,$//' "src/data/json/cosmic-series-urls.json"
echo "  }" >> "src/data/json/cosmic-series-urls.json"
echo "}" >> "src/data/json/cosmic-series-urls.json"

# Format JSON nicely
jq '.' "src/data/json/cosmic-series-urls.json" > "src/data/json/cosmic-series-urls.json.tmp" && mv "src/data/json/cosmic-series-urls.json.tmp" "src/data/json/cosmic-series-urls.json"

echo "Created cosmic-series-urls.json with exact URLs" 