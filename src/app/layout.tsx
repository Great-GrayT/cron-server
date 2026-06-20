import type { ReactNode } from "react";

export const metadata = {
  title: "RSS Cron Service",
  description: "Resilient RSS.com monitoring cron service",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
