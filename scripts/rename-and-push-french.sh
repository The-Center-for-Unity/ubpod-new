#!/usr/bin/env bash
#
# rename-and-push-french.sh – copy French audio and PDF files from Google Drive to Cloudflare R2
# with resume capability and failure recovery
#
# Usage:
#   bash rename-and-push-french.sh --format=mp3              # Files are already MP3
#   bash rename-and-push-french.sh --format=wav              # Convert WAV to MP3
#   bash rename-and-push-french.sh --format=wav --resume     # Skip already uploaded files
#   bash rename-and-push-french.sh --format=mp3 --verify     # Verify uploads after processing
#   bash rename-and-push-french.sh --format=wav --resume --verify  # Resume with verification
#   DRYRUN=1 bash rename-and-push-french.sh --format=mp3     # rehearsal – nothing is actually uploaded
#
# Options:
#   --format=[mp3|wav]  : Input file format (default: mp3)
#   --test              : Process only first file of each type (for testing)
#   --resume            : Skip files that already exist in destination
#   --verify            : Verify uploaded files after processing
#   --force             : Force overwrite existing files (overrides --resume)
#   DRYRUN=1            : Preview changes without uploading
#

set -euo pipefail

# ───────────────────────┐
#  LOGGING CONFIGURATION │  
# ───────────────────────┘
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_DIR="logs/french-upload"
LOG_FILE="$LOG_DIR/french-upload-$TIMESTAMP.log"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Function to log messages to both console and file
log_message() {
    echo "$1" | tee -a "$LOG_FILE"
}

# Start logging
log_message "=== French File Upload Started: $(date) ==="
log_message "Script: $0"
log_message "Arguments: $*"
log_message "Working Directory: $(pwd)"
log_message "Log File: $LOG_FILE"
log_message ""

# ───────────────────────┐
#  REMOTE CONFIGURATION  │  Adjust these paths if your names differ
# ───────────────────────┘
SRC_AUDIO_DIR='ubpod:UBPod/FR Audio Files'    # Google Drive remote + path for audio
SRC_PDF_DIR='ubpod:UBPod/FR PDFs'             # Google Drive remote + path for PDFs
DST_DIR='R2-UbPod:ubpod'                      # R2 remote + bucket
PARALLEL=8                                     # simultaneous transfers

# ───── Parse arguments ─────
FORMAT="mp3"   # default format
TEST_MODE=0    # test mode flag
RESUME_MODE=0  # resume mode flag
VERIFY_MODE=0  # verify mode flag
FORCE_MODE=0   # force overwrite flag
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
    --test)
      TEST_MODE=1
      shift
      ;;
    --resume)
      RESUME_MODE=1
      shift
      ;;
    --verify)
      VERIFY_MODE=1
      shift
      ;;
    --force)
      FORCE_MODE=1
      shift
      ;;
    *)
      log_message "Unknown option: $1"
      log_message "Usage: $0 --format=[mp3|wav] [--test] [--resume] [--verify] [--force]"
      log_message "  --format=[mp3|wav]  : Input file format (default: mp3)"
      log_message "  --test              : Process only first file of each type"
      log_message "  --resume            : Skip files that already exist in destination"
      log_message "  --verify            : Verify uploaded files after processing"
      log_message "  --force             : Force overwrite existing files (overrides --resume)"
      exit 1
      ;;
  esac
done

# Validate format
if [[ "$FORMAT" != "mp3" && "$FORMAT" != "wav" ]]; then
  log_message "Error: --format must be 'mp3' or 'wav'"
  exit 1
fi

log_message "Configuration:"
log_message "  Format: $FORMAT"
log_message "  Audio Source: $SRC_AUDIO_DIR"
log_message "  PDF Source: $SRC_PDF_DIR"
log_message "  Destination: $DST_DIR"
log_message "  Parallel transfers: $PARALLEL"
log_message "  Resume mode: $([[ $RESUME_MODE == 1 ]] && echo "ENABLED" || echo "DISABLED")"
log_message "  Verify mode: $([[ $VERIFY_MODE == 1 ]] && echo "ENABLED" || echo "DISABLED")"
log_message "  Force mode: $([[ $FORCE_MODE == 1 ]] && echo "ENABLED" || echo "DISABLED")"

