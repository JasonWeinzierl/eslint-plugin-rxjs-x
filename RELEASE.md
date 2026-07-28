# Releasing

See [SECURITY.md](.github/SECURITY.md) for supported major versions.
The npm tag `latest` is for latest, and `legacy-*` is for maintenance branches;
the `publish` workflow handles this.

## Latest release

1. Update the [CHANGELOG.md](CHANGELOG.md) with all relevant changes and today's date.
2. Commit changelog changes as `docs: changes for {version}`.
3. Run `yarn release`, and select the intended version.
4. Create and publish a GitHub release using the created tag and content from the changelog.

Publishing the GitHub release starts the `publish` workflow.

## Maintenance releases

Only compatible bug fixes and chores should be added to maintenance branches.

The publish workflow pins the CI step to a particular commit.
When the CI workflow itself is intentionally changed, update that pin on `main` before releasing.

1. Update the branch's changelog and commit.
2. Run `yarn release`, and select the next patch version.
3. Create and publish a GitHub release. Do not mark it as "latest".
