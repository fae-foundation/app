import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Inter } from "next/font/google";
import "../globals.css";
import ClientLayout from "./ClientLayout";
import { routing } from "@/i18n/routing";

// Remove global force-dynamic - let pages decide their own rendering strategy

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "o-kitchen",
  description:
    "A modern web application for interacting with the Lens Protocol",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale}>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
