import Providers from "@/components/providers/main.providers";
import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "e-Dukado LMS",
  description: "Learning Management System for SRES Central I",
  icons: ["./favicon.ico", "./favicon_io/apple-touch-icon.png"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={nunito.className}>
      <body className='bg-background text-foreground'>
        <Providers>
          <main className=''>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
