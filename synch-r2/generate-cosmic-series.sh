#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Read episodes.json
EPISODES_JSON="$PROJECT_ROOT/src/data/json/episodes.json"
TEMP_JSON="$SCRIPT_DIR/episodes.temp.json"

# Create a temporary file with the existing content
cp "$EPISODES_JSON" "$TEMP_JSON"

# Remove the last closing brace to append new content
sed -i '' '$ d' "$TEMP_JSON"

# Add a comma after the last series (jesus-14)
sed -i '' '$ s/}$/},/' "$TEMP_JSON"

# Function to get paper title from paper number
get_paper_title() {
    local series=$1
    local episode=$2
    
    case $series in
        1) # Papers 1-5: The Central and Superuniverses
            case $episode in
                1) echo "The Universal Father";;
                2) echo "The Nature of God";;
                3) echo "The Attributes of God";;
                4) echo "God's Relation to the Universe";;
                5) echo "God's Relation to the Individual";;
            esac
            ;;
        2) # Papers 6-10
            case $episode in
                1) echo "The Eternal Son";;
                2) echo "Relation of the Eternal Son to the Universe";;
                3) echo "The Infinite Spirit";;
                4) echo "Relation of the Infinite Spirit to the Universe";;
                5) echo "The Paradise Trinity";;
            esac
            ;;
        3) # Papers 11-15
            case $episode in
                1) echo "The Eternal Isle of Paradise";;
                2) echo "The Universe of Universes";;
                3) echo "The Sacred Spheres of Paradise";;
                4) echo "The Central and Divine Universe";;
                5) echo "The Seven Superuniverses";;
            esac
            ;;
        4) # Papers 16-20
            case $episode in
                1) echo "The Seven Master Spirits";;
                2) echo "The Seven Supreme Spirit Groups";;
                3) echo "The Supreme Trinity Personalities";;
                4) echo "The Co-ordinate Trinity-Origin Beings";;
                5) echo "The Paradise Sons of God";;
            esac
            ;;
        5) # Papers 21-25
            case $episode in
                1) echo "The Paradise Creator Sons";;
                2) echo "The Trinitized Sons of God";;
                3) echo "The Solitary Messengers";;
                4) echo "Higher Personalities of the Infinite Spirit";;
                5) echo "The Messenger Hosts of Space";;
            esac
            ;;
        6) # Papers 26-30
            case $episode in
                1) echo "Ministering Spirits of the Central Universe";;
                2) echo "Ministry of the Primary Supernaphim";;
                3) echo "Ministering Spirits of the Superuniverses";;
                4) echo "The Universe Power Directors";;
                5) echo "Personalities of the Grand Universe";;
            esac
            ;;
        7) # Papers 31-35
            case $episode in
                1) echo "The Corps of the Finality";;
                2) echo "The Evolution of Local Universes";;
                3) echo "Administration of the Local Universe";;
                4) echo "The Local Universe Mother Spirit";;
                5) echo "The Local Universe Sons of God";;
            esac
            ;;
        8) # Papers 36-40
            case $episode in
                1) echo "The Life Carriers";;
                2) echo "Personalities of the Local Universe";;
                3) echo "The Ministering Spirit of the Local Universe";;
                4) echo "The Seraphic Hosts";;
                5) echo "The Ascending Sons of God";;
            esac
            ;;
        9) # Papers 41-45
            case $episode in
                1) echo "Physical Aspects of the Local Universe";;
                2) echo "Energy—Mind and Matter";;
                3) echo "The Constellations";;
                4) echo "The Local System Administration";;
                5) echo "The Local System Headquarters";;
            esac
            ;;
        10) # Papers 46-50
            case $episode in
                1) echo "The Local System Headquarters";;
                2) echo "The Seven Mansion Worlds";;
                3) echo "The Morontia Life";;
                4) echo "The Planetary Princes";;
                5) echo "The Planetary Adams";;
            esac
            ;;
        11) # Papers 51-55
            case $episode in
                1) echo "The Planetary Adams";;
                2) echo "Planetary Mortal Epochs";;
                3) echo "The Problems of the Lucifer Rebellion";;
                4) echo "Problems of the Lucifer Rebellion";;
                5) echo "The Spheres of Light and Life";;
            esac
            ;;
        12) # Papers 56-60
            case $episode in
                1) echo "Universal Unity";;
                2) echo "The Origin of Urantia";;
                3) echo "The Marine-Life Era on Urantia";;
                4) echo "Urantia During the Early Land-Life Era";;
                5) echo "The Era of Marine Life on Urantia";;
            esac
            ;;
        13) # Papers 61-65
            case $episode in
                1) echo "The Mammalian Era on Urantia";;
                2) echo "The Dawn Races of Early Man";;
                3) echo "The First Human Family";;
                4) echo "The Evolutionary Races of Color";;
                5) echo "The Overcontrol of Evolution";;
            esac
            ;;
        14) # Papers 66-70
            case $episode in
                1) echo "The Planetary Prince of Urantia";;
                2) echo "The Planetary Rebellion";;
                3) echo "The Dawn of Civilization";;
                4) echo "Primitive Human Institutions";;
                5) echo "The Evolution of Human Government";;
            esac
            ;;
    esac
}

