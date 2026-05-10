import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';

const STATIC_ROOT = process.cwd();
const ALLOWED_ROOTS = new Set(['academy', 'assets', 'components', 'data', 'lib']);
const ALLOWED_ROOT_FILES = new Set(['index.html', 'script.js', 'styles.css']);
const ALLOWED_EXTENSIONS = new Set(['.css', '.html', '.js', '.jpg', '.jpeg', '.png', '.svg', '.webp']);

const CONTENT_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

type RouteContext = {
  params?: Promise<{ path?: string[] }> | { path?: string[] };
};

function asStaticPath(pathSegments: string[] = []) {
  const cleanSegments = pathSegments.map((segment) => decodeURIComponent(segment)).filter(Boolean);
  const firstSegment = cleanSegments[0];

  if (cleanSegments.length === 0) return 'index.html';

  if (cleanSegments.length === 1 && ALLOWED_ROOT_FILES.has(firstSegment)) return firstSegment;
  if (!ALLOWED_ROOTS.has(firstSegment)) return null;

  const requestedPath = cleanSegments.join('/');
  const extension = extname(requestedPath);

  if (!extension) return `${requestedPath}/index.html`;
  if (!ALLOWED_EXTENSIONS.has(extension)) return null;

  return requestedPath;
}

function toSafeAbsolutePath(staticPath: string) {
  const normalizedPath = normalize(staticPath);

  if (normalizedPath.startsWith('..') || normalizedPath.includes(`..${sep}`) || normalizedPath.startsWith(sep)) {
    return null;
  }

  return join(STATIC_ROOT, normalizedPath);
}

function notFound() {
  return new Response('Not found', {
    status: 404,
    headers: {
      'content-type': 'text/plain; charset=utf-8'
    }
  });
}

export async function GET(_request: Request, context: RouteContext) {
  const params = context.params ? await context.params : undefined;
  const staticPath = asStaticPath(params?.path);

  if (!staticPath) return notFound();

  const absolutePath = toSafeAbsolutePath(staticPath);
  if (!absolutePath) return notFound();

  try {
    const body = await readFile(absolutePath);
    const extension = extname(staticPath);

    return new Response(new Uint8Array(body), {
      headers: {
        'content-type': CONTENT_TYPES[extension] ?? 'application/octet-stream',
        'cache-control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
      }
    });
  } catch {
    return notFound();
  }
}

export async function HEAD(request: Request, context: RouteContext) {
  const response = await GET(request, context);
  return new Response(null, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}
