import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Minh AI Academy — AI Ứng Dụng Thực Chiến",
    template: "%s — Minh AI Academy",
  },
  description:
    "Nền tảng đào tạo AI ứng dụng thực chiến #1 Việt Nam. Học tạo ảnh AI, video AI viral, xây thương hiệu cá nhân và kiếm tiền online với AI.",
  keywords: [
    "Minh AI Academy",
    "AI",
    "Khóa học AI",
    "Video AI",
    "Thương hiệu cá nhân",
    "Midjourney",
    "ChatGPT",
  ],
  metadataBase: new URL("https://minhai.academy"),
  openGraph: {
    title: "Minh AI Academy — AI dễ lắm, để Minh chỉ cho",
    description:
      "Học AI ứng dụng thực chiến: tạo ảnh, video viral, xây thương hiệu cá nhân.",
    siteName: "Minh AI Academy",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minh AI Academy — AI dễ lắm, để Minh chỉ cho",
    description:
      "Học AI ứng dụng thực chiến: tạo ảnh, video viral, xây thương hiệu cá nhân.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="antialiased min-h-screen">
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
