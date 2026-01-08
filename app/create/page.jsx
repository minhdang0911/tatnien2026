"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  QrCode,
  User,
  LayoutGrid,
  Copy,
  Download,
  Check,
  UserCheck,
} from "lucide-react";

import styles from "./CreatePage.module.css";

const TABLES = ["BGD", "KM", "QL", "KA", "DP", "NV1", "NV2", "NV3"];

const TITLES = [
  { value: "anh", label: "Anh" },
  { value: "chi", label: "Chị" },
];

export default function CreatePage() {
  const [title, setTitle] = useState("anh"); // anh | chi
  const [name, setName] = useState("");
  const [table, setTable] = useState("NV1");
  const [toast, setToast] = useState(null);

  const qrRef = useRef(null);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1600);
  };

  useEffect(() => {
    return () => toastTimer.current && clearTimeout(toastTimer.current);
  }, []);

  const url = useMemo(() => {
    if (typeof window === "undefined") return "";
    const u = new URL("/checkin", window.location.origin);

    const trimmed = name.trim();
    if (trimmed) u.searchParams.set("name", trimmed);
    u.searchParams.set("title", title);
    u.searchParams.set("table", table);

    return u.toString();
  }, [name, table, title]);

  const canGenerate = name.trim().length > 0;

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `QR-${title}-${name.trim() || "guest"}-${table}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    showToast("Đã lưu mã QR");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    showToast("Đã sao chép liên kết");
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.shell}>
          {/* FORM */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.titleWrap}>
                <div className={styles.titleIcon}>
                  <QrCode size={18} />
                </div>
                <div>
                  <h1 className={styles.title}>Tạo QR Check-in</h1>
                  <p className={styles.subTitle}>
                    Chọn xưng hô, nhập tên khách và bàn
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.grid2}>
                {/* XƯNG HÔ */}
                <div className={styles.field}>
                  <div className={styles.label}>Xưng hô</div>
                  <div style={{ position: "relative" }}>
                    <select
                      className={styles.select}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    >
                      {TITLES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <span
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        opacity: 0.7,
                        pointerEvents: "none",
                      }}
                    >
                      <UserCheck size={16} />
                    </span>
                  </div>
                </div>

                {/* TÊN */}
                <div className={styles.field}>
                  <div className={styles.label}>Tên khách</div>
                  <div style={{ position: "relative" }}>
                    <input
                      className={styles.input}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        opacity: 0.7,
                      }}
                    >
                      <User size={16} />
                    </span>
                  </div>
                </div>

                {/* BÀN */}
                <div className={styles.field}>
                  <div className={styles.label}>Bàn</div>
                  <div style={{ position: "relative" }}>
                    <select
                      className={styles.select}
                      value={table}
                      onChange={(e) => setTable(e.target.value)}
                    >
                      {TABLES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <span
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        opacity: 0.7,
                        pointerEvents: "none",
                      }}
                    >
                      <LayoutGrid size={16} />
                    </span>
                  </div>
                </div>
              </div>

              {/* BUTTONS */}
              <div className={styles.btnRow}>
                <button
                  className={`${styles.btn} ${!canGenerate ? styles.btnDisabled : ""}`}
                  onClick={copyLink}
                  disabled={!canGenerate}
                >
                  <Copy size={16} />
                  Copy link
                </button>

                <button
                  className={`${styles.btn} ${styles.btnPrimary} ${!canGenerate ? styles.btnDisabled : ""}`}
                  onClick={downloadQR}
                  disabled={!canGenerate}
                >
                  <Download size={16} />
                  Tải QR
                </button>
              </div>
            </div>
          </div>

          {/* PREVIEW */}
          <div className={`${styles.card} ${styles.previewCard}`}>
            <div className={styles.previewTop}>
              <p className={styles.previewTitle}>Xem trước</p>
            </div>

            <div className={styles.previewBody}>
              {canGenerate ? (
                <>
                  <div ref={qrRef} className={styles.qrBox}>
                    <QRCodeCanvas
                      value={url}
                      size={220}
                      level="H"
                      includeMargin
                      imageSettings={{
                        src: "/logo.png",
                        width: 44,
                        height: 44,
                        excavate: true,
                      }}
                    />
                  </div>
                  <div className={styles.url}>{url}</div>
                </>
              ) : (
                <div className={styles.qrBox} style={{ opacity: 0.6 }}>
                  <QrCode size={42} />
                  <div style={{ marginTop: 8, fontWeight: 800 }}>
                    Chưa có mã QR
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className={styles.toast}>
          <Check size={16} />
          {toast}
        </div>
      )}
    </>
  );
}
