# Pull Request Example for UrantiaBookPod Cleanup

This document provides a comprehensive, step-by-step guide for creating a professional Pull Request, using our recent cleanup work as an example.

## 1. Preparing Your Branch

### 1.1. Create and Work on a Feature Branch

```bash
# Make sure you're on the main branch and it's up-to-date
git checkout code-only
git pull

# Create and switch to a feature branch
git checkout -b cleanup
```

### 1.2. Make and Commit Your Changes

```bash
# Make your changes to the codebase
# Then stage all changes
git add .

# Create a commit with a descriptive message
git commit -m "refactor: remove non-podcast components and fix Jesus Series links

This commit:
1. Removes framework-related components (TriangleFramework, etc.)
2. Removes unused services (airtable.ts) and scripts
3. Cleans up unused types related to Domain, Project, etc.
4. Fixes EpisodeCard to use sourceUrl for Jesus Series links
5. Adds comprehensive testing documentation

This cleanup reduces bundle size and focuses the codebase on podcast functionality
in preparation for i18n implementation."
```

### 1.3. Push Your Branch to GitHub

```bash
# Push to the remote repository
git push -u origin cleanup
```

## 2. Creating the Pull Request on GitHub

### 2.1. Navigate to Your Repository

1. Open your web browser
2. Go to your repository URL: `https://github.com/your-username/ubpod-new`

### 2.2. Initiate the PR

You'll typically see one of these options:

**Option A: Banner Notification**
- After pushing a branch, GitHub often shows a yellow banner with a "Compare & pull request" button
- Click this button

**Option B: Manual PR Creation**
1. Click on the "Pull requests" tab at the top of your repository
2. Click the green "New pull request" button
3. In the "compare" dropdown, select your `cleanup` branch
4. In the "base" dropdown, ensure `code-only` is selected (this is the branch you want to merge into)
5. Click "Create pull request"

### 2.3. Fill Out the PR Form

The PR form has several important fields:

**PR Title:**
```
Refactor: Remove non-podcast components and prepare for i18n
```

**PR Description:**
```markdown
## Overview
This PR streamlines the codebase by removing non-podcast related components and functionality. It also fixes a bug with Jesus Series links and adds comprehensive testing documentation.

## Changes
- Removed framework components (TriangleFramework, TrianglePlot, etc.)
- Removed unused services (airtable.ts) and scripts
- Cleaned up unused types (Domain, Project, Provider, etc.)
- Removed unused hooks (useDomains, useProjects, useProviders)
- Fixed EpisodeCard to use sourceUrl for Jesus Series links
- Added comprehensive testing documentation
- Added CI/CD primer documentation

## Bug Fixes
- **Jesus Series Links**: The EpisodeCard component was hardcoding links to the DiscoverJesus.com homepage instead of using the sourceUrl property from the episode data. This fix ensures users are directed to the specific content page.

## Testing Done
- Verified the application builds successfully
- Manually tested navigation and audio playback
- Confirmed Jesus Series links now point to correct pages
- Checked for any console errors
- Verified app functionality in Chrome, Firefox, and Safari

## Screenshots

### Before: Jesus Series Link to Homepage
[Optional: Add screenshots showing the before state]

### After: Jesus Series Link to Specific Page
[Optional: Add screenshots showing the after state]

## Checklist
- [x] Code builds without errors
- [x] Manual testing completed
- [x] Documentation updated
- [x] No new console errors
- [x] Bundle size reduced
```

### 2.4. Adding Screenshots to Your PR (Optional)

To add screenshots:

1. Take screenshots showing the before/after state
2. In the PR description editor, you can:
   - Drag and drop images directly into the editor
   - Click the image icon in the toolbar and select your image file
   - GitHub will automatically upload and insert the image

### 2.5. Submit the PR

1. Review your PR description for completeness
2. Click the green "Create pull request" button

## 3. Navigating the PR Interface

After creating your PR, you'll be taken to the PR page which has several tabs:

### 3.1. "Conversation" Tab

This tab shows:
- The PR description
- A timeline of events (commits, comments, etc.)
- A comment box for discussions

### 3.2. "Commits" Tab

Lists all commits included in this PR

### 3.3. "Checks" Tab

Shows the status of any automated checks or CI/CD pipelines

### 3.4. "Files changed" Tab

This crucial tab shows:
- All files changed in the PR
- The exact changes made to each file
- A diff view showing additions (green) and deletions (red)

## 4. Self-Review Your PR

Before requesting reviews from others, conduct a thorough self-review:

### 4.1. Review the Files Changed

