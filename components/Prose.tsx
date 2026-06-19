import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Renderiza Markdown de guia com tipografia consistente (Tailwind typography).
export function Prose({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-neutral max-w-none prose-headings:text-text-main prose-p:text-text-muted prose-li:text-text-muted prose-a:text-primary">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
