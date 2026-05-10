const { readdirSync, statSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');

const ignoredDirectories = new Set(['.git', '.next', 'node_modules', 'dist', 'build']);
const jsFiles = [];

function collectJavaScriptFiles(directory) {
  for (const entry of readdirSync(directory)) {
    if (ignoredDirectories.has(entry)) continue;

    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      collectJavaScriptFiles(fullPath);
    } else if (entry.endsWith('.js') || entry.endsWith('.mjs') || entry.endsWith('.cjs')) {
      jsFiles.push(fullPath);
    }
  }
}

collectJavaScriptFiles(process.cwd());

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log(`Static build check passed for ${jsFiles.length} JavaScript config/source files.`);
