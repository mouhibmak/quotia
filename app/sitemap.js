export default function sitemap() {
  const base = 'https://quotia-mouhib2.vercel.app';
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/quote`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/receipt`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
