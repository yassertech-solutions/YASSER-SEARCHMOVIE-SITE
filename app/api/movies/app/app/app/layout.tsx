
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YASSER MOVIE SITE",
  description:
    "Discover movies, TV series, posters and official trailers. Powered by Yasser Tech Solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
