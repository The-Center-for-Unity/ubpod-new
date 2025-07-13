#!/usr/bin/env bash
#
# rename-and-push-portuguese.sh – copy Portuguese audio and PDF files from Google Drive to Cloudflare R2
# with resume capability and failure recovery
#
# Portuguese file naming analysis:
# - Audio files: paper1-pt.mp3, paper10-pt.mp3, ..., paper196-pt.mp3, Foreword-pt.mp3
# - PDF files: paper1-pt.pdf, paper10-pt.pdf, ..., paper196-pt.pdf
# - Total: 197 MP3s (including Foreword), 196 PDFs (no Foreword PDF)
# - Note: Foreword-pt.pdf is in Audio folder, not PDFs folder
#
# Target naming convention (matching ES/FR):
# - paper-0-pt.mp3 (for Foreword)
# - paper-1-pt.mp3, paper-2-pt.mp3, ..., paper-196-pt.mp3
#
# Usage:
#   bash rename-and-push-portuguese.sh              # Standard upload
#   bash rename-and-push-portuguese.sh --resume     # Skip already uploaded files
#   bash rename-and-push-portuguese.sh --verify     # Verify uploads after processing
#   bash rename-and-push-portuguese.sh --test       # Process only first file of each type
#   DRYRUN=1 bash rename-and-push-portuguese.sh     # Preview changes without uploading
#
# Options:
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
LOG_DIR="logs/portuguese-upload"
LOG_FILE="$LOG_DIR/portuguese-upload-$TIMESTAMP.log"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Function to log messages to both console and file
log_message() {
    echo "$1" | tee -a "$LOG_FILE"
}

# Start logging
log_message "=== Portuguese File Upload Started: $(date) ==="
log_message "Script: $0"
log_message "Arguments: $*"
log_message "Working Directory: $(pwd)"
log_message "Log File: $LOG_FILE"
log_message ""

# ───────────────────────┐
#  REMOTE CONFIGURATION  │
# ───────────────────────┘
SRC_AUDIO_DIR='ubpod:UBPod/PT Audio Files'    # Google Drive remote + path for audio
SRC_PDF_DIR='ubpod:UBPod/PT PDFs'             # Google Drive remote + path for PDFs
DST_BUCKET='R2-UbPod:ubpod'                    # Cloudflare R2 bucket

# ──────────────────────┐
#  SCRIPT CONFIGURATION │
# ──────────────────────┘
IS_DRYRUN="${DRYRUN:-0}"
TEST_MODE=0
RESUME_MODE=0
VERIFY_MODE=0
FORCE_MODE=0

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
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
            RESUME_MODE=0
            shift
            ;;
        *)
            log_message "Unknown option: $1"
            log_message "Usage: $0 [--test] [--resume] [--verify] [--force]"
            exit 1
            ;;
    esac
done

# ──────────────┐
#  STATUS SETUP │
# ──────────────┘
TOTAL_FILES=0
PROCESSED_FILES=0
SKIPPED_FILES=0
FAILED_FILES=0
declare -a FAILED_LIST=()

# Log configuration
log_message "=== Configuration ==="
log_message "  Audio Source: $SRC_AUDIO_DIR"
log_message "  PDF Source: $SRC_PDF_DIR"
log_message "  Destination: $DST_BUCKET"
log_message "  Dry Run: $([ "$IS_DRYRUN" = "1" ] && echo "YES" || echo "NO")"
log_message "  Test Mode: $([ "$TEST_MODE" = "1" ] && echo "YES (first file only)" || echo "NO")"
log_message "  Resume Mode: $([ "$RESUME_MODE" = "1" ] && echo "YES (skip existing)" || echo "NO")"
log_message "  Force Mode: $([ "$FORCE_MODE" = "1" ] && echo "YES (overwrite)" || echo "NO")"
log_message "  Verify Mode: $([ "$VERIFY_MODE" = "1" ] && echo "YES" || echo "NO")"
log_message ""

# ───────────────────┐
#  HELPER FUNCTIONS  │
# ───────────────────┘
# Function to check if file exists in destination
check_file_exists() {
    local dst_file="$1"
    if [ "$FORCE_MODE" = "1" ]; then
        return 1  # Force mode: pretend file doesn't exist
    fi
    if [ "$RESUME_MODE" = "1" ]; then
        # Use rclone lsf and check if output is non-empty
        if [ -n "$(rclone lsf --files-only "$DST_BUCKET" --include "$dst_file" 2>/dev/null)" ]; then
            return 0  # File exists
        fi
    fi
    return 1  # File doesn't exist or resume not enabled
}

