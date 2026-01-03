export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="test py-10">
      <div className="container-wrapper 3xl:fixed:px-0 px-6">{children}</div>
    </div>
  );
}
