"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./CheckinPage.module.css";

import background from "../assests/img/anh4.png";
import MenuFlipbook from "../components/MenuFlipbook";

// dishes
import goitommuc from "../assests/menu/goitommuc.jpg";
import soup from "../assests/menu/soup.jpg";
import gaboxoi from "../assests/menu/gaboxoi.jpg";
import comduongchau from "../assests/menu/comduongchau.webp";
import cachem from "../assests/menu/cachem.jpg";
import lauthai from "../assests/menu/lauthai.jpg";
import raucau from "../assests/menu/raucau.jpg";
import timeline from "../assests/img/timeline.png";

// icons/images
import menu from "../assests/img/menu.png";
import backgroundtet from "../assests/img/tet6.gif";

// covers
import bia from "../assests/menu/bia.png";
import thankyou from "../assests/menu/thankyou.png";
import biaket from "../assests/menu/ketbia.png";

// table backgrounds
import KA from "../assests/img/KA.jpg";
import KM from "../assests/img/KM.jpg";

/* ================= TABLE POS (normalized 0..1 theo ảnh) ================= */
const TABLE_POS = {
  KM: { x: 0.684, y: 0.2 },
  KA: { x: 0.808, y: 0.3 },
};

/* ================= TABLE LABEL ================= */
const TABLE_INFO = {
  KM: { label: "Bàn Khách mời" },
  KA: { label: "Bàn Công ty Kiến An" },
};

function safeTrim(s) {
  return (s || "").trim();
}

export default function CheckinClient() {
  const sp = useSearchParams();
  const tableCode = safeTrim(sp.get("table"));

  const tableLabel = TABLE_INFO[tableCode]?.label || "";
  const posNorm = TABLE_POS[tableCode] || null;

  const [showMenu, setShowMenu] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  // refs để tính object-fit: contain rect
  const bgWrapRef = useRef(null);
  const imgRef = useRef(null);

  // vị trí marker theo px (trong bgWrap)
  const [markerPx, setMarkerPx] = useState(null);

  const bgSrc = useMemo(() => {
    if (tableCode === "KM") return KM.src;
    if (tableCode === "KA") return KA.src;
    return background.src;
  }, [tableCode]);

  const pages = useMemo(
    () => [
      { type: "image", fullImg: bia.src },

      { title: "Gỏi tôm mực Thái", desc: "Khai vị", img: goitommuc.src },
      { title: "Soup hải sản", desc: "Khai vị", img: soup.src },
      { title: "Cá chẽm sốt cam", desc: "Món chính", img: cachem.src },
      { title: "Gà bó xôi", desc: "Món chính", img: gaboxoi.src },
      { title: "Cơm dương châu", desc: "Món chính", img: comduongchau.src },
      { title: "Lẩu Thái hải sản", desc: "Món chính", img: lauthai.src },
      { title: "Rau câu", desc: "Tráng miệng", img: raucau.src },

      { type: "image", fullImg: thankyou.src },
      { type: "image", fullImg: biaket.src },
    ],
    []
  );

  const timelineItems = useMemo(
    () => [
      { time: "18:00", title: "Mời khách", desc: "Đón khách – Check-in" },
      { time: "18:45", title: "Khai tiệc", desc: "Bắt đầu chương trình" },
    ],
    []
  );

  // tính marker theo "khung ảnh render thực tế" khi object-fit: contain
  const recomputeMarker = () => {
    if (!posNorm) {
      setMarkerPx(null);
      return;
    }

    const wrap = bgWrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    const W = wrap.clientWidth;
    const H = wrap.clientHeight;

    const nW = img.naturalWidth || 0;
    const nH = img.naturalHeight || 0;
    if (!nW || !nH) return;

    const scale = Math.min(W / nW, H / nH);
    const rW = nW * scale;
    const rH = nH * scale;

    const offsetX = (W - rW) / 2;
    const offsetY = (H - rH) / 2;

    const xPx = offsetX + posNorm.x * rW;
    const yPx = offsetY + posNorm.y * rH;

    setMarkerPx({ x: xPx, y: yPx });
  };

  useEffect(() => {
    recomputeMarker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgSrc, tableCode]);

  useEffect(() => {
    const onResize = () => recomputeMarker();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posNorm, bgSrc]);

  // ESC đóng modal
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowTimeline(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={styles.root}>
      {/* BACKGROUND TẾT */}
      <div className={styles.tetBg}>
        <img className={styles.tetImg} src={backgroundtet.src} alt="tet" />
      </div>

      {/* ẢNH CHÍNH */}
      <div className={styles.bgWrap} ref={bgWrapRef}>
        <img
          ref={imgRef}
          className={styles.bgImg}
          src={bgSrc}
          alt="bg"
          onLoad={recomputeMarker}
        />
        <div className={styles.bgOverlay} />

        {/* HIGHLIGHT */}
        <div
          className={styles.tableWrap}
          style={
            markerPx
              ? { left: `${markerPx.x}px`, top: `${markerPx.y}px` }
              : { left: "50%", top: "68%" }
          }
        >
          {markerPx && <div className={styles.tableGlow} />}

          <div className={styles.tooltip}>
            <div className={styles.greetTitle}>Đây là vị trí bàn của bạn</div>
            {tableLabel && (
              <div className={styles.greetSub}>
                <b>{tableLabel}</b>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING ACTIONS (2 nút) */}
      <div className={styles.fabWrap}>
        <button
          className={`${styles.fabBtn} ${styles.timelineBtn}`}
          onClick={() => setShowTimeline(true)}
          aria-label="Mở lịch trình"
        >
          <img src={timeline.src} alt="timeline" className={styles.timelineIcon} />
          Lịch trình
        </button>
        

        <button
          className={`${styles.fabBtn} ${styles.menuBtn}`}
          onClick={() => setShowMenu(true)}
          aria-label="Mở thực đơn"
        >
          <span className={styles.menuIconWrap}>
            <img className={styles.menuIcon} src={menu.src} alt="menu" />
          </span>
          Thực đơn
        </button>
      </div>

      {/* TIMELINE MODAL (bottom sheet style) */}
      {showTimeline && (
        <div
          className={styles.sheetOverlay}
          onClick={() => setShowTimeline(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles.sheet}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.sheetHeader}>
              <div>
                <div className={styles.sheetTitle}>Lịch trình</div>
                <div className={styles.sheetSub}>
                  Mời khách <b>18:00</b> · Khai tiệc <b>18:45</b>
                </div>
              </div>

              <button
                className={styles.sheetClose}
                onClick={() => setShowTimeline(false)}
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            <div className={styles.timelineList}>
              {timelineItems.map((it, idx) => (
                <div key={idx} className={styles.tItem}>
                  <div className={styles.tDot} />
                  <div className={styles.tBody}>
                    <div className={styles.tTop}>
                      <div className={styles.tTime}>{it.time}</div>
                      <div className={styles.tTitle}>{it.title}</div>
                    </div>
                    <div className={styles.tDesc}>{it.desc}</div>
                  </div>
                </div>
              ))}
            </div>

           
          </div>
        </div>
      )}

      {/* MENU */}
      <MenuFlipbook
        open={showMenu}
        onClose={() => setShowMenu(false)}
        pages={pages}
        autoCloseLastMs={3000}
      />
    </div>
  );
}
