'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'maintenance');
fs.mkdirSync(path.join(root, 'public'), { recursive: true });
fs.mkdirSync(path.join(root, 'functions'), { recursive: true });
fs.writeFileSync(path.join(root, 'public', 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>TeamFlow maintenance</title><style>body{font-family:system-ui,sans-serif;background:#f0f4f8;color:#1a2535;min-height:100vh;display:grid;place-items:center;margin:0}.card{max-width:460px;background:white;border:1px solid #d0dcea;border-radius:12px;padding:32px;margin:20px}h1{font-size:24px}p{line-height:1.6}</style></head><body><main class="card"><h1>TeamFlow is being updated</h1><p>Please close all TeamFlow tabs and app windows. Your existing accounts and work are being transferred to the updated application.</p><p>Sign in again when your administrator confirms the update is complete.</p></main></body></html>`);
fs.writeFileSync(path.join(root, 'functions', 'maintenance.js'), `'use strict';\nexports.handler = async () => ({ statusCode: 503, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Retry-After': '600', 'X-TeamFlow-Maintenance': 'migration-v1' }, body: JSON.stringify({ error: 'TeamFlow is undergoing maintenance. Please close the app and return when the administrator confirms completion.' }) });\n`);
console.log('Maintenance page and API guard prepared. No Blobs access is used.');
