# Security Policy

## Reporting

Please do not publish exploitable vulnerabilities or secrets in public issues. Contact the repository owner privately through GitHub's security advisory feature where available.

## Scope

LangSpot is a static client-side application. It has no account server and should not contain secrets. Progress is stored locally. Treat imported JSON as untrusted input; do not add HTML injection or evaluate imported strings as code.

## Supported versions

Security fixes target the latest release on `main`. Keep dependencies updated and review GitHub Dependabot alerts.
