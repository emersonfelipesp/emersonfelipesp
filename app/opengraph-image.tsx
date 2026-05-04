import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const tags = ["netbox-proxbox", "netbox-sdk", "proxmox-sdk", "open source"];

  return new ImageResponse(
    <div
      style={{
        background: "#07101a",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 80px",
        fontFamily: "monospace",
        border: "2px solid #00f2d4",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", color: "#64748b", fontSize: 18, marginBottom: 24 }}>
        emersonfelipesp@netdevops:~$
      </div>
      <div
        style={{
          display: "flex",
          color: "#00f2d4",
          fontSize: 64,
          fontWeight: "bold",
          lineHeight: 1.1,
          marginBottom: 20,
        }}
      >
        Emerson Felipe
      </div>
      <div style={{ display: "flex", color: "#94a3b8", fontSize: 28, marginBottom: 48 }}>
        Software Developer · Network Automation Engineer
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {tags.map((tag) => (
          <div
            key={tag}
            style={{
              display: "flex",
              border: "1px solid #00f2d4",
              color: "#00f2d4",
              padding: "4px 14px",
              fontSize: 18,
            }}
          >
            [{tag}]
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: 40,
          right: 80,
          color: "#475569",
          fontSize: 16,
        }}
      >
        emersonfelipesp.com
      </div>
    </div>,
    { ...size },
  );
}
