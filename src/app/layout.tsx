import "./global.css";
import Footer from "@/components/layouts/footer";
import Header from "@/components/layouts/header";
import ThemeProvider from "@/components/theme";
import { cn } from "@/lib/utils";
import { Roboto_Flex } from "next/font/google";
import { Toaster } from "sonner";
import { TailwindIndicator } from "./tailwind-indicator";

export const metadata = {
  title: {
    default: "Noel's portfolio",
    template: "%s | Noel's portfolio",
  },
  description: "Noel's portfolio website",
};

const space_grotesk = Roboto_Flex({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

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
          space_grotesk.className
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
