# GitHub Conflict Resolution Case Study

This document details a conflict resolution incident that occurred in the UBPod project repository in June 2025. It describes the problem, attempted solutions, and the final resolution to help future developers learn from this experience.

## The Incident

### Initial Situation

The repository had developed divergent branches with significant differences:

1. The `main` branch contained the original site with all components, including both podcast and non-podcast elements.
2. A `cleanup` branch had been created to refactor the codebase by removing non-podcast components.
3. The `code-only` branch contained an earlier refactoring attempt.

When attempting to merge these branches or create a new feature branch (i18n implementation), significant merge conflicts occurred that were challenging to resolve through normal git merge operations.

### Key Issues

1. **Structural Conflicts**: The `cleanup` branch had removed entire directories and components that still existed in `main`.
2. **Missing Dependencies**: The refactoring in `cleanup` created dependencies between files that weren't being properly resolved during merge attempts.
3. **Build Failures**: Even when merges appeared successful, the application would fail to build due to missing references.

## Attempted Solutions

### Approach 1: Standard Merge

First attempt was a standard git merge from `cleanup` into `main`:

```bash
git checkout main
git merge cleanup
```

This resulted in numerous conflicts across many files, with incompatible structural changes.

### Approach 2: Creating Intermediate Branches

Created multiple intermediate branches attempting different merge strategies:

1. `conflict-resolution` - Attempted to manually resolve conflicts file by file
2. `fix-conflicts` - Tried cherry-picking specific commits
3. `fresh-branch` - Started with a clean branch and applied changes incrementally
4. `code-only-with-cleanup` - Tried merging `code-only` with `cleanup` first

Each approach encountered issues with either:
- Missing file dependencies
- Structural incompatibilities 
- Build failures after apparent successful merges

### Approach 3: Creating Custom Utils Files

When trying to fix build errors in merged branches, attempted to recreate missing utility files:
- `urlUtils.ts`
- `seriesUtils.ts`
- `useAudioAnalytics.ts`

While this fixed some build errors, it introduced further complications with maintaining consistency between reconstructed files and existing codebase.

## Final Solution

After multiple failed attempts to resolve conflicts through standard git workflows, the decision was made to prioritize the `cleanup` branch as the definitive version.

### Implementation

1. **Hard Reset Main Branch**:
   ```bash
   git checkout main
   git reset --hard cleanup
   git push -f origin main
   ```

2. **Create Clean Feature Branch**:
   ```bash
   git checkout -b i18n-new
   git push -u origin i18n-new
   ```

3. **Clean Up Repository**:
   Deleted all temporary branches created during conflict resolution:
   ```bash
   git branch -D conflict-resolution fix-conflicts fresh-branch from-main code-only-with-cleanup i18n-from-cleanup i18n-implementation
   git push origin --delete conflict-resolution fix-conflicts from-main code-only-with-cleanup i18n-from-cleanup i18n-implementation
   ```

### Final Repository Structure

- `main` - Clean codebase (previously `cleanup`)
- `cleanup` - Preserved for reference
- `code-only` - Preserved for historical reference
- `i18n-new` - New feature branch for internationalization implementation

## Lessons Learned

1. **Branch Management**:
   - Limit long-lived feature branches
   - Merge or rebase with main frequently
   - Consider using feature flags for major structural changes

2. **Refactoring Approach**:
   - Break large refactoring efforts into smaller, incremental changes
   - Create comprehensive test coverage before major refactors
   - Document dependencies between components before removal

3. **Conflict Resolution**:
   - When conflicts become overwhelming, sometimes the best approach is to choose one definitive version rather than attempting complex merges
   - For significant structural changes, a hard reset may be cleaner than resolving conflicts manually
   - Always ensure good backups or references to all important code before aggressive git operations

4. **Repository Cleanup**:
   - Regularly clean up stale branches
   - Document branch purposes in PRs or README
   - Consider using branch protection rules for important branches

## Technical Details

### Key Files That Caused Conflicts

- `/src/utils/urlUtils.ts` - Missing in main but referenced in EpisodePage.tsx
- `/src/utils/seriesUtils.ts` - Structural changes between versions
- `/src/hooks/useAudioAnalytics.ts` - Required for audio functionality
- Various component files that were removed or significantly altered

### Build Errors

Primary build errors encountered:
- Missing module imports
- Undefined references to utility functions
- Type errors from structural changes to interfaces

## Recommendations for Future Work

1. Implement a more structured branching strategy such as GitFlow or GitHub Flow
2. Consider feature flags for major refactoring that can be toggled without breaking functionality
3. Improve automated testing to catch build issues earlier
4. Document dependencies between components more explicitly
5. For major structural changes, consider creating a new repository and migrating code incrementally

## Conclusion

This incident demonstrates that sometimes in software development, especially with complex refactoring, the most pragmatic approach is to choose a definitive version rather than attempting to reconcile highly divergent branches. While this approach may seem aggressive, it can save significant development time and reduce the risk of subtle bugs from incomplete conflict resolution.

The repository is now in a clean state with a clear path forward for implementing new features like internationalization.