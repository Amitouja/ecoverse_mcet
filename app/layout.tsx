import type { Metadata } from 'next';
import { Playfair_Display, Jost, Space_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/app/context/AuthContext';
import { Navbar } from '@/app/components/Navbar';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
});

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'EcoVerse — Conscious Fashion',
  description:
    'Shop eco-conscious clothing, earn Eco Points on every sustainable purchase, and unlock rewards.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${jost.variable} ${spaceMono.variable} antialiased bg-[#f5f2eb] text-[#1a1a1a] font-jost overflow-x-hidden`}
      >
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}