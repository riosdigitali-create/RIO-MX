import type { Metadata } from 'next';
import { Anton, Manrope } from 'next/font/google';
import './globals.css';

const sans = Manrope({ variable: '--font-sans', subsets: ['latin'] });
const display = Anton({
  variable: '--font-display',
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.PUBLIC_SITE_URL || 'https://rio-mx.isma-rhisma94.chatgpt.site',
  ),
  title: 'RÍO MX · Ven como eres',
  description:
    'Una iglesia para encontrar a Jesús, hacer familia y caminar con propósito en Ciudad de México.',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    title: 'RÍO MX · Ven como eres',
    description:
      'Todo lo que entre al río vivirá. Encuentros, grupos y próximos pasos en RÍO MX.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'RÍO MX · Ven como eres',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RÍO MX · Ven como eres',
    description: 'Todo lo que entre al río vivirá.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${sans.variable} ${display.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
