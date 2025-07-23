# Portuguese Upload Script Test Plan
**Date:** July 13, 2025  
**Script:** `scripts/rename-and-push-portuguese.sh`  
**Purpose:** Step-by-step manual testing guide for Portuguese audio/PDF upload

## Pre-Test Checklist

### 1. Environment Verification
```bash
# Check rclone is installed
rclone version

# Verify rclone remotes are configured
rclone listremotes

# Should see:
# ubpod:
# R2-UbPod:
```

### 2. Google Drive Access Verification
```bash
# Test access to Portuguese audio files
rclone lsf "ubpod:UBPod/PT Audio Files" | head -5

# Expected output:
# Foreword-pt.mp3
# Foreword-pt.pdf
# paper1-pt.mp3
# paper10-pt.mp3
# paper100-pt.mp3

# Test access to Portuguese PDF files
rclone lsf "ubpod:UBPod/PT PDFs" | head -5

# Expected output:
# paper1-pt.pdf
# paper10-pt.pdf
# paper100-pt.pdf
# paper101-pt.pdf
# paper102-pt.pdf
```

### 3. R2 Bucket Access Verification
```bash
# Test write access to R2 bucket
echo "test" > test.txt
rclone copy test.txt R2-UbPod:ubpod/
rclone ls R2-UbPod:ubpod/test.txt
rclone delete R2-UbPod:ubpod/test.txt
rm test.txt
```

## Test Phase 1: Dry Run Testing

### Test 1.1: Basic Dry Run
```bash
# Run script in dry run mode to preview all operations
DRYRUN=1 ./scripts/rename-and-push-portuguese.sh

# Expected behavior:
# - Lists all 197 MP3 files
# - Lists all 197 PDF files
# - Shows rename operations (paper1-pt.mp3 → paper-1-pt.mp3)
# - Shows special handling of Foreword → foreword-pt
# - No actual uploads occur
# - Creates log file in logs/portuguese-upload/
```

### Test 1.2: Dry Run with Test Mode
```bash
# Preview only first file of each type
DRYRUN=1 ./scripts/rename-and-push-portuguese.sh --test

# Expected output:
# - Shows processing of Foreword-pt.mp3 → foreword-pt.mp3
# - Shows processing of paper1-pt.pdf → paper-1-pt.pdf
# - Stops after first file of each type
```

## Test Phase 2: Test Mode Upload

### Test 2.1: Upload Single Files
```bash
# Upload only the first file of each type
./scripts/rename-and-push-portuguese.sh --test

# Expected results:
# - Uploads Foreword-pt.mp3 as foreword-pt.mp3
# - Uploads paper1-pt.pdf as paper-1-pt.pdf
# - Log shows "🧪 Test mode: Stopping after first MP3 file"
```

### Test 2.2: Verify Test Upload
```bash
# Check uploaded files
rclone ls R2-UbPod:ubpod/ | grep -E "(foreword|paper-1)-pt\.(mp3|pdf)"

# Expected output:
# <size> foreword-pt.mp3
# <size> paper-1-pt.pdf

# Test file accessibility via HTTP (if CDN configured)
curl -I https://your-cdn-url/foreword-pt.mp3
curl -I https://your-cdn-url/paper-1-pt.pdf
```

## Test Phase 3: Resume Mode Testing

### Test 3.1: Resume with Existing Files
```bash
# Run with resume mode (should skip already uploaded files)
./scripts/rename-and-push-portuguese.sh --resume --test

# Expected output:
# - "⏭️  Skipping Foreword-pt.mp3 → foreword-pt.mp3 (already exists)"
# - "⏭️  Skipping paper1-pt.pdf → paper-1-pt.pdf (already exists)"
```

### Test 3.2: Force Mode Override
```bash
# Force re-upload of existing files
./scripts/rename-and-push-portuguese.sh --force --test

# Expected behavior:
# - Re-uploads files even if they exist
# - Shows "📤 Uploading" instead of "⏭️ Skipping"
```

## Test Phase 4: Edge Cases

### Test 4.1: Naming Pattern Verification
```bash
# Check for files with unexpected naming
rclone lsf "ubpod:UBPod/PT Audio Files" | grep -v -E "^(Foreword-pt\.(mp3|pdf)|paper[0-9]+-pt\.mp3)$"

# Should return empty (no unexpected files)
```

### Test 4.2: Numeric Sorting Test
```bash
# Verify correct handling of paper9 vs paper10
DRYRUN=1 ./scripts/rename-and-push-portuguese.sh | grep -E "paper(9|10|11)-pt"

# Should show:
# paper9-pt.mp3 → paper-9-pt.mp3
# paper10-pt.mp3 → paper-10-pt.mp3
# paper11-pt.mp3 → paper-11-pt.mp3
# (NOT paper1, paper10, paper11 order)
```

## Test Phase 5: Full Upload Simulation

