import React from "react";

export default function ArticleRenderer({ content }: { content: any }) {
  if (!content || content.type !== "doc") return null;

  return (
    <div className="prose">
      {content.content.map((node: any, i: number) => (
        <NodeRenderer key={i} node={node} />
      ))}
    </div>
  );
}

function NodeRenderer({ node }: { node: any }) {
  switch (node.type) {
    case "paragraph":
      return (
        <p>
          {node.content?.map((child: any, i: number) => (
            <NodeRenderer key={i} node={child} />
          ))}
        </p>
      );

    case "text":
      return <>{node.text}</>;

    case "paintTag":
      return (
        <PaintTag
          brand={node.attrs.brand}
          code={node.attrs.code}
          color={node.attrs.color}
        />
      );

    case "image":
      return <img src={node.attrs.src} alt="" className="rounded-lg my-4" />;

    default:
      return null;
  }
}

// 🎨 кастомный компонент для красок
function PaintTag({
  brand,
  code,
  color,
}: {
  brand: string;
  code: string;
  color: string;
}) {
  return (
    <span
      className="inline-flex items-center rounded-md border px-2 py-0.5 text-sm"
      style={{ background: color }}
    >
      🎨 {brand} <b>{code}</b>
    </span>
  );
}
