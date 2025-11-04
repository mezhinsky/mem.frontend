import { notFound } from "next/navigation";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`${process.env.API_URL}/articles/${id}`, {
    // SSR-friendly (revalidate once in a while)
    next: { revalidate: 60 },
  });

  if (!res.ok) notFound();
  const article = await res.json();

  // Конвертируем Tiptap JSON → HTML
  const html = generateHTML(article.content, [StarterKit]);

  return (
    <article className="prose prose-lg mx-auto py-12">
      <h1 className="mb-2">{article.title}</h1>
      {article.description && (
        <p className="text-gray-500 text-lg mb-6">{article.description}</p>
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
