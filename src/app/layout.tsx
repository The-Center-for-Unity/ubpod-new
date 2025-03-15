import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const clash = localFont({
  src: [
    {
      path: '../fonts/ClashDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/ClashDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/ClashDisplay-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/ClashDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-clash',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${clash.variable}`}>
      <body>{children}</body>
    </html>
  );
} 