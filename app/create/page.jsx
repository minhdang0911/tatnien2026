"use client";

import { useMemo, useState } from "react";
import QRCode from "react-qr-code";

const TABLES = [
  "BGD",
  "KM",
  "QL",
  "KA",
  "DP",
  "NV1",
  "NV2",
  "NV3",
];

export default function CreatePage() {
  const [name, setName] = useState("");
  const [table, setTable] = useState("NV1");

  const url = useMemo(() => {
    if (typeof window === "undefined") return "";
    const u = new URL(`${window.location.origin}/checkin`);
    u.searchParams.set("name", name.trim());
    u.searchParams.set("table", table);
    return u.toString();
  }, [name, table]);

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Tạo QR</h1>

      <label>Tên</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nhập tên..."
        style={{ width: "100%", padding: 10, marginTop: 6 }}
      />

      <label style={{ marginTop: 14, display: "block" }}>Bàn</label>
      <select
        value={table}
        onChange={(e) => setTable(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      >
        {TABLES.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      {name && (
        <div style={{ marginTop: 20 }}>
          <p>Link:</p>
          <p style={{ wordBreak: "break-all" }}>{url}</p>

          <div style={{ background: "#fff", padding: 12, display: "inline-block" }}>
            <QRCode value={url} size={180} />
          </div>
        </div>
      )}
    </div>
  );
}
