import type { Metadata } from "next";

const SITE_URL = "https://hariprashad-ravikumar.github.io";
const OG_IMAGE = `${SITE_URL}/og/card.png`;

/**
 * One helper so every page's title/description also produces correct
 * OpenGraph/Twitter fields with an absolute og:image — the live site's
 * og:image was a relative path, which silently breaks link previews (§11).
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ? `${SITE_URL}${image}` : OG_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Hariprashad Ravikumar",
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export { SITE_URL, OG_IMAGE };
