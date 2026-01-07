"use client";

import { useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const TABLES = ["BGD", "KM", "QL", "KA", "DP", "NV1", "NV2", "NV3"];

export default function CreatePage() {
  const [name, setName] = useState("");
  const [table, setTable] = useState("NV1");
  const qrRef = useRef(null);

  // ✅ URL tự ăn theo domain hiện tại
  const url = useMemo(() => {
    if (typeof window === "undefined") return "";
    const u = new URL("/checkin", window.location.origin);
    u.searchParams.set("name", name.trim());
    u.searchParams.set("table", table);
    return u.toString();
  }, [name, table]);

  // ✅ Download QR
  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `QR-${name || "guest"}-${table}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎟️ Tạo QR Check-in</h1>

        {/* FORM */}
        <div style={styles.form}>
          <div>
            <label>Tên</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên..."
              style={styles.input}
            />
          </div>

          <div>
            <label>Bàn</label>
            <select
              value={table}
              onChange={(e) => setTable(e.target.value)}
              style={styles.input}
            >
              {TABLES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* QR */}
        {name && (
          <>
            <div ref={qrRef} style={styles.qrBox}>
              <QRCodeCanvas
                value={url}
                size={200}
                level="H"
                includeMargin
                imageSettings={{
                  src: "/logo.png", // 🔥 logo công ty (public/logo.png)
                  width: 40,
                  height: 40,
                  excavate: true,
                }}
              />
            </div>

            <p style={styles.url}>{url}</p>

            <button onClick={downloadQR} style={styles.button}>
              💾 Lưu QR
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const styles = {
  page: {
    minHeight: "100vh",
  
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: 420,
    background: "#fff",
    borderRadius: 18,
    padding: 24,
    boxShadow: "0 25px 60px rgba(0,0,0,.25)",
  },
  title: {
    marginBottom: 16,
    fontSize: 22,
    fontWeight: 900,
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginTop: 6,
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 14,
  },
  qrBox: {
    marginTop: 20,
    padding: 16,
    background: "#fafafa",
    borderRadius: 14,
    display: "flex",
    justifyContent: "center",
  },
  url: {
    marginTop: 10,
    fontSize: 12,
    wordBreak: "break-all",
    opacity: 0.6,
  },
  button: {
    marginTop: 14,
    width: "100%",
    padding: "12px 0",
    borderRadius: 12,
    border: "none",
    background: "#caa24d",
    color: "#fff",
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer",
  },
};