# ─────────────┐
#  MAIN LOGIC  │
# ─────────────┘
# Additional options for rclone
RCLONE_OPTS=""
if [ "$IS_DRYRUN" = "1" ]; then
    RCLONE_OPTS="--dry-run"
fi

# ─────────────────────────────┐
#  PROCESS PORTUGUESE MP3 FILES │
# ─────────────────────────────┘
log_message "=== Processing Portuguese Audio Files ==="
log_message "Scanning $SRC_AUDIO_DIR ..."
log_message ""

# Get list of MP3 files
mp3_files=$(rclone lsf --files-only "$SRC_AUDIO_DIR" </dev/null | grep -E '\.mp3$' | sort -V)

if [ -z "$mp3_files" ]; then
    log_message "❌ No MP3 files found in $SRC_AUDIO_DIR"
    exit 1
fi

# Count total files
total_mp3=$(echo "$mp3_files" | wc -l)
log_message "Found $total_mp3 MP3 files"

# Process each MP3 file
mp3_count=0
while IFS= read -r src_file; do
    ((mp3_count++))
    ((TOTAL_FILES++))
    
    # Determine destination filename
    if [[ "$src_file" =~ ^Foreword-pt\.mp3$ ]]; then
        dst_file="foreword-pt.mp3"
    elif [[ "$src_file" =~ ^paper([0-9]+)-pt\.mp3$ ]]; then
        paper_num="${BASH_REMATCH[1]}"
        # Add leading hyphen for consistency
        dst_file="paper-${paper_num}-pt.mp3"
    else
        log_message "  ⚠️  Skipping unexpected file: $src_file"
        ((SKIPPED_FILES++))
        continue
    fi
    
    # Check if file exists (for resume mode)
    if check_file_exists "$dst_file"; then
        log_message "  ⏭️  Skipping $src_file → $dst_file (already exists)"
        ((SKIPPED_FILES++))
        continue
    fi
    
    # Log the operation
    log_message "  📤 [$mp3_count/$total_mp3] Uploading $src_file → $dst_file"
    
    # Copy the file
    if [ "$IS_DRYRUN" = "0" ]; then
        if rclone copyto \
            "$SRC_AUDIO_DIR/$src_file" \
            "$DST_BUCKET/$dst_file" \
            --no-check-dest \
            --s3-upload-concurrency=10 \
            $RCLONE_OPTS \
            --log-level=ERROR \
            </dev/null; then
            log_message "    ✅ Success"
            ((PROCESSED_FILES++))
        else
            log_message "    ❌ Failed to upload"
            ((FAILED_FILES++))
            FAILED_LIST+=("MP3: $src_file → $dst_file")
        fi
    else
        log_message "    🔍 [DRY RUN] Would upload and rename to $dst_file"
        ((PROCESSED_FILES++))
    fi
    
    # Test mode: only process first file
    if [ "$TEST_MODE" = "1" ]; then
        log_message ""
        log_message "  🧪 Test mode: Stopping after first MP3 file"
        break
    fi
done <<< "$mp3_files"

log_message ""
log_message "✅ MP3 processing complete: $mp3_count files processed"

# ─────────────────────────────┐
#  PROCESS PORTUGUESE PDF FILES │
# ─────────────────────────────┘
log_message ""
log_message "=== Processing Portuguese PDF Files ==="
log_message "Scanning $SRC_PDF_DIR ..."
log_message ""

# Get list of PDF files from the correct directory
pdf_files=$(rclone lsf --files-only "$SRC_PDF_DIR" </dev/null | grep -E '\.pdf$' | sort -V)

if [ -z "$pdf_files" ]; then
    log_message "⚠️  No PDF files found in $SRC_PDF_DIR"