# ───── optional dry-run flag ─────
RCLONE_OPTS="-P --transfers=$PARALLEL --retries 5 --low-level-retries 3"
if [[ "${DRYRUN:-}" == 1 ]]; then
  log_message "### DRY-RUN enabled – no data will be moved ###"
  RCLONE_OPTS="$RCLONE_OPTS --dry-run"
fi

# ───── test mode flag ─────
if [[ "$TEST_MODE" == 1 ]]; then
  log_message "### TEST MODE enabled – processing only first file ###"
fi

log_message "rclone options: $RCLONE_OPTS"
log_message ""

# ───── Resume & Verification Functions ─────
# State tracking variables (compatible with older bash)
PROCESSED_FILES=""
FAILED_FILES=""
SKIPPED_FILES=""
VERIFIED_FILES=""
TOTAL_PROCESSED=0
TOTAL_FAILED=0
TOTAL_SKIPPED=0
TOTAL_VERIFIED=0

# Cache for existing files to avoid repeated rclone stat calls
EXISTING_FILES_CACHE=""

# Helper functions for state tracking
add_processed_file() {
    local file="$1"
    PROCESSED_FILES="$PROCESSED_FILES|$file"
    TOTAL_PROCESSED=$((TOTAL_PROCESSED + 1))
}

add_failed_file() {
    local file="$1"
    local reason="$2"
    FAILED_FILES="$FAILED_FILES|$file($reason)"
    TOTAL_FAILED=$((TOTAL_FAILED + 1))
}

add_skipped_file() {
    local file="$1"
    SKIPPED_FILES="$SKIPPED_FILES|$file"
    TOTAL_SKIPPED=$((TOTAL_SKIPPED + 1))
}

add_verified_file() {
    local file="$1"
    VERIFIED_FILES="$VERIFIED_FILES|$file"
    TOTAL_VERIFIED=$((TOTAL_VERIFIED + 1))
}

# Function to check if file exists in cache
file_exists_in_cache() {
    local dst_file="$1"
    # Check if file exists in our cache
    if [[ "$EXISTING_FILES_CACHE" == *"|${dst_file}|"* ]]; then
        return 0  # File exists
    else
        return 1  # File doesn't exist
    fi
}

# Function to check if file exists in destination
file_exists_in_destination() {
    local dst_file="$1"
    # First check cache if available
    if [[ -n "$EXISTING_FILES_CACHE" ]] && [[ "$EXISTING_FILES_CACHE" != "|" ]]; then
        file_exists_in_cache "$dst_file"
        return $?
    fi
    # Fall back to rclone stat if no cache
    if rclone stat "$DST_DIR/$dst_file" </dev/null >/dev/null 2>&1; then
        return 0  # File exists
    else
        return 1  # File doesn't exist
    fi
}

# Function to get file size in destination
get_destination_file_size() {
    local dst_file="$1"
    rclone size "$DST_DIR/$dst_file" --json </dev/null 2>/dev/null | jq -r '.bytes' 2>/dev/null || echo "0"
}

# Function to verify uploaded file
verify_uploaded_file() {
    local dst_file="$1"
    local expected_size="${2:-0}"
    
    # Give R2 time to propagate the file
    sleep 5
    
    if file_exists_in_destination "$dst_file"; then
        local actual_size=$(get_destination_file_size "$dst_file")
        if [[ "$actual_size" -gt 0 ]]; then
            if [[ "$expected_size" -gt 0 ]] && [[ "$actual_size" != "$expected_size" ]]; then
                log_message "    ⚠️  Size mismatch: expected $expected_size bytes, got $actual_size bytes"
                return 1
            else
                log_message "    ✅ Verified: $dst_file ($actual_size bytes)"
                add_verified_file "$dst_file"
                return 0
            fi
        else
            log_message "    ❌ Verification failed: $dst_file has zero size"
            return 1
        fi
    else
        log_message "    ❌ Verification failed: $dst_file not found in destination"
        return 1
    fi
}

