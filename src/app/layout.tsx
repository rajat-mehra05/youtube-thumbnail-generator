import type { Metadata } from 'next';
import { spaceGrotesk, jetbrainsMono, inter, montserrat, poppins, roboto, openSans, oswald, bebasNeue, anton, bangers } from '@/lib/fonts';
import './globals.css';
import { Providers } from '@/components/providers';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} - AI YouTube Thumbnail Generator`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'YouTube thumbnail',
    'AI thumbnail generator',
    'thumbnail maker',
    'YouTube',
    'content creator',
    'video thumbnail',
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: APP_NAME,
    title: `${APP_NAME} - AI YouTube Thumbnail Generator`,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} - AI YouTube Thumbnail Generator`,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} ${montserrat.variable} ${poppins.variable} ${roboto.variable} ${openSans.variable} ${oswald.variable} ${bebasNeue.variable} ${anton.variable} ${bangers.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
