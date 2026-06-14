import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const sourceDir = path.join(rootDir, 'mock-data', 'maxkb_docs');
const txtOutDir = path.join(rootDir, 'mock-data', 'maxkb_txt');
const htmlOutDir = path.join(rootDir, 'mock-data', 'maxkb_html');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  ensureDir(dir);
}

function walkMarkdownFiles(dir) {
  const result = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      result.push(...walkMarkdownFiles(fullPath));
    } else if (item.isFile() && item.name.toLowerCase().endsWith('.md')) {
      result.push(fullPath);
    }
  }
  return result;
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '- ')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function markdownToSimpleHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let inList = false;

  for (const line of lines) {
    if (/^#\s+/.test(line)) {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
      html.push(`<h1>${escapeHtml(line.replace(/^#\s+/, ''))}</h1>`);
    } else if (/^##\s+/.test(line)) {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
      html.push(`<h2>${escapeHtml(line.replace(/^##\s+/, ''))}</h2>`);
    } else if (/^###\s+/.test(line)) {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
      html.push(`<h3>${escapeHtml(line.replace(/^###\s+/, ''))}</h3>`);
    } else if (/^-\s+/.test(line)) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${escapeHtml(line.replace(/^-\s+/, ''))}</li>`);
    } else if (line.trim() === '') {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
    } else {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
      html.push(`<p>${escapeHtml(line)}</p>`);
    }
  }

  if (inList) html.push('</ul>');

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>心理健康知识文档</title>
</head>
<body>
${html.join('\n')}
</body>
</html>
`;
}

if (!fs.existsSync(sourceDir)) {
  throw new Error(`Source directory not found: ${sourceDir}`);
}

cleanDir(txtOutDir);
cleanDir(htmlOutDir);

const files = walkMarkdownFiles(sourceDir);

for (const file of files) {
  const relative = path.relative(sourceDir, file);
  const parsed = path.parse(relative);
  const txtTargetDir = path.join(txtOutDir, parsed.dir);
  const htmlTargetDir = path.join(htmlOutDir, parsed.dir);
  ensureDir(txtTargetDir);
  ensureDir(htmlTargetDir);

  const markdown = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(path.join(txtTargetDir, `${parsed.name}.txt`), `\uFEFF${stripMarkdown(markdown)}`, 'utf8');
  fs.writeFileSync(path.join(htmlTargetDir, `${parsed.name}.html`), markdownToSimpleHtml(markdown), 'utf8');
}

console.log(`Converted ${files.length} markdown files to TXT: ${txtOutDir}`);
console.log(`Converted ${files.length} markdown files to HTML: ${htmlOutDir}`);
