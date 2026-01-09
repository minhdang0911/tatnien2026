"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./HomePage.module.css";

import background from "./assests/img/anhchinh.jpg";
import backgroundtet from "./assests/img/tet6.gif";

import logo from "./assests/img/logo.png";

// icons
import menu from "./assests/img/menu.png";
import timeline from "./assests/img/timeline.png";
import iconsPlay from "./assests/img/volumestart.png";
import iconsPause from "./assests/img/voloumestopp.png";

// menu 4 trang (giống Checkin)
import trangbia from "./assests/menu/trangbia.jpg";
import thucdon from "./assests/menu/thucdon.jpg";
import trangcamon from "./assests/menu/trangcamon.jpg";
import biaket from "./assests/menu/trangket.png";

import MenuFlipbook from "./components/MenuFlipbook";

export default function HomePage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  /* ===== MUSIC ===== */
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(false);

  /* ===== MENU DATA (4 TRANG) ===== */
  const pages = useMemo(
    () => [
      { type: "image", fullImg: trangbia.src },
      { type: "image", fullImg: thucdon.src },
      { type: "image", fullImg: trangcamon.src },
      { type: "image", fullImg: biaket.src },
    ],
    []
  );

  /* ===== EVENT INFO ===== */
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

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    await audio.play();
    audio.volume = 0.8;
    setIsPlaying(true);
    localStorage.setItem("music_playing", "1");
    setShowMusicPrompt(false);
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

    const t = setTimeout(() => setShowMusicPrompt(true), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ESC đóng timeline */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowTimeline(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
          <img className={styles.bgImg} src={background.src} alt="bg" />
          <div className={styles.bgOverlay} />
        </div>

        {/* FLOAT BUTTONS */}
        <div className={styles.fabWrap}>
          <button
            className={`${styles.musicBtn} ${
              isPlaying ? styles.musicPlaying : ""
            }`}
            onClick={toggleMusic}
          >
            <img
              src={(isPlaying ? iconsPause : iconsPlay).src}
              className={`${styles.musicIcon} ${
                isPlaying ? styles.musicIconStop : styles.musicIconStart
              }`}
              alt=""
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
            >
              <button
                className={styles.inviteClose}
                onClick={() => setShowTimeline(false)}
              >
                ✕
              </button>

              <div className={styles.inviteTop}>
                <img className={styles.inviteLogo} src={logo.src} alt="" />
                <div className={styles.inviteTopText}>
                  <div className={styles.inviteTitle}>LỊCH TRÌNH</div>
                  <div className={styles.inviteName}>{eventInfo.name}</div>
                  <div className={styles.inviteOrg}>{eventInfo.org}</div>
                </div>
              </div>

              <div className={styles.inviteMeta}>
                <div className={styles.inviteMetaRow}>
                  <span>Thời gian</span>
                  <span>{eventInfo.time}</span>
                </div>
                <div className={styles.inviteDivider} />
                <div className={styles.inviteMetaRow}>
                  <span>Địa điểm</span>
                  <span>{eventInfo.place}</span>
                </div>
              </div>

              <div className={styles.inviteTimeline}>
                {timelineItems.map((it, i) => (
                  <div key={i} className={styles.inviteItem}>
                    <div className={styles.inviteTime}>{it.time}</div>
                    <div className={styles.inviteDot} />
                    <div>
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
