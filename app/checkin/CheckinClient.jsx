"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./CheckinPage.module.css";

import background from "../assests/img/anh4.png";
import backgroundtet from "../assests/img/tet6.gif";

import MenuFlipbook from "../components/MenuFlipbook";

// dishes
import goitommuc from "../assests/menu/goitommuc.jpg";
import soup from "../assests/menu/soup.jpg";
import gaboxoi from "../assests/menu/gaboxoi.jpg";
import comduongchau from "../assests/menu/comduongchau.webp";
import cachem from "../assests/menu/cachem.jpg";
import lauthai from "../assests/menu/lauthai.jpg";
import raucau from "../assests/menu/raucau.jpg";
import logo from "../assests/img/logo.png";

// icons
import menu from "../assests/img/menu.png";
import timeline from "../assests/img/timeline.png";
import iconsPlay from "../assests/img/play.jpg";
import iconsPause from "../assests/img/pause.jpg";

// covers
import bia from "../assests/menu/bia.png";
import thankyou from "../assests/menu/thankyou.png";
import biaket from "../assests/menu/ketbia.png";

// table bg
import KA from "../assests/img/KA.jpg";
import KM from "../assests/img/KM.jpg";

/* ================= TABLE POS ================= */
const TABLE_POS = {
  KM: { x: 0.684, y: 0.2 },
  KA: { x: 0.808, y: 0.3 },
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

    const t = setTimeout(() => {
      setShowMusicPrompt(true);
    }, 2500);

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

  /* ===== MENU DATA ===== */
  const pages = useMemo(
    () => [
      { type: "image", fullImg: bia.src },
      { title: "Gỏi tôm mực Thái", img: goitommuc.src },
      { title: "Soup hải sản", img: soup.src },
      { title: "Cá chẽm sốt cam", img: cachem.src },
      { title: "Gà bó xôi", img: gaboxoi.src },
      { title: "Cơm dương châu", img: comduongchau.src },
      { title: "Lẩu Thái hải sản", img: lauthai.src },
      { title: "Rau câu", img: raucau.src },
      { type: "image", fullImg: thankyou.src },
      { type: "image", fullImg: biaket.src },
    ],
    []
  );

  /* ===== EVENT INFO + TIMELINE (đúng theo bạn) ===== */
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
      // sau này bạn thêm tiếp ở đây
    ],
    []
  );

  const bgSrc =
    tableCode === "KM" ? KM.src : tableCode === "KA" ? KA.src : background.src;

  return (
    <>
      {/* MUSIC PROMPT (đã đồng bộ class name với CSS) */}
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

          <button
            className={`${styles.fabBtn} ${styles.timelineBtn}`}
            onClick={() => setShowTimeline(true)}
          >
            <img src={timeline.src} className={styles.timelineIcon} alt="" />
            Lịch trình
          </button>

          <button
            className={`${styles.fabBtn} ${styles.menuBtn}`}
            onClick={() => setShowMenu(true)}
          >
            <img src={menu.src} className={styles.menuIcon} alt="" />
            Thực đơn
          </button>
        </div>

        {/* TIMELINE - THIỆP */}
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

              {/* <div className={styles.inviteHint}>
                Chạm ra ngoài để đóng • bấm ESC để thoát
              </div> */}
            </div>
          </div>
        )}

        <MenuFlipbook
          open={showMenu}
          onClose={() => setShowMenu(false)}
          pages={pages}
        />
      </div>
    </>
  );
}
