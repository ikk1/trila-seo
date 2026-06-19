import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import Anthropic from '@anthropic-ai/sdk';
import { GUIDE_TOPICS } from '@/lib/guides-taxonomy';
import { VERTICALS } from '@/lib/verticals';
import { buildGroundingData } from './guide-grounding';
import { buildGuidePrompt, parseGuideOutput } from './guide-prompt';

const MODEL = 'claude-sonnet-4-6';
const CONTENT_DIR = path.join(process.cwd(), 'content', 'guias');

function parseArgs() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const onlyVertical = args.find((a) => a.startsWith('--vertical='))?.split('=')[1];
  const onlyTopic = args.find((a) => a.startsWith('--topic='))?.split('=')[1];
  return { force, onlyVertical, onlyTopic };
}

async function main() {
  const { force, onlyVertical, onlyTopic } = parseArgs();
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Defina ANTHROPIC_API_KEY.');
    process.exit(1);
  }
  const client = new Anthropic();

  const verticais = VERTICALS.filter((v) => !onlyVertical || v.slug === onlyVertical);
  const topics = GUIDE_TOPICS.filter((t) => !onlyTopic || t.slug === onlyTopic);

  let ok = 0;
  let skip = 0;
  let fail = 0;

  for (const v of verticais) {
    const grounding = await buildGroundingData(v.slug);
    if (!grounding.grounded) console.warn(`[grounding] ${v.slug}: usando fallback (sem dado real).`);
    for (const t of topics) {
      const dir = path.join(CONTENT_DIR, v.slug);
      const file = path.join(dir, `${t.slug}.md`);
      if (fs.existsSync(file) && !force) {
        skip++;
        continue;
      }
      try {
        const prompt = buildGuidePrompt({ verticalSlug: v.slug, topicSlug: t.slug, grounding });
        const resp = await client.messages.create({
          model: MODEL,
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
        });
        const text = resp.content
          .filter((b): b is Anthropic.TextBlock => b.type === 'text')
          .map((b) => b.text)
          .join('');
        const { frontmatter, body } = parseGuideOutput(text); // valida; lança se inválido
        const fileContent = matter.stringify(body, frontmatter); // emite ---\n<frontmatter>\n---\n<body>
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(file, fileContent, 'utf8');
        console.log(`[ok] ${v.slug}/${t.slug}`);
        ok++;
      } catch (err) {
        console.error(`[fail] ${v.slug}/${t.slug}: ${(err as Error).message}`);
        fail++;
      }
    }
  }
  console.log(`\nGerados: ${ok} | pulados: ${skip} | falhas: ${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
