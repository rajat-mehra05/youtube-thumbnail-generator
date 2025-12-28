import { Space_Grotesk, JetBrains_Mono, Inter, Montserrat, Poppins, Roboto, Open_Sans, Oswald, Bebas_Neue, Anton, Bangers } from 'next/font/google';

// UI fonts
export const spaceGrotesk = Space_Grotesk({
    variable: '--font-sans',
    subsets: ['latin'],
    display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
    variable: '--font-mono',
    subsets: ['latin'],
    display: 'swap',
});

// Template fonts used in the editor
export const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '600', '700'],
});

export const montserrat = Montserrat({
    variable: '--font-montserrat',
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '600', '700'],
});

export const poppins = Poppins({
    variable: '--font-poppins',
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '600', '700'],
});

export const roboto = Roboto({
    variable: '--font-roboto',
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '700'],
});

export const openSans = Open_Sans({
    variable: '--font-open-sans',
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '600', '700'],
});

export const oswald = Oswald({
    variable: '--font-oswald',
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '600', '700'],
});

export const bebasNeue = Bebas_Neue({
    variable: '--font-bebas-neue',
    subsets: ['latin'],
    display: 'swap',
    weight: '400',
});

export const anton = Anton({
    variable: '--font-anton',
    subsets: ['latin'],
    display: 'swap',
    weight: '400',
});

export const bangers = Bangers({
    variable: '--font-bangers',
    subsets: ['latin'],
    display: 'swap',
    weight: '400',
});
