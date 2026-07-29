# Releasing

This maintenance branch publishes to npm tag `legacy-0.9`.
Only compatible bug fixes and chores are accepted.

## Steps

1. Update [CHANGELOG.md](CHANGELOG.md) with the relevant changes and today's date.
2. Commit the changelog as `docs: changes for {version}`.
3. Run `yarn release` and select the next patch version. This step does `git push` for you.
4. Create and publish a (normal) GitHub release using the new tag and the changelog content.
   Do not mark the release as a prerelease or as the latest release.

Ensure `legacy-0.9` is published to npm.
