"use client";

import background from "../assests/img/anh4.png";
import { useSearchParams } from "next/navigation";

const TABLE_POS = {
  BGD: { x: 200, y: 820, r: 90 },
  KM:  { x: 450, y: 820, r: 90 },
  QL:  { x: 700, y: 820, r: 90 },
  NV1: { x: 300, y: 1000, r: 100 },
  NV2: { x: 500, y: 1000, r: 100 },
  NV3: { x: 700, y: 1000, r: 100 },
};

export default function CheckinClient() {
  const sp = useSearchParams();
  const name = sp.get("name");
  const table = sp.get("table");

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Check-in</h1>

      <p>
        Xin chào <b>{name || "Khách"}</b> 👋
      </p>
      <p>
        Vị trí của bạn: <b>{table || "—"}</b>
      </p>

      <div style={{ position: "relative", marginTop: 20 }}>
        <img
          src={background.src}
          alt="Sơ đồ bàn"
          style={{
            width: "100%",
            borderRadius: 12,
            display: "block",
          }}
        />

        {TABLE_POS[table] && (
          <div
            style={{
              position: "absolute",
              left: TABLE_POS[table].x,
              top: TABLE_POS[table].y,
              width: TABLE_POS[table].r * 2,
              height: TABLE_POS[table].r * 2,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              boxShadow: "0 0 40px 20px rgba(255,200,0,0.8)",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </div>
  );
}
