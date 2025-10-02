import "@/app/globals.css";
import Footer from "@/components/layouts/footer";
import Header from "@/components/layouts/header";
import ThemeProvider from "@/components/layouts/theme";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Toaster } from "sonner";

export const metadata = {
    title: {
        default: "Noel's portfolio",
        template: "%s | Noel's portfolio",
    },
    description: "Noel's portfolio website",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className="mx-auto min-h-screen max-w-3xl antialiased dark:bg-zinc-950 dark:text-gray-100"
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark" // default to dark mode, can be light, dark, system
                    enableSystem
                    disableTransitionOnChange
                >
                    <main className="mx-4  px-2 md:px-0 lg:mx-auto flex flex-col justify-between min-h-screen">
                        <Header />
                        {children}
                        <Footer />
                        <Toaster position="top-center" richColors />
                    </main>
                </ThemeProvider>
            </body>
        </html >
    );
}