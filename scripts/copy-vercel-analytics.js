'use strict';

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var src = path.join(root, 'node_modules', '@vercel', 'analytics', 'dist', 'index.mjs');
var destDir = path.join(root, 'gdcn-landing', 'vendor');
var dest = path.join(destDir, 'vercel-analytics.mjs');

if (!fs.existsSync(src)) {
  console.warn('[copy-vercel-analytics] Skip: package not installed yet');
  process.exit(0);
}
fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log('[copy-vercel-analytics] -> gdcn-landing/vendor/vercel-analytics.mjs');
