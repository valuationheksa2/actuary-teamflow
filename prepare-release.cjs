'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { spawnSync } = require('node:child_process');
const AdmZip = require('adm-zip');

const root = __dirname;
const archivePath = path.join(root, 'teamflow-v2.1-netlify.zip');
const target = path.resolve(root, 'app');
const marker = path.join(target, '.teamflow-generated');
const expectedHash = '632fd4bd2373da39ab3643ae7d5181389ef7e144d6b675bd3be580ef5813bfbe';

function extractRelease() {
  const bytes = fs.readFileSync(archivePath);
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (hash !== expectedHash) throw new Error('Release ZIP checksum mismatch. Upload the ZIP supplied with these build files.');
  const zip = new AdmZip(bytes);
  for (const entry of zip.getEntries()) {
    const name = entry.entryName.replace(/\\/g, '/');
    const destination = path.resolve(target, name);
    if (!name || name.startsWith('/') || name.includes(':') || name.split('/').includes('..')
        || (destination !== target && !destination.startsWith(target + path.sep))) {
      throw new Error('Unsafe path in release archive.');
    }
  }
  // Only replace the build output that this script previously generated.
  if (target !== path.join(root, 'app')) throw new Error('Invalid build output path.');
  if (fs.existsSync(target)) {
    if (!fs.existsSync(marker) || fs.lstatSync(target).isSymbolicLink()) {
      throw new Error('The app directory is not generated build output. Move it before building.');
    }
    fs.rmSync(target, { recursive: true });
  }
  zip.extractAllTo(target, false);
  for (const file of ['package.json', 'package-lock.json', 'public/index.html', 'netlify/functions/auth.js', 'netlify/functions/works.js']) {
    if (!fs.existsSync(path.join(target, file))) throw new Error(`Release is missing ${file}.`);
  }
  fs.writeFileSync(marker, 'Generated from the verified TeamFlow release ZIP.\n');
  process.stdout.write('Verified and extracted TeamFlow release.\n');
}

function runNpm(args) {
  const npmCli = process.env.npm_execpath;
  if (!npmCli || !fs.existsSync(npmCli)) throw new Error('Run this build with npm run build.');
  const result = spawnSync(process.execPath, [npmCli, ...args], { cwd: target, stdio: 'inherit', env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`npm ${args[0]} failed (exit ${result.status}).`);
}

try {
  extractRelease();
  if (!process.argv.includes('--extract-only')) {
    runNpm(['ci', '--no-audit', '--no-fund']);
    runNpm(['run', 'build']);
  }
} catch (error) {
  process.stderr.write(`TeamFlow build failed: ${error.message}\n`);
  process.exitCode = 1;
}
