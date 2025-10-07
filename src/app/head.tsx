/* import { GoogleAnalytics } from "@next/third-parties/google";
import { GoogleAdsense } from "@/components/google-adsense"; */

export default function Head() {
  return (
    <>
      <link rel="icon" type="image/png" href="/_static/favicons/favicon.png" />
      <link rel="manifest" href="/_static/favicons/site.webmanifest" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="#fff"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="#000"
      />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />

      {/* <meta
        name="google-adsense-account"
        content={`ca-pub-${ENV.ADSENSE_CLIENT_ID}`}
      /> */}
      {/* <GoogleAdsense pId={ENV.ADSENSE_CLIENT_ID} /> */}
    </>
  );
}
