import type { Metadata, Viewport } from 'next';
import './globals.css';
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'langspot-learning-studio';
const publicPrefix = process.env.GITHUB_ACTIONS === 'true' ? `/${repository}` : '';
export const metadata: Metadata = {
  title: { default: 'LangSpot — Your language learning studio', template: '%s · LangSpot' },
  description: 'A local-first learning studio for ten languages, with structured roadmaps, vocabulary, grammar, pronunciation and offline progress.',
  applicationName: 'LangSpot', manifest: `${publicPrefix}/manifest.webmanifest`,
  icons: { icon: [{ url: `${publicPrefix}/icons/icon-192.svg`, type: 'image/svg+xml' }, { url: `${publicPrefix}/icons/icon-192.png`, sizes: '192x192', type: 'image/png' }], apple: [{ url: `${publicPrefix}/icons/icon-192.png`, sizes: '192x192', type: 'image/png' }] },
  appleWebApp: { capable: true, title: 'LangSpot', statusBarStyle: 'default' },
};
export const viewport: Viewport = { themeColor: '#173d35', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 const registerScript = `if ('serviceWorker' in navigator && location.protocol.startsWith('http')) { window.addEventListener('load', () => { const link = document.querySelector('link[rel="manifest"]'); if (link) { const worker = new URL('sw.js', new URL(link.href, location.href)); navigator.serviceWorker.register(worker.pathname).catch(() => {}); } }); }`;
 return <html lang="en"><body>{children}<script dangerouslySetInnerHTML={{ __html: registerScript }} /></body></html>;
}
