import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const STATIC_ROOTS = new Set(['academy', 'assets', 'components', 'data', 'lib']);
const STATIC_FILES = new Set(['index.html', 'script.js', 'styles.css']);
const MIME_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

function normalizeSegments(segments: string[] = []) {
  return segments.filter((segment) => segment && segment !== '.');
}

function isAllowedStaticPath(relativePath: string) {
  const extension = path.extname(relativePath).toLowerCase();
  if (!MIME_TYPES[extension]) return false;
  if (STATIC_FILES.has(relativePath)) return true;
  const [root] = relativePath.split('/');
  return STATIC_ROOTS.has(root);
}

async function fileExists(filePath: string) {
  const fileStat = await stat(filePath).catch(() => null);
  return Boolean(fileStat?.isFile());
}

async function resolveStaticFile(segments: string[]) {
  const cwd = process.cwd();
  const relativeRequest = segments.join('/') || 'index.html';
  const directRelativePath = relativeRequest.endsWith('/') ? `${relativeRequest}index.html` : relativeRequest;
  const directPath = path.join(cwd, directRelativePath);

  const candidates = [directPath];
  if (!path.extname(directRelativePath)) {
    candidates.push(path.join(cwd, directRelativePath, 'index.html'));
  }

  for (const candidate of candidates) {
    const relativePath = path.relative(cwd, candidate).replaceAll(path.sep, '/');
    const isInsideProject = relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath);

    if (isInsideProject && isAllowedStaticPath(relativePath) && (await fileExists(candidate))) {
      return { filePath: candidate, relativePath };
    }
  }

  return null;
}

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params;
  const segments = normalizeSegments(params.path);
  const staticFile = await resolveStaticFile(segments);

  if (!staticFile) {
    return new Response('Not found', { status: 404 });
  }

  const body = await readFile(staticFile.filePath);
  const extension = path.extname(staticFile.relativePath).toLowerCase();
  const contentType = MIME_TYPES[extension] ?? 'application/octet-stream';

  return new Response(body, {
    headers: {
      'Cache-Control': extension === '.html' ? 'no-store' : 'public, max-age=31536000, immutable',
      'Content-Type': contentType
    }
  });
}
