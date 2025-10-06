import { siteMetadata } from "@/data/siteMetadata";
import { Metadata } from "next";

interface OwnProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
}

export function generatePageMetadata({
  title,
  description,
  image,
  canonical,
  ...rest
}: OwnProps): Metadata {
  return {
    title,
    alternates: {
      canonical: `${siteMetadata.siteUrl}/${canonical || ""}`.replace(
        /\/+$/,
        ""
      ),
    },
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: "./",
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: "es_ES",
      type: "website",
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: "summary_large_image",
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    ...rest,
  };
}
