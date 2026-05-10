import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const ROOT = process.cwd();
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function safePath(segments = []) {
  const requestedPath = segments.length > 0 ? segments.join('/') : 'index.html';
  const normalized = requestedPath.endsWith('/') ? `${requestedPath}index.html` : requestedPath;
  const candidate = path.resolve(ROOT, normalized);

  if (!candidate.startsWith(ROOT)) return null;
  return candidate;
}

async function readLegacyFile(filePath) {
  try {
    return await readFile(filePath);
  } catch {
    if (!path.extname(filePath)) {
      return readFile(path.join(filePath, 'index.html'));
    }
    throw new Error('not-found');
  }
}

export async function GET(_request, { params }) {
  const filePath = safePath(params?.path);

  if (!filePath) return new NextResponse('Not found', { status: 404 });

  try {
    const body = await readLegacyFile(filePath);
    const ext = path.extname(filePath) || '.html';
    return new NextResponse(body, {
      headers: {
        'content-type': MIME_TYPES[ext] || 'application/octet-stream'
      }
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
