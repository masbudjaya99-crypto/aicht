import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";
import { getPublicConfig } from "@/lib/data";

const syne = Syne({ subsets: ["latin"], variable: "--font-display" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Fliqué - Real connections, real conversations",
  description: "Browse profiles and start AI-powered conversations instantly."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getPublicConfig();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} theme-vars`}>
        <div className="ambient" />
        {config.ga4_enabled && config.ga4_measurement_id ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${config.ga4_measurement_id}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${config.ga4_measurement_id}');
            `}</Script>
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
