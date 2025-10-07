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
      : searchParams.has("type") && searchParams.get("type") === "projects"
      ? "Projects"
      : searchParams.has("type") && searchParams.get("type") === "blog"
      ? "Blog"
      : "My Portfolio";

    const fontData = await fetch(
      "https://fonts.gstatic.com/s/googlesansflex/v5/t5s6IQcYNIWbFgDgAAzZ34auoVyXkJCOvp3SFWJbN5hF8Ju1x5tKByN2l9sI40swNJwakXdYAZzz0jbnJ4qFQO5tGjLvDSkV4DyKMo6qQzwliVdHySgxyRg2.woff2"
    ).then((res) => res.arrayBuffer());

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
            color: "white",
            backgroundImage: `url(${siteMetadata.siteUrl}/_static/content-og-card.png)`,
          }}
        >
          <div
            style={{
              marginLeft: 100,
              marginRight: 100,
              display: "flex",
              fontSize: 65,
              fontFamily: "Inter",
              fontStyle: "normal",
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
        fonts: [
          {
            name: "Inter",
            data: fontData,
            style: "normal",
            weight: 400,
          },
        ],
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
