import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import HeaderSec from "./components/HeaderSec";
import Footer from "./components/Footer"; 

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
  title: "TECHREHUB",
  description: "electronics repair,smartphone repair,computer repair,industrial repair, console repair, tv repair,Harare, tech solutions, corporate electronics, consumer devices, industrial solutions, door-to-door service, home service, on-site service, remote service, mobile repair, laptop repair, tablet repair, smartphone repair, computer repair, industrial repair, console repair, tv repair, Harare, Zimbabwe, expert technicians, quality service, customer satisfaction, affordable prices, quick turnaround, flexible scheduling, expert advice, reliable repairs, warranty options",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     
     
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        
      >
        <HeaderSec/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
