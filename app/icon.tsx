import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#D21F2E",
          borderRadius: 14,
          color: "white",
          fontSize: 32,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        PG
      </div>
    ),
    size
  );
}