# Function to check if we should skip a file
should_skip_file() {
    local dst_file="$1"
    
    # Force mode overrides resume
    if [[ $FORCE_MODE == 1 ]]; then
        return 1  # Don't skip
    fi
    
    # Only skip if resume mode is enabled and file exists
    if [[ $RESUME_MODE == 1 ]] && file_exists_in_destination "$dst_file"; then
        return 0  # Skip
    fi
    
    return 1  # Don't skip
}

# Function to get existing files in destination for resume
get_existing_files() {
    log_message "Checking existing files in destination for resume capability..."
    local french_files
    french_files=$(rclone lsf "$DST_DIR" </dev/null | grep -E '\-fr\.(mp3|pdf)$' | sort)
    
    if [[ -n "$french_files" ]]; then
        local count=$(printf '%s\n' "$french_files" | wc -l)
        log_message "Found $count existing French files in destination:"
        # Populate the cache with existing files
        EXISTING_FILES_CACHE="|"
        while IFS= read -r file; do
            if [[ -n "$file" ]]; then
                log_message "  $file"
                EXISTING_FILES_CACHE="${EXISTING_FILES_CACHE}${file}|"
            fi
        done <<< "$french_files"
    else
        log_message "No existing French files found in destination."
        EXISTING_FILES_CACHE="|"
    fi
    log_message ""
}

# Function to print summary report
print_summary_report() {
    log_message ""
    log_message "=== UPLOAD SUMMARY REPORT ==="
    log_message "Total files processed: $TOTAL_PROCESSED"
    log_message "Total files failed: $TOTAL_FAILED"
    log_message "Total files skipped: $TOTAL_SKIPPED"
    if [[ $VERIFY_MODE == 1 ]]; then
        log_message "Total files verified: $TOTAL_VERIFIED"
    fi
    
    if [[ $TOTAL_FAILED -gt 0 ]]; then
        log_message ""
        log_message "=== FAILED FILES ==="
        printf '%s\n' "$FAILED_FILES" | tr '|' '\n' | grep -v '^$' | while IFS= read -r file; do
            log_message "  ❌ $file"
        done
    fi
    
    if [[ $TOTAL_SKIPPED -gt 0 ]]; then
        log_message ""
        log_message "=== SKIPPED FILES ==="
        printf '%s\n' "$SKIPPED_FILES" | tr '|' '\n' | grep -v '^$' | while IFS= read -r file; do
            log_message "  ⏩ $file (already exists)"
        done
    fi
    
    if [[ $TOTAL_PROCESSED -gt 0 ]]; then
        log_message ""
        log_message "=== SUCCESSFULLY PROCESSED FILES ==="
        printf '%s\n' "$PROCESSED_FILES" | tr '|' '\n' | grep -v '^$' | while IFS= read -r file; do
            log_message "  ✅ $file"
        done
    fi
    
    log_message ""
    if [[ $TOTAL_FAILED -gt 0 ]]; then
        log_message "⚠️  Some files failed to upload. Use --resume to retry failed files."
    else
        log_message "🎉 All files processed successfully!"
    fi
}

# Initialize resume mode
if [[ $RESUME_MODE == 1 ]]; then
    get_existing_files
fi

log_message ""

