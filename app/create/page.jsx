"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { QrCode, LayoutGrid, Copy, Download, Check } from "lucide-react";

import styles from "./CreatePage.module.css";

const TABLES = ["KM", "KA"];

export default function CreatePage() {
  const [table, setTable] = useState("KM");
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
    u.searchParams.set("table", table);
    return u.toString();
  }, [table]);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `QR-${table}.png`;
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
                  <p className={styles.subTitle}>Chỉ cần chọn bàn</p>
                </div>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.grid2}>
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
                <button className={styles.btn} onClick={copyLink}>
                  <Copy size={16} />
                  Copy link
                </button>

                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={downloadQR}
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