else
    # Count total files
    total_pdf=$(echo "$pdf_files" | wc -l)
    log_message "Found $total_pdf PDF files in PDFs folder"
    
    # Process each PDF file
    pdf_count=0
    while IFS= read -r src_file; do
        ((pdf_count++))
        ((TOTAL_FILES++))
        
        # Determine destination filename
        if [[ "$src_file" =~ ^Foreword-pt\.pdf$ ]]; then
            dst_file="foreword-pt.pdf"
        elif [[ "$src_file" =~ ^paper([0-9]+)-pt\.pdf$ ]]; then
            paper_num="${BASH_REMATCH[1]}"
            dst_file="paper-${paper_num}-pt.pdf"
        else
            log_message "  ⚠️  Skipping unexpected file: $src_file"
            ((SKIPPED_FILES++))
            continue
        fi
        
        # Check if file exists (for resume mode)
        if check_file_exists "$dst_file"; then
            log_message "  ⏭️  Skipping $src_file → $dst_file (already exists)"
            ((SKIPPED_FILES++))
            continue
        fi
        
        # Log the operation
        log_message "  📤 [$pdf_count/$total_pdf] Uploading $src_file → $dst_file"
        
        # Copy the file
        if [ "$IS_DRYRUN" = "0" ]; then
            if rclone copyto \
                "$SRC_PDF_DIR/$src_file" \
                "$DST_BUCKET/$dst_file" \
                --no-check-dest \
                --s3-upload-concurrency=10 \
                $RCLONE_OPTS \
                --log-level=ERROR \
                </dev/null; then
                log_message "    ✅ Success"
                ((PROCESSED_FILES++))
            else
                log_message "    ❌ Failed to upload"
                ((FAILED_FILES++))
                FAILED_LIST+=("PDF: $src_file → $dst_file")
            fi
        else
            log_message "    🔍 [DRY RUN] Would upload and rename to $dst_file"
            ((PROCESSED_FILES++))
        fi
        
        # Test mode: only process first file
        if [ "$TEST_MODE" = "1" ]; then
            log_message ""
            log_message "  🧪 Test mode: Stopping after first PDF file"
            break
        fi
    done <<< "$pdf_files"
fi

log_message ""
log_message "✅ PDF processing complete"

# ─────────────────┐
#  VERIFY UPLOADS  │
# ─────────────────┘
if [ "$VERIFY_MODE" = "1" ] && [ "$IS_DRYRUN" = "0" ]; then
    log_message ""
    log_message "=== Verifying Uploads ==="
    
    # Verify MP3s
    log_message "Verifying MP3 files..."
    expected_mp3s=197  # Foreword + 196 papers
    mp3_papers=$(rclone ls "$DST_BUCKET" </dev/null | grep -c "paper-[0-9]\+-pt\.mp3" || true)
    mp3_foreword=$(rclone ls "$DST_BUCKET" </dev/null | grep -c "foreword-pt\.mp3" || true)
    actual_mp3s=$((mp3_papers + mp3_foreword))
    log_message "  Expected: $expected_mp3s MP3 files"
    log_message "  Found: $actual_mp3s MP3 files"
    
    # Verify PDFs
    log_message "Verifying PDF files..."
    expected_pdfs=197  # Foreword + 196 papers
    pdf_papers=$(rclone ls "$DST_BUCKET" </dev/null | grep -c "paper-[0-9]\+-pt\.pdf" || true)
    pdf_foreword=$(rclone ls "$DST_BUCKET" </dev/null | grep -c "foreword-pt\.pdf" || true)
    actual_pdfs=$((pdf_papers + pdf_foreword))
    log_message "  Expected: $expected_pdfs PDF files"
    log_message "  Found: $actual_pdfs PDF files"
    
    # Check for specific files
    log_message ""
    log_message "Checking key files:"
    for file in "foreword-pt.mp3" "foreword-pt.pdf" "paper-1-pt.mp3" "paper-196-pt.mp3"; do
        if rclone ls "$DST_BUCKET/$file" >/dev/null 2>&1; then
            log_message "  ✅ $file exists"
        else
            log_message "  ❌ $file missing"
        fi
    done
fi

# ───────────────┐
#  FINAL REPORT  │
# ───────────────┘
log_message ""
log_message "════════════════════════════════════════"
log_message "            UPLOAD SUMMARY              "
log_message "════════════════════════════════════════"
log_message "  Total files found:     $TOTAL_FILES"
log_message "  Files processed:       $PROCESSED_FILES"
log_message "  Files skipped:         $SKIPPED_FILES"
log_message "  Files failed:          $FAILED_FILES"
log_message "  Dry run:              $([ "$IS_DRYRUN" = "1" ] && echo "YES" || echo "NO")"
log_message "════════════════════════════════════════"

# List failed files if any
if [ ${#FAILED_LIST[@]} -gt 0 ]; then
    log_message ""
    log_message "Failed uploads:"
    for failed in "${FAILED_LIST[@]}"; do
        log_message "  - $failed"
    done
fi

log_message ""
log_message "Log saved to: $LOG_FILE"
log_message "Upload completed at: $(date)"

# Exit with appropriate code
if [ "$FAILED_FILES" -gt 0 ]; then
    exit 1
else
    exit 0
fi