# ───── Helper function for WAV to MP3 conversion ─────
convert_wav_to_mp3() {
  local src_file="$1"
  local dst_file="$2"
  local temp_dir="/tmp/ubpod-convert-$$-$(date +%s)-$RANDOM"
  
  log_message "    Starting WAV to MP3 conversion: $src_file → $dst_file"
  
  mkdir -p "$temp_dir"
  log_message "    Created temp directory: $temp_dir"
  
  # Download WAV file
  log_message "    → Downloading WAV file from $SRC_AUDIO_DIR/$src_file"
  if rclone copy "$SRC_AUDIO_DIR/$src_file" "$temp_dir/" $RCLONE_OPTS </dev/null; then
    log_message "    ✓ WAV file downloaded successfully"
  else
    log_message "    ✗ ERROR: Failed to download WAV file"
    add_failed_file "$dst_file" "Download failed"
    rm -rf "$temp_dir"
    return 1
  fi
  
  # Convert to MP3
  log_message "    → Converting WAV to MP3 (128k bitrate)"
  local temp_wav="$temp_dir/$src_file"
  local temp_mp3="$temp_dir/$dst_file"
  
  # Use ffmpeg for conversion with good quality settings
  if ffmpeg -nostdin -i "$temp_wav" -codec:a libmp3lame -b:a 128k "$temp_mp3" -y -loglevel error; then
    log_message "    ✓ WAV to MP3 conversion completed"
    # Log file sizes for verification
    local wav_size=$(stat -c%s "$temp_wav" 2>/dev/null || stat -f%z "$temp_wav")
    local mp3_size=$(stat -c%s "$temp_mp3" 2>/dev/null || stat -f%z "$temp_mp3")
    log_message "    File sizes: WAV=${wav_size} bytes, MP3=${mp3_size} bytes"
  else
    log_message "    ✗ ERROR: ffmpeg conversion failed"
    add_failed_file "$dst_file" "Conversion failed"
    rm -rf "$temp_dir"
    return 1
  fi
  
  # Upload MP3 file
  log_message "    → Uploading MP3 file to $DST_DIR/$dst_file"
  # Use copyto for explicit file-to-file copy with proper overwrite handling
  if rclone copyto "$temp_mp3" "$DST_DIR/$dst_file" $RCLONE_OPTS </dev/null; then
    log_message "    ✓ MP3 file uploaded successfully"
    add_processed_file "$dst_file"
    
    # Verify upload if verification mode is enabled
    if [[ $VERIFY_MODE == 1 ]]; then
      log_message "    → Verifying uploaded file..."
      if ! verify_uploaded_file "$dst_file" "$mp3_size"; then
        log_message "    ⚠️  Verification failed but file was reported as uploaded"
        add_failed_file "$dst_file" "Verification failed"
      fi
    fi
  else
    log_message "    ✗ ERROR: Failed to upload MP3 file"
    add_failed_file "$dst_file" "Upload failed"
    rm -rf "$temp_dir"
    return 1
  fi
  
  # Cleanup
  log_message "    → Cleaning up temporary files"
  rm -rf "$temp_dir"
  log_message "    ✓ Conversion process completed for $dst_file"
}

# ───── Process Audio Files ─────
log_message "=== PROCESSING AUDIO FILES ==="
log_message "Processing French audio files (format: $FORMAT)..."
log_message "Scanning $SRC_AUDIO_DIR ..."

