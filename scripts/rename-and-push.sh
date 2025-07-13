#!/usr/bin/env bash
#
# rename-and-push.sh – copy Spanish MP3 episodes from Google Drive to Cloudflare R2
# Usage:
#   bash rename-and-push.sh   # real run
#   DRYRUN=1 bash rename-and-push.sh   # rehearsal – nothing is actually uploaded
#

set -euo pipefail

# ───────────────────────┐
#  REMOTE CONFIGURATION  │  Adjust these three lines if your names differ
# ───────────────────────┘
SRC_DIR='ubpod:UBPod/ES Audio Files'      # Google Drive remote + path
DST_DIR='R2-UbPod:ubpod'                 # R2 remote + bucket
PARALLEL=8                                # simultaneous transfers

# ───── optional dry-run flag ─────
RCLONE_OPTS="-P --transfers=$PARALLEL --retries 5 --low-level-retries 3"
if [[ "${DRYRUN:-}" == 1 ]]; then
  echo "### DRY-RUN enabled – no data will be moved ###"
  RCLONE_OPTS="$RCLONE_OPTS --dry-run"
fi

# ───── main loop ─────
echo "Scanning $SRC_DIR ..."
rclone lsf --files-only "$SRC_DIR" |
grep -E '^Paper [0-9]+-es\.mp3$' |
while read -r src_file; do
  # build new name
  dst_file=$(echo "$src_file" | sed -E 's/^Paper ([0-9]+)-es\.mp3$/paper-\1-es.mp3/')

  printf '→  %-35s  ⇒  %s\n' "$src_file" "$dst_file"

  # copy with rename
  rclone copyto \
    "$SRC_DIR/$src_file" \
    "$DST_DIR/$dst_file" \
    $RCLONE_OPTS
done
