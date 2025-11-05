import React from "react";

export default function ArticleRenderer({ content }: { content: any }) {
  if (!content || content.type !== "doc") return null;

  return (
    <div className="prose max-w-none">
      {content.content.map((node: any, i: number) => (
        <NodeRenderer key={i} node={node} />
      ))}
    </div>
  );
}

function NodeRenderer({ node }: { node: any }) {
  if (!node) return null;

  switch (node.type) {
    // 📝 Абзац
    case "paragraph":
      return (
        <p>
          {node.content?.map((child: any, i: number) => (
            <NodeRenderer key={i} node={child} />
          ))}
        </p>
      );

    // 🔠 Заголовки (h1-h6)
    case "heading":
      const Tag = `h${node.attrs?.level || 1}` as keyof JSX.IntrinsicElements;
      return (
        <Tag>
          {node.content?.map((child: any, i: number) => (
            <NodeRenderer key={i} node={child} />
          ))}
        </Tag>
      );

    // 📋 Маркированный список
    case "bulletList":
      return (
        <ul className="list-disc list-inside">
          {node.content?.map((child: any, i: number) => (
            <NodeRenderer key={i} node={child} />
          ))}
        </ul>
      );

    // 🔢 Нумерованный список
    case "orderedList":
      return (
        <ol className="list-decimal list-inside">
          {node.content?.map((child: any, i: number) => (
            <NodeRenderer key={i} node={child} />
          ))}
        </ol>
      );

    // 🔹 Элемент списка
    case "listItem":
      return (
        <li>
          {node.content?.map((child: any, i: number) => (
            <NodeRenderer key={i} node={child} />
          ))}
        </li>
      );

    // 💬 Цитата
    case "blockquote":
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic">
          {node.content?.map((child: any, i: number) => (
            <NodeRenderer key={i} node={child} />
          ))}
        </blockquote>
      );

    // 💻 Блок кода
    case "codeBlock":
      return (
        <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-sm">
          <code>
            {node.content?.map((child: any, i: number) => (
              <NodeRenderer key={i} node={child} />
            ))}
          </code>
        </pre>
      );

    // 🔤 Текст + marks (bold, italic, link...)
    case "text": {
      let el: React.ReactNode = node.text;

      if (node.marks) {
        node.marks.forEach((mark: any) => {
          switch (mark.type) {
            case "bold":
              el = <strong>{el}</strong>;
              break;
            case "italic":
              el = <em>{el}</em>;
              break;
            case "strike":
              el = <s>{el}</s>;
              break;
            case "code":
              el = <code>{el}</code>;
              break;
            case "link":
              el = (
                <a
                  href={mark.attrs.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {el}
                </a>
              );
              break;
          }
        });
      }

      return el;
    }

    // 🖼 Изображение
    case "image":
      return (
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          className="rounded-lg my-4"
        />
      );

    // 🎨 Кастомный блок PaintTag
    case "paintTag":
      return (
        <PaintTag
          brand={node.attrs.brand}
          code={node.attrs.code}
          color={node.attrs.color}
        />
      );

    // 🚫 fallback
    default:
      return (
        <>
          {node.content?.map((child: any, i: number) => (
            <NodeRenderer key={i} node={child} />
          ))}
        </>
      );
  }
}

// 🎨 Кастомный компонент
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
      style={{
        background: color,
        color: "#111",
      }}
    >
      🎨 {brand} <b>{code}</b>
    </span>
  );
}
