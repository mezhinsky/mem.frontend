/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";

export function ArticleRenderer({ content }: { content: any }) {
  if (!content || content.type !== "doc") return null;

  return (
    <div className="prose prose-content dark:prose-invert max-w-none ">
      {content.content?.map((node: any, i: number) => (
        <NodeRenderer key={i} node={node} />
      ))}
    </div>
  );
}

function NodeRenderer({ node }: { node: any }) {
  if (!node) return null;

  switch (node.type) {
    case "paragraph":
      return (
        <p>
          {node.content?.map((child: any, i: number) => (
            <NodeRenderer key={i} node={child} />
          ))}
        </p>
      );

    case "heading": {
      const level: number = node.attrs?.level ?? 1;

      const children = node.content?.map((child: any, i: number) => (
        <NodeRenderer key={i} node={child} />
      ));

      switch (level) {
        case 1:
          return <h1>{children}</h1>;
        case 2:
          return <h2>{children}</h2>;
        case 3:
          return <h3>{children}</h3>;
        case 4:
          return <h4>{children}</h4>;
        case 5:
          return <h5>{children}</h5>;
        case 6:
        default:
          return <h6>{children}</h6>;
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

    case "codeBlock":
      return (
        <pre>
          <code>
            {node.content?.map((child: any, i: number) => (
              <NodeRenderer key={i} node={child} />
            ))}
          </code>
        </pre>
      );

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
          width={500}
          height={500}
          alt={node.attrs?.alt || ""}
          title={node.attrs?.title || ""}
          unoptimized
          loading="lazy"
          decoding="async"
          className="rounded-lg my-4 max-w-full mx-auto h-auto"
        />
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
      return <hr />;

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
