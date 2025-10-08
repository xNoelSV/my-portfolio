import { NextRequest } from "next/server";
import { siteMetadata } from "@/data/siteMetadata";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const hasTitle = searchParams.has("title");
    const postTitle = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "My Portfolio";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundColor: "#000000",
            backgroundImage: `url(${siteMetadata.siteUrl}/_static/content-og-card.png)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              marginLeft: 100,
              marginRight: 100,
              display: "flex",
              fontSize: 65,
              fontFamily: "roboto, -apple-system, sans-serif",
              fontStyle: "normal",
              fontWeight: 700,
              color: "white",
              whiteSpace: "pre-wrap",
            }}
          >
            {postTitle}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.log(errorMessage);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
