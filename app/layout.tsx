import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'LangSpot — Your language learning studio', template: '%s · LangSpot' },
  description: 'A local-first learning studio for ten languages, with structured roadmaps, vocabulary, grammar, pronunciation and offline progress.',
  applicationName: 'LangSpot', manifest: './manifest.webmanifest',
  appleWebApp: { capable: true, title: 'LangSpot', statusBarStyle: 'default' },
};
export const viewport: Viewport = { themeColor: '#173d35', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en"><body>{children}<script dangerouslySetInnerHTML={{__html:`if('serviceWorker' in navigator && location.protocol.startsWith('http')){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}`}} /></body></html>;
}