1. Go to the "Files changed" tab
2. Look through all changes
3. Ensure all intended changes are included
4. Check for unintended changes

### 4.2. Add Review Comments

You can comment on your own code:

1. Hover over a line of code
2. Click the blue "+" icon that appears
3. Type your comment
4. Click "Add single comment"

### 4.3. View Deployment Preview (if using Vercel)

If you have Vercel connected:
1. Find the "Vercel" check in the PR
2. Click "Details" to view the preview deployment
3. Test your changes in this isolated environment

## 5. Request Reviews

In a team environment, you'd request reviews:

### 5.1. Add Reviewers

1. In the right sidebar, click the gear icon next to "Reviewers"
2. Select team members to review your PR
3. GitHub will notify them automatically

### 5.2. Mention Specific People in Comments

For specific questions:
1. Add a comment in the conversation tab
2. Use the "@" symbol to mention people (e.g., "@username")
3. Ask your specific question

## 6. Address Feedback

When reviewers provide feedback:

### 6.1. View Review Comments

1. Reviewers can leave comments on specific lines
2. They can also leave overall review comments
3. These will appear in the "Conversation" tab

### 6.2. Respond to Comments

1. Under each comment, click "Reply"
2. You can:
   - Ask for clarification
   - Explain your reasoning
   - Agree to make changes

### 6.3. Make Requested Changes

1. Go back to your local branch
   ```bash
   git checkout cleanup
   ```

2. Make the necessary changes

3. Commit and push the changes
   ```bash
   git add .
   git commit -m "fix: address PR feedback"
   git push
   ```

4. The PR will automatically update with your new changes

### 6.4. Mark Comments as Resolved

1. After addressing a comment, click "Resolve conversation"
2. This helps track which issues have been fixed

## 7. Merging the PR

Once your PR is approved and ready:

### 7.1. Check Requirements

Ensure:
- All required reviews are approved
- All automated checks pass
- No unresolved conversations remain

### 7.2. Choose a Merge Method

GitHub offers three merge methods:

1. **Create a merge commit** (default)
   - Preserves all commits from your branch
   - Adds a new "merge commit"
   - Good for keeping detailed history

2. **Squash and merge**
   - Combines all your commits into one
   - Keeps history cleaner
   - Good for feature branches with many small commits

3. **Rebase and merge**
   - Adds your commits without a merge commit
   - Creates a linear history
   - Good for small, clean branches

For our cleanup work, "Squash and merge" is recommended.

### 7.3. Complete the Merge

1. Click the green "Merge pull request" button (or "Squash and merge")
2. Confirm the commit message
3. Click "Confirm merge"
4. (Optional) Delete the branch when prompted

## 8. After Merging

### 8.1. Update Your Local Repository

```bash
# Switch back to the main branch
git checkout code-only

# Pull the latest changes (including your merged PR)
git pull

# Delete your local feature branch (optional)
git branch -d cleanup
```

### 8.2. Verify Production Deployment

1. If using Vercel, it will automatically deploy your changes
2. Check your production site to verify everything works

### 8.3. Create a New Branch for Next Feature

When you're ready to start on i18n:

```bash
# Create a new branch for i18n work
git checkout -b i18n
```

## Example PR Timeline

Here's how a typical PR process flows:

1. **Day 1**:
   - Create branch and make changes
   - Push branch and create PR
   - Conduct self-review

2. **Day 1-2**:
   - Reviewers leave comments
   - You address feedback
   - Push additional commits

3. **Day 2-3**:
   - Final approvals received
   - Merge PR
   - Verify production deployment

## Visual Step-by-Step Guide for Creating a GitHub PR

### Step 1: After pushing your branch, go to your GitHub repository
![GitHub repository page](https://docs.github.com/assets/cb-79331/mw-1440/images/help/pull_requests/pull-request-start-review-button.webp)

### Step 2: Click "Compare & pull request" button
![Compare & pull request button](https://docs.github.com/assets/cb-25835/mw-1440/images/help/pull_requests/pull-request-click-to-create.webp)

### Step 3: Fill in PR details
![Fill PR details](https://docs.github.com/assets/cb-33561/mw-1440/images/help/pull_requests/pullrequest-description.webp)

### Step 4: Create the pull request
![Create pull request](https://docs.github.com/assets/cb-151543/mw-1440/images/help/pull_requests/pullrequest-send.webp)

### Step 5: PR is created and ready for review
![PR created](https://docs.github.com/assets/cb-42604/mw-1440/images/help/pull_requests/pull-request-review-page.webp)

*Note: GitHub's interface may change slightly over time, but the core process remains the same.*