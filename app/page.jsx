"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import timeline from "./assests/img/timeline.png";
import iconsPlay from "./assests/img/play.jpg";
import iconsPause from "./assests/img/pause.jpg";

// covers
import bia from "./assests/menu/bia.png";
import thankyou from "./assests/menu/thankyou.png";
import biaket from "./assests/menu/ketbia.png";

import MenuFlipbook from "./components/MenuFlipbook";

export default function HomePage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  // ===== MUSIC =====
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(false);

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

  // popup hỏi nhạc sau 3s
  useEffect(() => {
    const saved = localStorage.getItem("music_playing");
    if (saved === "0") return;

    const t = setTimeout(() => {
      setShowMusicPrompt(true);
    }, 3000);

    return () => clearTimeout(t);
  }, []);

  // ESC đóng sheet
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowTimeline(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* POPUP MUSIC */}
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

      <div className={styles.root}>
        <div className={styles.tetBg}>
          <img className={styles.tetImg} src={backgroundtet.src} alt="tet" />
        </div>

        <audio ref={audioRef} src="/media/music.mp3" loop preload="auto" />

        <div className={styles.bgWrap}>
          <img className={styles.bgImg} src={background.src} alt="bg" />
          <div className={styles.bgOverlay} />
        </div>


        {/* RIGHT ACTIONS */}
        <div className={styles.fabWrap}>
          {/* MUSIC BUTTON */}
        
         <button
  className={`${styles.musicBtn} ${isPlaying ? styles.musicPlaying : ""}`}
  onClick={toggleMusic}
  aria-label="Bật / tắt nhạc"
>

          <img
  src={(isPlaying ? iconsPause : iconsPlay).src}
  alt="music"
  className={styles.musicIcon}
/>

          </button>

          <button
            className={`${styles.fabBtn} ${styles.timelineBtn}`}
            onClick={() => setShowTimeline(true)}
          >
            <img src={timeline.src} className={styles.timelineIcon} />
            Lịch trình
          </button>

          <button
            className={`${styles.fabBtn} ${styles.menuBtn}`}
            onClick={() => setShowMenu(true)}
          >
            <span className={styles.menuIconWrap}>
              <img className={styles.menuIcon} src={menu.src} />
            </span>
            Thực đơn
          </button>
        </div>

        {/* TIMELINE */}
        {showTimeline && (
          <div
            className={styles.sheetOverlay}
            onClick={() => setShowTimeline(false)}
          >
            <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
              {/* giữ nguyên phần này */}
            </div>
          </div>
        )}

        <MenuFlipbook
          open={showMenu}
          onClose={() => setShowMenu(false)}
          pages={pages}
          autoCloseLastMs={3000}
        />
      </div>
    </>
  );
}
