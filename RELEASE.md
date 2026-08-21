# Releasing

The `main` branch uses [release-please](https://github.com/googleapis/release-please) to prepare current stable releases.
Merging its release pull request creates the version tag and GitHub release.
The GitHub release then triggers the existing trusted npm publish workflow for the `latest` tag.

## Release process

1. Squash pull requests with Conventional Commit titles.
    - `fix` produces a patch release.
    - `feat` produces a minor release.
    - A type followed by `!`, or a `BREAKING CHANGE:` footer, produces a major release.
2. Review the release pull request maintained by release-please.
    - Confirm the proposed version in `package.json` and `.release-please-manifest.json`.
    - Confirm the generated [CHANGELOG.md](CHANGELOG.md) entry is complete.
    - Add a `Release-As: x.y.z` footer to a merged conventional commit when a specific version is required.
3. Merge the release pull request when ready to publish.
4. Confirm release-please created the expected `vX.Y.Z` tag and published GitHub release.
5. Confirm the `publish` workflow passed and npm lists the version under tag `latest`. The release pull request should have the `autorelease: published` label instead of `autorelease: tagged`.

Do not manually edit the package version, create the tag, or publish the GitHub release.
Rerun the `release-please` workflow if automation needs to be retried.

## Maintenance releases

Switch to the appropriate maintenance branch and follow that branch's `RELEASE.md`.

## First-time setup

Release-please uses a GitHub App token instead of `GITHUB_TOKEN` so that its pull requests run CI and its GitHub releases trigger the publish workflow.

1. Create a private GitHub App owned by the repository owner.
    - Use the repository URL as its homepage.
    - Disable webhooks.
    - Grant read and write access to **Contents**, **Issues**, and **Pull requests**.
    - Limit installation to this account.
2. Generate a private key for the App.
3. Install the App for this repository only.
4. Add the App's client ID as the repository Actions variable `RELEASE_PLEASE_APP_CLIENT_ID`.
5. Add the complete PEM private key as the repository Actions secret `RELEASE_PLEASE_APP_PRIVATE_KEY`.
6. Create the `autorelease: pending`, `autorelease: tagged`, and `autorelease: published` repository labels.
7. Merge the release-please configuration into `main`.
8. Run the `release-please` workflow manually if the initial push did not run it.

The manifest starts after the prior release tag.