# Add each cosmic series
for series in {1..14}; do
    echo "  \"cosmic-${series}\": {" >> "$TEMP_JSON"
    
    # Set series title based on range
    case $series in
        1) echo "    \"seriesTitle\": \"The Central and Superuniverses: Part 1\"," >> "$TEMP_JSON";;
        2) echo "    \"seriesTitle\": \"The Central and Superuniverses: Part 2\"," >> "$TEMP_JSON";;
        3) echo "    \"seriesTitle\": \"The Central and Superuniverses: Part 3\"," >> "$TEMP_JSON";;
        4) echo "    \"seriesTitle\": \"The Central and Superuniverses: Part 4\"," >> "$TEMP_JSON";;
        5) echo "    \"seriesTitle\": \"The Central and Superuniverses: Part 5\"," >> "$TEMP_JSON";;
        6) echo "    \"seriesTitle\": \"The Central and Superuniverses: Part 6\"," >> "$TEMP_JSON";;
        7) echo "    \"seriesTitle\": \"The Local Universe: Part 1\"," >> "$TEMP_JSON";;
        8) echo "    \"seriesTitle\": \"The Local Universe: Part 2\"," >> "$TEMP_JSON";;
        9) echo "    \"seriesTitle\": \"The Local Universe: Part 3\"," >> "$TEMP_JSON";;
        10) echo "    \"seriesTitle\": \"The Local Universe: Part 4\"," >> "$TEMP_JSON";;
        11) echo "    \"seriesTitle\": \"The Local Universe: Part 5\"," >> "$TEMP_JSON";;
        12) echo "    \"seriesTitle\": \"The History of Urantia: Part 1\"," >> "$TEMP_JSON";;
        13) echo "    \"seriesTitle\": \"The History of Urantia: Part 2\"," >> "$TEMP_JSON";;
        14) echo "    \"seriesTitle\": \"The History of Urantia: Part 3\"," >> "$TEMP_JSON";;
    esac
    
    # Set series description based on range
    case $series in
        1|2|3|4|5|6) 
            echo "    \"seriesDescription\": \"Explore the grand architecture of the universes and the nature of the Paradise Trinity.\"," >> "$TEMP_JSON"
            ;;
        7|8|9|10|11)
            echo "    \"seriesDescription\": \"Discover the organization and administration of our local universe of Nebadon.\"," >> "$TEMP_JSON"
            ;;
        12|13|14)
            echo "    \"seriesDescription\": \"Learn about the fascinating history of our planet Urantia from its origins to early human civilization.\"," >> "$TEMP_JSON"
            ;;
    esac
    
    echo "    \"episodes\": [" >> "$TEMP_JSON"
    
    # Add 5 episodes for each series
    for episode in {1..5}; do
        title=$(get_paper_title $series $episode)
        echo "      {" >> "$TEMP_JSON"
        echo "        \"id\": $episode," >> "$TEMP_JSON"
        echo "        \"title\": \"$title\"," >> "$TEMP_JSON"
        echo "        \"audioUrl\": \"cosmic-${series}-${episode}.mp3\"," >> "$TEMP_JSON"
        echo "        \"pdfUrl\": null," >> "$TEMP_JSON"
        echo "        \"summaryKey\": \"cosmic/${series}-${episode}\"," >> "$TEMP_JSON"
        echo "        \"imageUrl\": \"/images/cosmic-${series}/card-${episode}.jpg\"" >> "$TEMP_JSON"
        if [ $episode -eq 5 ]; then
            echo "      }" >> "$TEMP_JSON"
        else
            echo "      }," >> "$TEMP_JSON"
        fi
    done
    
    echo "    ]" >> "$TEMP_JSON"
    
    # Add comma if not the last series
    if [ $series -eq 14 ]; then
        echo "  }" >> "$TEMP_JSON"
    else
        echo "  }," >> "$TEMP_JSON"
    fi
done

# Close the JSON file
echo "}" >> "$TEMP_JSON"

# Validate the JSON
if jq '.' "$TEMP_JSON" > /dev/null 2>&1; then
    echo "JSON is valid. Updating episodes.json..."
    mv "$TEMP_JSON" "$EPISODES_JSON"
    echo "Successfully updated episodes.json with cosmic series"
else
    echo "Error: Generated JSON is invalid"
    rm "$TEMP_JSON"
    exit 1
fi 