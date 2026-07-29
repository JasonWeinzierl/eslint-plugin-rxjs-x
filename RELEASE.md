# Releasing

The `main` branch publishes current stable releases to npm tag `latest`.

## Steps

1. Update the [CHANGELOG.md](CHANGELOG.md) with all relevant changes and today's date.
2. Commit changelog changes as `docs: changes for {version}`.
3. Run `yarn release` and select the intended version. This step does `git push` for you.
4. Create and publish a "latest" GitHub release using the new tag and the changelog content.

Ensure the new version is published to npm tag `latest`.

## Maintenance releases

Switch to the appropriate maintenance branch and follow that branch's `RELEASE.md`.