if [[ "$FORMAT" == "wav" ]]; then
  # Handle WAV files with various naming patterns → "paper-X-fr.mp3"
  log_message "Searching for WAV files with French naming patterns..."
  file_list=$(rclone lsf --files-only "$SRC_AUDIO_DIR" </dev/null | grep -E '^(Paper|paper|per) [0-9]+ [Ff][Rr] [Ii]nt\.? ?\.wav$|^Foreword [Ff][Rr] [Ii]nt\.wav$')
  
  if [[ -z "$file_list" ]]; then
    log_message "⚠️  No WAV files found matching the expected pattern"
    log_message "Available files in $SRC_AUDIO_DIR:"
    rclone lsf --files-only "$SRC_AUDIO_DIR" </dev/null | head -10 | while read -r file; do
      log_message "    $file"
    done
  else
    file_count=$(printf '%s\n' "$file_list" | wc -l)
    log_message "Found $file_count WAV files to process"
  fi
  
  if [[ "$TEST_MODE" == 1 ]]; then
    # In test mode, process only the first file
    file_list=$(echo "$file_list" | head -1)
    log_message "TEST MODE: Processing only first file"
  fi
  
  processed_count=0
  while IFS= read -r src_file; do
    if [[ -n "$src_file" ]]; then
      # Extract paper number and build destination name
      if [[ "$src_file" == "Foreword"* ]]; then
        dst_file="foreword-fr.mp3"
      else
        paper_num=$(echo "$src_file" | sed -E 's/^(Paper|paper|per) ([0-9]+) [Ff][Rr] [Ii]nt\.? ?\.wav$/\2/')
        dst_file="paper-$paper_num-fr.mp3"
      fi
      
      processed_count=$((processed_count + 1))
      log_message "[$processed_count] Processing: $src_file → $dst_file"
      
      # Check if we should skip this file
      if should_skip_file "$dst_file"; then
        log_message "  ⏩ Skipping $dst_file (already exists, resume mode enabled)"
        add_skipped_file "$dst_file"
        continue
      fi
      
      # Convert and upload
      if [[ "${DRYRUN:-}" != 1 ]]; then
        if convert_wav_to_mp3 "$src_file" "$dst_file"; then
          log_message "  ✓ Successfully processed $dst_file"
        else
          log_message "  ✗ Failed to process $src_file"
        fi
      else
        log_message "  → DRY-RUN: Would convert $src_file to $dst_file"
      fi
    fi
  done <<< "$file_list"
else
  # Handle MP3 files with various naming patterns → "paper-X-fr.mp3"
  log_message "Searching for MP3 files with French naming patterns..."
  mp3_files=$(rclone lsf --files-only "$SRC_AUDIO_DIR" </dev/null | grep -E '^(Paper|paper) [0-9]+ [Ff][Rr] [Ii]nt\.? ?\.mp3$|^Foreword [Ff][Rr] [Ii]nt\.mp3$')
  
  if [[ -z "$mp3_files" ]]; then
    log_message "⚠️  No MP3 files found matching the expected pattern"
    log_message "Available files in $SRC_AUDIO_DIR:"
    rclone lsf --files-only "$SRC_AUDIO_DIR" </dev/null | head -10 | while read -r file; do
      log_message "    $file"
    done
  else
    file_count=$(printf '%s\n' "$mp3_files" | wc -l)
    log_message "Found $file_count MP3 files to process"
  fi
  
  if [[ "$TEST_MODE" == 1 ]]; then
    mp3_files=$(echo "$mp3_files" | head -1)
    log_message "TEST MODE: Processing only first file"
  fi
  
  processed_count=0
  while IFS= read -r src_file; do
    if [[ -n "$src_file" ]]; then
      # Extract paper number and build destination name
      if [[ "$src_file" == "Foreword"* ]]; then
        dst_file="foreword-fr.mp3"
      else
        paper_num=$(echo "$src_file" | sed -E 's/^(Paper|paper) ([0-9]+) [Ff][Rr] [Ii]nt\.? ?\.mp3$/\2/')
        dst_file="paper-$paper_num-fr.mp3"
      fi
      
      processed_count=$((processed_count + 1))
      log_message "[$processed_count] Processing: $src_file → $dst_file"
      
      # Check if we should skip this file
      if should_skip_file "$dst_file"; then
        log_message "  ⏩ Skipping $dst_file (already exists, resume mode enabled)"
        add_skipped_file "$dst_file"
        continue
      fi
      
      # Copy with rename
      if rclone copyto \
        "$SRC_AUDIO_DIR/$src_file" \
        "$DST_DIR/$dst_file" \
        $RCLONE_OPTS </dev/null; then
        log_message "  ✓ Successfully uploaded $dst_file"
        add_processed_file "$dst_file"
        
        # Verify upload if verification mode is enabled
        if [[ $VERIFY_MODE == 1 ]]; then
          log_message "  → Verifying uploaded file..."
          if ! verify_uploaded_file "$dst_file"; then
            log_message "  ⚠️  Verification failed but file was reported as uploaded"
            add_failed_file "$dst_file" "Verification failed"
          fi
        fi
      else
        log_message "  ✗ Failed to upload $src_file"
        add_failed_file "$dst_file" "Upload failed"
      fi
    fi
  done <<< "$mp3_files"
