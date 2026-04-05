import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "WachAI Terminal",
  description: "Create, sign, verify, and exchange WachAI Mandates",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      style={{ backgroundColor: "#0E0E0E", colorScheme: "dark" }}
    >
      <body style={{ backgroundColor: "#0E0E0E", color: "#fff", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
