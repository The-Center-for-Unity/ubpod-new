#!/usr/bin/env bash
#
# push-pdfs.sh  –  copy Spanish PDFs from Google Drive to Cloudflare R2
#
# Usage
#   DRYRUN=1 bash push-pdfs.sh    # rehearsal – nothing is uploaded
#   bash push-pdfs.sh             # real transfer
#

set -euo pipefail

# ─────────────────────── REMOTE PATHS ───────────────────────
SRC_DIR='ubpod:UBPod/ES PDFs'      # Google Drive remote + folder
DST_DIR='R2-UbPod:ubpod'           # R2 remote + bucket
PARALLEL=8                         # simultaneous uploads

# ---- optional dry-run flag ---------------------------------
RCLONE_OPTS="-P --transfers=$PARALLEL --retries 5 --low-level-retries 3"
[[ "${DRYRUN:-}" == 1 ]] && {
  echo "### DRY-RUN enabled – no data will be moved ###"
  RCLONE_OPTS="$RCLONE_OPTS --dry-run"
}

# ─────────────────────── MAIN LOOP ──────────────────────────
echo "Scanning $SRC_DIR ..."
rclone lsf --files-only "$SRC_DIR" \
  | grep -E '^paper[0-9]+-es\.pdf$' \
  | while read -r src_file; do
        # build destination name: paper111-es.pdf → paper-111-es.pdf
        dst_file=$(echo "$src_file" \
                   | sed -E 's/^paper([0-9]+)-es\.pdf$/paper-\1-es.pdf/')

        printf '→  %-30s ⇒  %s\n' "$src_file" "$dst_file"

        rclone copyto \
          "$SRC_DIR/$src_file" \
          "$DST_DIR/$dst_file" \
          $RCLONE_OPTS
    done
