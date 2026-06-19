// lib/guides.ts
// Camada de leitura dos guias em Markdown. Lê content/guias/<vertical>/<topico>.md
// via fs em build time (estático — sem DB). gray-matter separa frontmatter/corpo.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type GuideFrontmatter = {
  title: string;
  description: string;
  vertical: string;
  topic: string;
  updatedAt: string;
  keyTakeaways: string[];
  faq: Array<{ q: string; answer: string }>;
};

export type Guide = {
  frontmatter: GuideFrontmatter;
  body: string;
  vertical: string;
  topic: string;
};

export const GUIDES_DIR = path.join(process.cwd(), 'content', 'guias');

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

export function validateFrontmatter(raw: unknown): GuideFrontmatter {
  const f = raw as Record<string, unknown>;
  // gray-matter parses bare YAML dates as Date objects; normalize to ISO string
  if (f?.updatedAt instanceof Date) {
    f.updatedAt = (f.updatedAt as Date).toISOString().slice(0, 10);
  }
  const strFields = ['title', 'description', 'vertical', 'topic', 'updatedAt'] as const;
  for (const k of strFields) {
    if (typeof f?.[k] !== 'string' || (f[k] as string).trim() === '') {
      throw new Error(`Frontmatter inválido: campo "${k}" ausente ou não-string`);
    }
  }
  if (!isStringArray(f.keyTakeaways) || f.keyTakeaways.length === 0) {
    throw new Error('Frontmatter inválido: "keyTakeaways" deve ser lista de strings não-vazia');
  }
  if (
    !Array.isArray(f.faq) ||
    f.faq.length === 0 ||
    !f.faq.every(
      (item) =>
        item && typeof (item as any).q === 'string' && typeof (item as any).answer === 'string',
    )
  ) {
    throw new Error('Frontmatter inválido: "faq" deve ser lista de { q, answer }');
  }
  return {
    title: f.title as string,
    description: f.description as string,
    vertical: f.vertical as string,
    topic: f.topic as string,
    updatedAt: f.updatedAt as string,
    keyTakeaways: f.keyTakeaways as string[],
    faq: f.faq as Array<{ q: string; answer: string }>,
  };
}

function readGuideFile(filePath: string, vertical: string, topic: string): Guide {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const frontmatter = validateFrontmatter(parsed.data);
  return { frontmatter, body: parsed.content.trim(), vertical, topic };
}

export function listGuides(dir: string = GUIDES_DIR): Guide[] {
  if (!fs.existsSync(dir)) return [];
  const guides: Guide[] = [];
  for (const vertical of fs.readdirSync(dir)) {
    const vdir = path.join(dir, vertical);
    if (!fs.statSync(vdir).isDirectory()) continue;
    for (const file of fs.readdirSync(vdir)) {
      if (!file.endsWith('.md')) continue;
      const topic = file.replace(/\.md$/, '');
      guides.push(readGuideFile(path.join(vdir, file), vertical, topic));
    }
  }
  return guides;
}

export function getGuide(vertical: string, topic: string, dir: string = GUIDES_DIR): Guide | null {
  const filePath = path.join(dir, vertical, `${topic}.md`);
  if (!fs.existsSync(filePath)) return null;
  return readGuideFile(filePath, vertical, topic);
}

export function listGuidesByVertical(vertical: string, dir: string = GUIDES_DIR): Guide[] {
  return listGuides(dir).filter((g) => g.vertical === vertical);
}
