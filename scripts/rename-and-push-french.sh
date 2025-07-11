#!/usr/bin/env bash
#
# rename-and-push-french.sh – copy French audio and PDF files from Google Drive to Cloudflare R2
# Usage:
#   bash rename-and-push-french.sh --format=mp3    # Files are already MP3
#   bash rename-and-push-french.sh --format=wav    # Convert WAV to MP3
#   DRYRUN=1 bash rename-and-push-french.sh --format=mp3   # rehearsal – nothing is actually uploaded
#

set -euo pipefail

# ───────────────────────┐
#  REMOTE CONFIGURATION  │  Adjust these paths if your names differ
# ───────────────────────┘
SRC_AUDIO_DIR='ubpod:UBPod/FR Audio Files'    # Google Drive remote + path for audio
SRC_PDF_DIR='ubpod:UBPod/FR PDFs'             # Google Drive remote + path for PDFs
DST_DIR='R2-UbPod:ubpod'                      # R2 remote + bucket
PARALLEL=8                                     # simultaneous transfers

# ───── Parse arguments ─────
FORMAT="mp3"  # default format
while [[ $# -gt 0 ]]; do
  case $1 in
    --format=*)
      FORMAT="${1#*=}"
      shift
      ;;
    --format)
      FORMAT="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 --format=[mp3|wav]"
      exit 1
      ;;
  esac
done

# Validate format
if [[ "$FORMAT" != "mp3" && "$FORMAT" != "wav" ]]; then
  echo "Error: --format must be 'mp3' or 'wav'"
  exit 1
fi

# ───── optional dry-run flag ─────
RCLONE_OPTS="-P --transfers=$PARALLEL --retries 5 --low-level-retries 3"
if [[ "${DRYRUN:-}" == 1 ]]; then
  echo "### DRY-RUN enabled – no data will be moved ###"
  RCLONE_OPTS="$RCLONE_OPTS --dry-run"
fi

# ───── Helper function for WAV to MP3 conversion ─────
convert_wav_to_mp3() {
  local src_file="$1"
  local dst_file="$2"
  local temp_dir="/tmp/ubpod-convert-$$"
  
  mkdir -p "$temp_dir"
  
  # Download WAV file
  echo "  → Downloading WAV file..."
  rclone copy "$SRC_AUDIO_DIR/$src_file" "$temp_dir/" $RCLONE_OPTS
  
  # Convert to MP3
  echo "  → Converting WAV to MP3..."
  local temp_wav="$temp_dir/$src_file"
  local temp_mp3="$temp_dir/$dst_file"
  
  # Use ffmpeg for conversion with good quality settings
  ffmpeg -i "$temp_wav" -codec:a libmp3lame -b:a 128k "$temp_mp3" -y
  
  # Upload MP3 file
  echo "  → Uploading MP3 file..."
  rclone copy "$temp_mp3" "$DST_DIR/" $RCLONE_OPTS
  
  # Cleanup
  rm -rf "$temp_dir"
}

# ───── Process Audio Files ─────
echo "Processing French audio files (format: $FORMAT)..."
echo "Scanning $SRC_AUDIO_DIR ..."

if [[ "$FORMAT" == "wav" ]]; then
  # Handle WAV files: "Paper 160 Fr Int.wav" → "paper-160-fr.mp3"
  rclone lsf --files-only "$SRC_AUDIO_DIR" |
  grep -E '^Paper [0-9]+ Fr Int\.wav$' |
  while read -r src_file; do
    # Extract paper number and build destination name
    paper_num=$(echo "$src_file" | sed -E 's/^Paper ([0-9]+) Fr Int\.wav$/\1/')
    dst_file="paper-$paper_num-fr.mp3"
    
    printf '→  %-40s  ⇒  %s\n' "$src_file" "$dst_file"
    
    # Convert and upload
    if [[ "${DRYRUN:-}" != 1 ]]; then
      convert_wav_to_mp3 "$src_file" "$dst_file"
    fi
  done
else
  # Handle MP3 files: assume they follow pattern "Paper 160 Fr Int.mp3" → "paper-160-fr.mp3"
  rclone lsf --files-only "$SRC_AUDIO_DIR" |
  grep -E '^Paper [0-9]+ Fr Int\.mp3$' |
  while read -r src_file; do
    # Extract paper number and build destination name
    paper_num=$(echo "$src_file" | sed -E 's/^Paper ([0-9]+) Fr Int\.mp3$/\1/')
    dst_file="paper-$paper_num-fr.mp3"
    
    printf '→  %-40s  ⇒  %s\n' "$src_file" "$dst_file"
    
    # Copy with rename
    rclone copyto \
      "$SRC_AUDIO_DIR/$src_file" \
      "$DST_DIR/$dst_file" \
      $RCLONE_OPTS
  done
fi

# ───── Process PDF Files ─────
echo ""
echo "Processing French PDF files..."
echo "Scanning $SRC_PDF_DIR ..."

rclone lsf --files-only "$SRC_PDF_DIR" |
grep -E '^paper[0-9]+-fr\.pdf$' |
while read -r src_file; do
  # Transform: paper160-fr.pdf → paper-160-fr.pdf
  dst_file=$(echo "$src_file" | sed -E 's/^paper([0-9]+)-fr\.pdf$/paper-\1-fr.pdf/')
  
  printf '→  %-35s  ⇒  %s\n' "$src_file" "$dst_file"
  
  # Copy with rename
  rclone copyto \
    "$SRC_PDF_DIR/$src_file" \
    "$DST_DIR/$dst_file" \
    $RCLONE_OPTS
done

echo ""
echo "French file upload completed!"
echo "Format processed: $FORMAT"
echo "Use DRYRUN=1 to preview changes without uploading."