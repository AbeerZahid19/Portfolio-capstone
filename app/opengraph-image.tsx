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
          background: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, color: "black" }}>
          Abeer Zahid
        </div>
        <div style={{ fontSize: 32, color: "#666", marginTop: 20 }}>
          Frontend Engineer
        </div>
      </div>
    ),
    { ...size }
  );
}