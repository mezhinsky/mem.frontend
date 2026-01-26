/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";
import { common, createLowlight } from "lowlight";
import { toHtml } from "hast-util-to-html";

// Инициализация lowlight с популярными языками
const lowlight = createLowlight(common);

export function ArticleRenderer({ content }: { content: any }) {
  if (!content || content.type !== "doc") return null;

  return (
    <div className="prose prose-content dark:prose-invert max-w-none">
      {content.content?.map((node: any, i: number) => (
        <NodeRenderer key={i} node={node} />
      ))}
    </div>
  );
}

function getTextAlign(node: any): React.CSSProperties | undefined {
  const align = node.attrs?.textAlign;
  if (align && align !== "left") {
    return { textAlign: align };
  }
  return undefined;
}

function NodeRenderer({ node }: { node: any }) {
  if (!node) return null;

  switch (node.type) {
    case "paragraph": {
      const style = getTextAlign(node);
      return (
        <p style={style}>
          {node.content?.map((child: any, i: number) => (
            <NodeRenderer key={i} node={child} />
          ))}
        </p>
      );
    }

    case "heading": {
      const level: number = node.attrs?.level ?? 1;
      const style = getTextAlign(node);

      const children = node.content?.map((child: any, i: number) => (
        <NodeRenderer key={i} node={child} />
      ));

      switch (level) {
        case 1:
          return <h1 style={style}>{children}</h1>;
        case 2:
          return <h2 style={style}>{children}</h2>;
        case 3:
          return <h3 style={style}>{children}</h3>;
        case 4:
          return <h4 style={style}>{children}</h4>;
        case 5:
          return <h5 style={style}>{children}</h5>;
        case 6:
        default:
          return <h6 style={style}>{children}</h6>;
      }
    }

    case "bulletList":
      return (
        <ul>
          {node.content?.map((child: any, i: number) => (
            <NodeRenderer key={i} node={child} />
          ))}
        </ul>
      );

    case "orderedList":
      return (
        <ol>
          {node.content?.map((child: any, i: number) => (
            <NodeRenderer key={i} node={child} />
          ))}
        </ol>
      );

    case "listItem":
      return (
        <li>
          {node.content?.map((child: any, i: number) => (
            <NodeRenderer key={i} node={child} />
          ))}
        </li>
      );

    case "blockquote":
      return (
        <blockquote>
          {node.content?.map((child: any, i: number) => (
            <NodeRenderer key={i} node={child} />
          ))}
        </blockquote>
      );

    case "codeBlock": {
      const language = node.attrs?.language;
      const codeText = extractTextFromNode(node);

      // Подсветка синтаксиса только если язык указан явно
      let highlightedHtml: string;

      if (language && lowlight.registered(language)) {
        try {
          const tree = lowlight.highlight(language, codeText);
          highlightedHtml = toHtml(tree);
        } catch {
          highlightedHtml = escapeHtml(codeText);
        }
      } else {
        // Без подсветки — просто экранируем HTML
        highlightedHtml = escapeHtml(codeText);
      }

      return (
        <pre className="hljs">
          <code
            className={language ? `language-${language} hljs` : "hljs"}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      );
    }

    case "text": {
      let el: React.ReactNode = node.text ?? "";

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
            case "underline":
              el = <u>{el}</u>;
              break;
            case "subscript":
              el = <sub>{el}</sub>;
              break;
            case "superscript":
              el = <sup>{el}</sup>;
              break;
            case "highlight": {
              const color = mark.attrs?.color || "#ffff00";
              el = (
                <mark
                  style={{ backgroundColor: color }}
                  className="rounded px-0.5"
                >
                  {el}
                </mark>
              );
              break;
            }
            case "textStyle": {
              const textColor = mark.attrs?.color;
              if (textColor) {
                el = <span style={{ color: textColor }}>{el}</span>;
              }
              break;
            }
            case "link":
              el = (
                <a
                  href={mark.attrs.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
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

    case "image": {
      const src = node.attrs?.src;
      if (!src) return null;

      return (
        <Image
          src={src}
          width={800}
          height={600}
          alt={node.attrs?.alt || ""}
          title={node.attrs?.title || ""}
          unoptimized
          loading="lazy"
          decoding="async"
          className="rounded-lg my-4 max-w-full mx-auto h-auto"
        />
      );
    }

    case "youtube": {
      const src = node.attrs?.src;
      if (!src) return null;

      const videoId = extractYoutubeId(src);
      if (!videoId) return null;

      return (
        <div className="relative w-full aspect-video my-6 rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      );
    }

    case "paintTag":
      return (
        <PaintTag
          brand={node.attrs.brand}
          code={node.attrs.code}
          color={node.attrs.color}
        />
      );

    case "horizontalRule":
      return <hr className="my-8" />;

    case "hardBreak":
      return <br />;

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

// Извлечение текста из узла codeBlock
function extractTextFromNode(node: any): string {
  if (!node.content) return "";
  return node.content
    .map((child: any) => {
      if (child.type === "text") return child.text ?? "";
      return extractTextFromNode(child);
    })
    .join("");
}

// Экранирование HTML для fallback
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

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
      {brand} <b>{code}</b>
    </span>
  );
}
