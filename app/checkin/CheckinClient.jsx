"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./CheckinPage.module.css";

import background from "../assests/img/anh4.png";
import backgroundtet from "../assests/img/tet6.gif";

import MenuFlipbook from "../components/MenuFlipbook";

// logo
import logo from "../assests/img/logo.png";

// icons
import menu from "../assests/img/menu.png";
// import timeline from "../assests/img/timeline.png";
import iconsPlay from "../assests/img/volumestart.png";
import iconsPause from "../assests/img/voloumestopp.png";

// table bg
import KA from "../assests/img/KA.jpg";
import KM from "../assests/img/KM.jpg";

// 4 trang menu
import trangbia from "../assests/menu/trangbia.jpg";
import thucdon from "../assests/menu/thucdon.jpg";
import trangcamon from "../assests/menu/trangcamon.jpg";
import biaket from "../assests/menu/trangket.png";

/* ================= TABLE POS ================= */
const TABLE_POS = {
  KM: { x: 0.6, y: 0.25 },
  KA: { x: 0.6, y: 0.35 },
};

const TABLE_INFO = {
  KM: { label: "Bàn Khách mời" },
  KA: { label: "Bàn Công ty Kiến An" },
};

export default function CheckinClient() {
  const sp = useSearchParams();
  const tableCode = (sp.get("table") || "").trim();

  const tableLabel = TABLE_INFO[tableCode]?.label || "";
  const posNorm = TABLE_POS[tableCode] || null;

  const [showMenu, setShowMenu] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  /* ===== MUSIC ===== */
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(false);

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.muted = false;
      audio.volume = 0.8;
      await audio.play();
      setIsPlaying(true);
      localStorage.setItem("music_playing", "1");
      setShowMusicPrompt(false);
    } catch {}
  };

  const pause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    localStorage.setItem("music_playing", "0");
    setShowMusicPrompt(false);
  };

  const toggleMusic = async () => {
    if (isPlaying) pause();
    else await play();
  };

  /* popup hỏi nhạc */
  useEffect(() => {
    const saved = localStorage.getItem("music_playing");
    if (saved === "0") return;

    const t = setTimeout(() => setShowMusicPrompt(true), 2500);
    return () => clearTimeout(t);
  }, []);

  /* auto play sau tương tác đầu */
  useEffect(() => {
    const saved = localStorage.getItem("music_playing");
    if (saved === "0") return;

    const first = async () => {
      if (!isPlaying) await play();
    };

    window.addEventListener("pointerdown", first, { once: true });
    return () => window.removeEventListener("pointerdown", first);
  }, [isPlaying]);

  /* ESC đóng timeline */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowTimeline(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ===== MENU DATA (4 TRANG) ===== */
  const pages = useMemo(
    () => [
      { type: "image", fullImg: trangbia.src }, // bìa trước
      { type: "image", fullImg: thucdon.src }, // mở ra trang trái
      { type: "image", fullImg: trangcamon.src }, // mở ra trang phải
      { type: "image", fullImg: biaket.src }, // bìa kết
    ],
    []
  );

  /* ===== EVENT INFO + TIMELINE ===== */
  const eventInfo = useMemo(
    () => ({
      name: "TIỆC TẤT NIÊN",
      org: "CÔNG TY CỔ PHẦN CÔNG NGHỆ TIỆN ÍCH THÔNG MINH",
      time: "18h ngày 27/01/2026",
      place:
        "110-112 Đ. Vành Đai Trong, An Lạc A, Bình Tân, Thành phố Hồ Chí Minh",
    }),
    []
  );

  const timelineItems = useMemo(
    () => [
      { time: "18g00", title: "Mời khách", desc: "Đón khách – Check-in" },
      { time: "18g45", title: "Khai tiệc", desc: "Bắt đầu chương trình" },
    ],
    []
  );

  const bgSrc =
    tableCode === "KM" ? KM.src : tableCode === "KA" ? KA.src : background.src;

  return (
    <>
      {/* MUSIC PROMPT */}
      {showMusicPrompt && !isPlaying && (
        <div className={styles.musicOverlay}>
          <div className={styles.musicPopup}>
            <div className={styles.musicTitle}>
              🎵 Bật nhạc xuân để không khí thêm rộn ràng?
            </div>
            <div className={styles.musicActions}>
              <button className={styles.musicYes} onClick={play}>
                Bật nhạc
              </button>
              <button className={styles.musicNo} onClick={pause}>
                Không
              </button>
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} src="/media/music.mp3" loop preload="auto" />

      <div className={styles.root}>
        <div className={styles.tetBg}>
          <img className={styles.tetImg} src={backgroundtet.src} alt="tet" />
        </div>

        <div className={styles.bgWrap}>
          <img className={styles.bgImg} src={bgSrc} alt="bg" />
          <div className={styles.bgOverlay} />
        </div>

        {/* ✅ TABLE PANEL (CÁI BẠN ĐANG TÌM) */}
   {posNorm && tableLabel && (
  <div
    className={styles.tablePanel}
    style={{
      left: `${posNorm.x * 100}%`,
      top: `${posNorm.y * 100}%`,
    }}
  >
    <div className={styles.tableHello}>
      Trân trọng kính mời!
    </div>

    <div className={styles.tableLine}>
      Bàn của bạn: <b>{tableLabel}</b>
      {tableCode ? (
        <span className={styles.tableCode}>  </span>
      ) : null}
    </div>
  </div>
)}


        {/* FLOAT BUTTONS */}
        <div className={styles.fabWrap}>
          <button
            className={`${styles.musicBtn} ${
              isPlaying ? styles.musicPlaying : ""
            }`}
            onClick={toggleMusic}
            aria-label="Bật / tắt nhạc"
          >
            <img
              src={(isPlaying ? iconsPause : iconsPlay).src}
              className={styles.musicIcon}
              alt="music"
            />
          </button>

          {/* <button
            className={`${styles.fabBtn} ${styles.timelineBtn}`}
            onClick={() => setShowTimeline(true)}
          >
            <img src={timeline.src} className={styles.timelineIcon} alt="" />
            Lịch trình
          </button> */}

          <button
            className={`${styles.fabBtn} ${styles.menuBtn}`}
            onClick={() => setShowMenu(true)}
          >
            <img src={menu.src} className={styles.menuIcon} alt="" />
            Thực đơn
          </button>
        </div>

        {/* TIMELINE */}
        {showTimeline && (
          <div
            className={styles.inviteOverlay}
            onClick={() => setShowTimeline(false)}
          >
            <div
              className={styles.inviteCard}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button
                className={styles.inviteClose}
                onClick={() => setShowTimeline(false)}
                aria-label="Đóng"
                title="Đóng"
              >
                ✕
              </button>

              <div className={styles.inviteTop}>
                <img className={styles.inviteLogo} src={logo.src} alt="logo" />
                <div className={styles.inviteTopText}>
                  <div className={styles.inviteTitle}>LỊCH TRÌNH</div>
                  <div className={styles.inviteName}>{eventInfo.name}</div>
                  <div className={styles.inviteOrg}>{eventInfo.org}</div>
                </div>
              </div>

              <div className={styles.inviteMeta}>
                <div className={styles.inviteMetaRow}>
                  <span className={styles.inviteMetaLabel}>Thời gian</span>
                  <span className={styles.inviteMetaValue}>
                    {eventInfo.time}
                  </span>
                </div>
                <div className={styles.inviteDivider} />
                <div className={styles.inviteMetaRow}>
                  <span className={styles.inviteMetaLabel}>Địa điểm</span>
                  <span className={styles.inviteMetaValue}>
                    {eventInfo.place}
                  </span>
                </div>
              </div>

              <div className={styles.inviteTimeline}>
                {timelineItems.map((it, idx) => (
                  <div key={idx} className={styles.inviteItem}>
                    <div className={styles.inviteTime}>{it.time}</div>
                    <div className={styles.inviteDot} />
                    <div className={styles.inviteBody}>
                      <div className={styles.inviteItemTitle}>{it.title}</div>
                      <div className={styles.inviteItemDesc}>{it.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MENU FLIPBOOK */}
        <MenuFlipbook
          open={showMenu}
          onClose={() => setShowMenu(false)}
          pages={pages}
          autoCloseLastMs={2000}
        />
      </div>
    </>
  );
}
