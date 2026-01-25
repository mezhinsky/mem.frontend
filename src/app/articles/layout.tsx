import { ArticlesNav } from "@/components/articles/articles-nav";

export default function ArticlesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ArticlesNav />
      <div className="mt-4">{children}</div>
    </>
  );
}
