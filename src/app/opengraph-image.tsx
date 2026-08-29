import { ImageResponse } from "next/og";

export const alt = "Nicolas Gerardo Chagas Lara — Estagiário / Analista de Dados";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #05080f 0%, #0a101e 55%, #101c33 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              width: 16,
              height: 140,
              background: "linear-gradient(180deg, #22d3ee, #34d399)",
              borderRadius: 10,
              display: "flex",
            }}
          />
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.15 }}>
            Nicolas Gerardo
            <br />
            Chagas Lara
          </div>
        </div>
        <div style={{ marginTop: 36, fontSize: 34, color: "#22d3ee" }}>
          Estagiário / Analista de Dados · SQL · Python · IA · BI
        </div>
        <div style={{ marginTop: 16, fontSize: 26, color: "#94a3b8" }}>
          Itabaiana, SE — Portfólio Profissional
        </div>
      </div>
    ),
    size
  );
}
