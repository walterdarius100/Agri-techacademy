import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

function extractBodyContent(html: string) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch?.[1] ?? html;

  return bodyContent.replace(/<script\b[\s\S]*?<\/script>/gi, '');
}

export default async function HomePage() {
  const legacyHomeHtml = await readFile(join(process.cwd(), 'index.html'), 'utf8');
  const bodyContent = extractBodyContent(legacyHomeHtml);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
      <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js" defer />
      <script src="/script.js" defer />
    </>
  );
}
