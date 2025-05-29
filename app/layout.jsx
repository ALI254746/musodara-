// app/layout.jsx
import "./globals.css";
import { Oswald } from "next/font/google";
import Providers from "./providers";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
export const metadata = {
  title: "Your App",
  description: "Description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={oswald.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
