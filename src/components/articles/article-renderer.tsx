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
          className="rounded-lg max-w-full mx-auto h-auto"
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

    case "cloudStorageLink":
      return (
        <CloudStorageLink
          url={node.attrs.url}
          provider={node.attrs.provider}
          title={node.attrs.title}
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

type CloudStorageProvider =
  | "google-drive"
  | "icloud"
  | "dropbox"
  | "onedrive"
  | "box"
  | "yandex-disk"
  | "mega"
  | "unknown";

const CLOUD_STORAGE_LABELS: Record<CloudStorageProvider, string> = {
  "google-drive": "Google Drive",
  icloud: "iCloud",
  dropbox: "Dropbox",
  onedrive: "OneDrive",
  box: "Box",
  "yandex-disk": "Яндекс Диск",
  mega: "MEGA",
  unknown: "Файл",
};

function CloudStorageLink({
  url,
  provider,
  title,
}: {
  url: string;
  provider: CloudStorageProvider;
  title?: string;
}) {
  const displayTitle = title || CLOUD_STORAGE_LABELS[provider] || "Файл";
  const providerLabel = CLOUD_STORAGE_LABELS[provider] || "Облачное хранилище";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose flex items-center gap-3 p-4 my-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer no-underline"
      style={{ textDecoration: "none" }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center">
        <CloudStorageIcon provider={provider} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-900 dark:text-slate-100 truncate" style={{ textDecoration: "none" }}>
          {displayTitle}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {providerLabel}
        </div>
      </div>
      <div className="flex-shrink-0 text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </div>
    </a>
  );
}

function CloudStorageIcon({ provider }: { provider: CloudStorageProvider }) {
  switch (provider) {
    case "google-drive":
      return (
        <svg className="w-6 h-6" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
          <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
          <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
          <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
          <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
          <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
          <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
        </svg>
      );
    case "icloud":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#3693F3" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
        </svg>
      );
    case "dropbox":
      return (
        <svg className="w-6 h-6" viewBox="0 0 528 512" fill="#0061FF" xmlns="http://www.w3.org/2000/svg">
          <path d="M264.4 116.3l-132 84.3 132 84.3-132 84.3L0 284.1l132.3-84.3L0 116.3 132.3 32l132.1 84.3zM131.6 395.7l132-84.3 132 84.3-132 84.3-132-84.3zm132.8-111.6l132-84.3-132-83.6L395.7 32 528 116.3l-132.3 84.3L528 284.8l-132.3 84.3-131.3-85z"/>
        </svg>
      );
    case "onedrive":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#0364B8" d="M14.5 15h5.25a3.25 3.25 0 0 0 .647-6.438A5.5 5.5 0 0 0 10.022 6.2 4.5 4.5 0 0 0 4.5 12.5c0 .17.01.34.028.504A3.5 3.5 0 0 0 8 18h6.5v-3z"/>
          <path fill="#0078D4" d="M9.5 15.5a3.5 3.5 0 0 1 3.5-3.5h6.75a3.214 3.214 0 0 0-.23-1.438A5.5 5.5 0 0 0 10.023 6.2a4.5 4.5 0 0 0-5.494 6.304A3.5 3.5 0 0 0 8 18h1.5v-2.5z"/>
          <path fill="#1490DF" d="M13 12a3.5 3.5 0 0 0-3.5 3.5V18H8a3.5 3.5 0 0 1-3.472-3.996A4.5 4.5 0 0 1 10.022 6.2a5.5 5.5 0 0 1 9.497 4.362A3.251 3.251 0 0 1 19.75 15H13v-3z"/>
          <path fill="#28A8EA" d="M19.75 15H13a3.5 3.5 0 0 0 0 7h6.75a3.25 3.25 0 0 0 0-6.5v-.5z"/>
        </svg>
      );
    case "box":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0061D5" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 5A2.5 2.5 0 0 1 5 2.5h14A2.5 2.5 0 0 1 21.5 5v14a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 19V5zm5.5 4a2.5 2.5 0 0 0 0 5h2.5a2.5 2.5 0 0 0 0-5H8zm5.5 0a2.5 2.5 0 0 0 0 5H16a2.5 2.5 0 0 0 0-5h-2.5z"/>
        </svg>
      );
    case "yandex-disk":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#FFCC00"/>
          <circle cx="12" cy="12" r="5" fill="#FF0000"/>
        </svg>
      );
    case "mega":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#D9272E" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l7.09 3.54L12 11.27 4.91 7.72 12 4.18zM4 8.82l7 3.5v7.36l-7-3.5V8.82zm16 7.36l-7 3.5v-7.36l7-3.5v7.36z"/>
        </svg>
      );
    default:
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      );
  }
}
