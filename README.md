# TeamFlow — upload files without folders

Upload these six files to the root of your private GitHub repository using **Add file → Upload files → Choose your files**:

1. `teamflow-v2.1-netlify.zip`
2. `netlify.toml`
3. `package.json`
4. `package-lock.json`
5. `prepare-release.cjs`
6. `README.md`

The ZIP stays a ZIP on GitHub. Netlify's build extracts it into `app/`, installs the app's locked dependencies, checks the app, and bundles its API functions. You do not need to upload any folders or run Netlify CLI locally.

## New Netlify staging project

Import this repository from GitHub. Keep **Base directory empty** and use:

- Build command: `npm run build`
- Publish directory: `app/public`
- Functions directory: `app/netlify/functions`

The supplied root `netlify.toml` includes these settings, Node 22, API routes, and security headers. Use these build files instead of the similarly named files inside the ZIP.

Configure staging APP_URL, APP_ORIGINS, Blobs credentials, and a bootstrap token as described in SETUP_GUIDE.md. SMTP is optional and is not required for manual setup/reset links. On a fresh staging site, create your administrator through `/?setup=1` and remove the bootstrap token afterward. No accounts or production data are bundled into this ZIP.

This method requires a Git-connected Netlify build; it does not enable dashboard drag-and-drop deployment of the ZIP. No production deployment or migration has been performed.

The build verifies this ZIP's SHA-256 before extracting. A future release needs a matching updated prepare-release.cjs checksum. Do not replace only the ZIP with a different version.

For production with existing accounts, follow the bundled PRODUCTION_DEPLOYMENT.md and encrypted backup/local rehearsal workflow. The migration preserves current passwords as hashes and remaps Admin ID 0. Do not bootstrap over migrated accounts. Keep staging on main and production on a separate production branch.

Local preparation checks do not prove a hosted Netlify deployment. Check staging authentication, storage, account links, and installed PWA behavior after deployment.
