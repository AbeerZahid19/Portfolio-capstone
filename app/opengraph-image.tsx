import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, rgb(13,13,51), rgb(115,64,191))",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Frontend Engineer
        </div>
        <div
          style={{
            fontSize: 92,
            fontWeight: 700,
            color: "white",
            textAlign: "center",
          }}
        >
          Abeer Zahid
        </div>
        <div
          style={{
            fontSize: 30,
            color: "rgba(255,255,255,0.85)",
            marginTop: 28,
            maxWidth: 800,
            textAlign: "center",
          }}
        >
          Clean, usable websites for small business owners
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          abeer-zahid.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}