### Test 5.1: Count Verification
```bash
# Verify file counts before upload
echo "MP3 files: $(rclone lsf "ubpod:UBPod/PT Audio Files" | grep -c "\.mp3$")"
echo "PDF files in PDFs: $(rclone lsf "ubpod:UBPod/PT PDFs" | grep -c "\.pdf$")"
echo "PDF files in Audio: $(rclone lsf "ubpod:UBPod/PT Audio Files" | grep -c "\.pdf$")"

# Expected:
# MP3 files: 197
# PDF files in PDFs: 196
# PDF files in Audio: 1 (Foreword-pt.pdf)
```

### Test 5.2: Upload Progress Monitoring
```bash
# Start upload with resume capability
./scripts/rename-and-push-portuguese.sh --resume

# Monitor progress:
# - Watch for "📤 [X/197] Uploading" messages
# - Check for any "❌ Failed to upload" errors
# - Monitor network usage
# - Can interrupt with Ctrl+C and resume later
```

### Test 5.3: Verify Mode
```bash
# Run verification after upload
./scripts/rename-and-push-portuguese.sh --verify

# Expected output:
# Verifying MP3 files...
#   Expected: 197 MP3 files
#   Found: 197 MP3 files
# Verifying PDF files...
#   Expected: 197 PDF files
#   Found: 197 PDF files
# Checking key files:
#   ✅ foreword-pt.mp3 exists
#   ✅ foreword-pt.pdf exists
#   ✅ paper-1-pt.mp3 exists
#   ✅ paper-196-pt.mp3 exists
```

## Test Phase 6: Error Recovery

### Test 6.1: Network Interruption
1. Start upload: `./scripts/rename-and-push-portuguese.sh`
2. After ~50 files, disconnect network
3. Script should show failures and continue attempting
4. Reconnect network
5. Run with resume: `./scripts/rename-and-push-portuguese.sh --resume`
6. Should skip already uploaded files and continue

### Test 6.2: Log Analysis
```bash
# Check latest log file
ls -la logs/portuguese-upload/
tail -50 logs/portuguese-upload/portuguese-upload-*.log

# Look for:
# - Failed uploads
# - Skipped files
# - Final summary statistics
```

## Test Phase 7: Final Validation

### Test 7.1: Complete File List
```bash
# Generate list of all uploaded files
rclone ls R2-UbPod:ubpod/ | grep "-pt\." | sort > uploaded-files.txt

# Verify counts
echo "Total PT files: $(cat uploaded-files.txt | wc -l)"
echo "MP3 files: $(cat uploaded-files.txt | grep -c "\.mp3$")"
echo "PDF files: $(cat uploaded-files.txt | grep -c "\.pdf$")"

# Should be:
# Total PT files: 394
# MP3 files: 197
# PDF files: 197
```

### Test 7.2: Application Integration Test
```bash
# Test a few URLs that the application will use
curl -I https://your-cdn-url/foreword-pt.mp3
curl -I https://your-cdn-url/paper-1-pt.mp3
curl -I https://your-cdn-url/paper-77-pt.mp3
curl -I https://your-cdn-url/paper-196-pt.mp3

# All should return HTTP 200 OK
```

## Troubleshooting Guide

### Issue: "No such file or directory"
```bash
# Check remote paths
rclone lsd ubpod:UBPod/
# Should list: PT Audio Files, PT PDFs
```

### Issue: "Permission denied" on R2
```bash
# Verify R2 credentials
rclone lsd R2-UbPod:
# Should list: ubpod/
```

### Issue: Files not renamed correctly
```bash
# Check specific file pattern
rclone lsf "ubpod:UBPod/PT Audio Files" | grep -E "paper[0-9]+-pt\.mp3" | head -5
# Verify pattern matches script expectations
```

### Issue: Upload extremely slow
```bash
# Test with reduced concurrency
rclone copy test.mp3 R2-UbPod:ubpod/ --s3-upload-concurrency=1 -P
# Compare with normal concurrency
rclone copy test.mp3 R2-UbPod:ubpod/ --s3-upload-concurrency=10 -P
```

## Success Criteria

✅ All 197 MP3 files uploaded with correct naming  
✅ All 197 PDF files uploaded with correct naming  
✅ Foreword files renamed to foreword-pt.*  
✅ Paper files renamed with hyphen: paper-N-pt.*  
✅ Resume mode successfully skips existing files  
✅ Verify mode confirms all files present  
✅ No errors in final log summary  
✅ Files accessible via CDN URLs  

## Post-Upload Checklist

1. **Save logs**: Copy log files to a permanent location
2. **Document issues**: Note any files that required manual intervention
3. **Update PR**: Add upload completion status to pull request
4. **Notify team**: Inform Portuguese QA team that files are ready
5. **Clean up**: Remove any test files created during testing

---

**Note**: This test plan ensures reliable upload of Portuguese audio/PDF files with proper error handling and recovery capabilities.