fi

# ───── Process PDF Files ─────
log_message ""
log_message "=== PROCESSING PDF FILES ==="
log_message "Processing French PDF files..."
log_message "Scanning $SRC_PDF_DIR ..."

log_message "Searching for PDF files with French naming patterns..."
pdf_list=$(rclone lsf --files-only "$SRC_PDF_DIR" </dev/null | grep -E '^paper[0-9]+-fr\.pdf$|^Foreword-FR\.pdf$')

if [[ -z "$pdf_list" ]]; then
  log_message "⚠️  No PDF files found matching the expected pattern"
  log_message "Available files in $SRC_PDF_DIR:"
  rclone lsf --files-only "$SRC_PDF_DIR" </dev/null | head -10 | while read -r file; do
    log_message "    $file"
  done
else
  file_count=$(printf '%s\n' "$pdf_list" | wc -l)
  log_message "Found $file_count PDF files to process"
fi

if [[ "$TEST_MODE" == 1 ]]; then
  # In test mode, process only the first PDF file
  pdf_list=$(echo "$pdf_list" | head -1)
  log_message "TEST MODE: Processing only first PDF file"
fi

processed_count=0
while IFS= read -r src_file; do
  if [[ -n "$src_file" ]]; then
    # Transform: paper160-fr.pdf → paper-160-fr.pdf, Foreword-FR.pdf → foreword-fr.pdf
    if [[ "$src_file" == "Foreword-FR.pdf" ]]; then
      dst_file="foreword-fr.pdf"
    else
      dst_file=$(echo "$src_file" | sed -E 's/^paper([0-9]+)-fr\.pdf$/paper-\1-fr.pdf/')
    fi
    
    processed_count=$((processed_count + 1))
    log_message "[$processed_count] Processing: $src_file → $dst_file"
    
    # Check if we should skip this file
    if should_skip_file "$dst_file"; then
      log_message "  ⏩ Skipping $dst_file (already exists, resume mode enabled)"
      add_skipped_file "$dst_file"
      continue
    fi
    
    # Copy with rename
    if rclone copyto \
      "$SRC_PDF_DIR/$src_file" \
      "$DST_DIR/$dst_file" \
      $RCLONE_OPTS </dev/null; then
      log_message "  ✓ Successfully uploaded $dst_file"
      add_processed_file "$dst_file"
      
      # Verify upload if verification mode is enabled
      if [[ $VERIFY_MODE == 1 ]]; then
        log_message "  → Verifying uploaded file..."
        if ! verify_uploaded_file "$dst_file"; then
          log_message "  ⚠️  Verification failed but file was reported as uploaded"
          add_failed_file "$dst_file" "Verification failed"
        fi
      fi
    else
      log_message "  ✗ Failed to upload $src_file"
      add_failed_file "$dst_file" "Upload failed"
    fi
  fi
done <<< "$pdf_list"

# Print summary report
print_summary_report

log_message ""
log_message "=== UPLOAD PROCESS COMPLETED ==="
log_message "French file upload completed!"
log_message "Format processed: $FORMAT"
log_message "Log file saved: $LOG_FILE"
log_message "Use DRYRUN=1 to preview changes without uploading."
log_message "Use --resume to skip already uploaded files and retry failures."
log_message "Use --verify to verify uploaded files after processing."
log_message "Upload completed at: $(date)"

# Exit with appropriate code
if [[ $TOTAL_FAILED -gt 0 ]]; then
  log_message ""
  log_message "⚠️  Script completed with $TOTAL_FAILED failures."
  log_message "Run with --resume to retry failed uploads."
  exit 1
else
  log_message ""
  log_message "🎉 Script completed successfully!"
  exit 0
fi