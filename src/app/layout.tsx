import "./global.css";
import Footer from "@/components/layouts/footer";
import Header from "@/components/layouts/header";
import { ThemeProvider } from "@/components/theme";
import { cn } from "@/lib/utils";
import { Roboto_Flex } from "next/font/google";
import { Toaster } from "sonner";
import { TailwindIndicator } from "./tailwind-indicator";
import { Metadata } from "next";
import { siteMetadata } from "@/data/siteMetadata";

const roboto_flex = Roboto_Flex({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-flex",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: "./",
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: "es_ES",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: "summary_large_image",
    images: [siteMetadata.socialBanner],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `mx-auto min-h-screen max-w-3xl antialiased 
          text-black 
           dark:bg-zinc-950 dark:text-gray-100`,
          roboto_flex.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // default to dark mode, can be light, dark, system
          enableSystem
          disableTransitionOnChange
        >
          <main className="mx-4 px-2 md:px-0 lg:mx-auto flex flex-col justify-between min-h-screen">
            <Header />
            {children}
            <Footer />
            <Toaster position="bottom-center" richColors />
          </main>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
