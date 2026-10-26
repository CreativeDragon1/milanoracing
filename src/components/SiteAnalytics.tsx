import { Analytics, type BeforeSendEvent } from '@vercel/analytics/react';
import { useLocation } from 'react-router-dom';
import { posts } from '../content';

const publicPaths = new Set([
  '/', '/evolution', '/team', '/journal', '/partners',
  ...posts.map((post) => `/journal/${post.id}`),
]);

export function filterPageview(event: BeforeSendEvent): BeforeSendEvent | null {
  const url = new URL(event.url);
  if (event.type !== 'pageview' || !publicPaths.has(url.pathname)) return null;
  // Personalisation and arbitrary query/hash values never belong in analytics.
  url.search = '';
  url.hash = '';
  return { ...event, url: url.href };
}

export default function SiteAnalytics() {
  const { pathname } = useLocation();
  const localHost = /^(localhost|127(?:\.\d+){3}|\[::1\])$/.test(location.hostname);
  if (!import.meta.env.PROD || import.meta.env.MODE === 'private-game' ||
      window.__MILANO_OFFLINE__ || location.protocol !== 'https:' || localHost) return null;

  // Explicit routes count SPA navigation once, without counting anchor changes.
  const path = publicPaths.has(pathname) ? pathname : null;
  return <Analytics mode="production" debug={false} route={path} path={path} beforeSend={filterPageview} />;
}
