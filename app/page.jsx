"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./HomePage.module.css";

import background from "./assests/img/anhchinh.jpg";
import backgroundtet from "./assests/img/tet6.gif";

// dishes
import goitommuc from "./assests/menu/goitommuc.jpg";
import soup from "./assests/menu/soup.jpg";
import gaboxoi from "./assests/menu/gaboxoi.jpg";
import comduongchau from "./assests/menu/comduongchau.webp";
import cachem from "./assests/menu/cachem.jpg";
import lauthai from "./assests/menu/lauthai.jpg";
import raucau from "./assests/menu/raucau.jpg";
import menu from "./assests/img/menu.png";
import timeline from './assests/img/timeline.png'

// covers
import bia from "./assests/menu/bia.png";
import thankyou from "./assests/menu/thankyou.png";
import biaket from "./assests/menu/ketbia.png";

import MenuFlipbook from "./components/MenuFlipbook";

export default function HomePage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

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

  // ESC đóng sheet
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowTimeline(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={styles.root}>
      {/* BACKGROUND TẾT (layer 0) */}
      <div className={styles.tetBg}>
        <img className={styles.tetImg} src={backgroundtet.src} alt="tet" />
      </div>

      {/* ẢNH CHÍNH (layer 1) */}
      <div className={styles.bgWrap}>
        <img className={styles.bgImg} src={background.src} alt="bg" />
        <div className={styles.bgOverlay} />
      </div>

      LEFT ACTION: tạo QR (giữ như cũ)
      {/* <a href="/create" className={`${styles.fabBtn} ${styles.createBtn}`}>
        → Tạo QR
      </a> */}

      {/* RIGHT ACTIONS (2 nút stack) */}
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

      {/* TIMELINE SHEET */}
      {showTimeline && (
        <div
          className={styles.sheetOverlay}
          onClick={() => setShowTimeline(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
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

            <div className={styles.sheetHint}>Tip: bấm ra ngoài để đóng.</div>
          </div>
        </div>
      )}

      {/* MENU COMPONENT */}
      <MenuFlipbook
        open={showMenu}
        onClose={() => setShowMenu(false)}
        pages={pages}
        autoCloseLastMs={3000}
      />
    </div>
  );
}
