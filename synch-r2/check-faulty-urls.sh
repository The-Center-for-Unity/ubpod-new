#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Read episodes.json and cosmic-series-urls.json
EPISODES_JSON="$PROJECT_ROOT/src/data/json/episodes.json"
COSMIC_URLS_JSON="$SCRIPT_DIR/cosmic-series-urls.json"

echo "Checking for faulty URLs in episodes.json..."
echo

# Create a temporary file for results
RESULTS_FILE="$SCRIPT_DIR/url-check-results.json"
echo "{" > "$RESULTS_FILE"
echo "  \"faultyUrls\": {" >> "$RESULTS_FILE"

# Function to check if a series is a cosmic series
is_cosmic_series() {
    [[ $1 =~ ^cosmic-[0-9]+$ ]]
}

# Process each cosmic series
for series in {1..14}; do
    series_id="cosmic-${series}"
    echo "Checking series: $series_id"
    
    # Get episodes for this series
    for episode in {1..5}; do
        episode_id="${episode}"
        cosmic_key="${series_id}-${episode}"
        
        # Get the audioUrl from episodes.json
        audio_url=$(jq -r --arg series "$series_id" --arg episode "$episode_id" '.[$series].episodes[] | select(.id == ($episode | tonumber)) | .audioUrl' "$EPISODES_JSON")
        
        # Check if the URL format is correct
        if [[ "$audio_url" != "${cosmic_key}.mp3" ]]; then
            echo "    ⚠️  Episode $cosmic_key has incorrect URL format: $audio_url"
            echo "    \"$cosmic_key\": {" >> "$RESULTS_FILE"
            echo "      \"currentUrl\": \"$audio_url\"," >> "$RESULTS_FILE"
            echo "      \"expectedPattern\": \"${cosmic_key}.mp3\"," >> "$RESULTS_FILE"
            echo "      \"type\": \"incorrect_format\"" >> "$RESULTS_FILE"
            echo "    }," >> "$RESULTS_FILE"
        fi
        
        # Check if the file exists in R2
        if ! jq -e --arg key "$cosmic_key" '.cosmicSeriesUrls[$key].exactUrl' "$COSMIC_URLS_JSON" > /dev/null 2>&1; then
            echo "    🚫 Episode $cosmic_key not found in R2"
            if ! grep -q "\"$cosmic_key\":" "$RESULTS_FILE"; then
                echo "    \"$cosmic_key\": {" >> "$RESULTS_FILE"
                echo "      \"type\": \"missing_in_r2\"" >> "$RESULTS_FILE"
                echo "    }," >> "$RESULTS_FILE"
            fi
        fi
    done
done

# Remove trailing comma and close the JSON
sed -i '' '$ s/,$//' "$RESULTS_FILE"
echo "  }" >> "$RESULTS_FILE"
echo "}" >> "$RESULTS_FILE"

# Format the JSON nicely
jq '.' "$RESULTS_FILE" > "$RESULTS_FILE.tmp" && mv "$RESULTS_FILE.tmp" "$RESULTS_FILE"

echo
echo "Results saved to: $RESULTS_FILE"

# Count and display issues by type
total_issues=$(jq '.faultyUrls | length' "$RESULTS_FILE")
echo "Found $total_issues issues"
echo
echo "Issues by type:"
echo "  $(jq -r '[.faultyUrls[] | .type] | group_by(.) | map({type: .[0], count: length}) | .[] | "  \(.count) \(.type)"' "$RESULTS_FILE")" 