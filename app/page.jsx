"use client";

import React, { useMemo, useState } from "react";
import styles from "./HomePage.module.css";

import background from "./assests/img/anh4.png";

// dishes
import goitommuc from "./assests/menu/goitommuc.jpg";
import soup from "./assests/menu/soup.jpg";
import gaboxoi from "./assests/menu/gaboxoi.jpg";
import comduongchau from "./assests/menu/comduongchau.webp";
import cachem from "./assests/menu/cachem.jpg";
import lauthai from "./assests/menu/lauthai.jpg";
import raucau from "./assests/menu/raucau.jpg";
import menu from "./assests/img/menu.png";

// covers
import bia from "./assests/menu/bia.png";
import thankyou from "./assests/menu/thankyou.png";
import biaket from "./assests/menu/ketbia.png";

import MenuFlipbook from "./components/MenuFlipbook";

export default function HomePage() {
  const [showMenu, setShowMenu] = useState(false);

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

  return (
    <div className={styles.root}>
      {/* BACKGROUND */}
      <div className={styles.bgWrap}>
        <img className={styles.bgImg} src={background.src} alt="bg" />
        <div className={styles.bgOverlay} />
      </div>

      {/* BUTTONS */}
      <a href="/create" className={`${styles.btnFloating} ${styles.leftBtn}`}>
        → Tạo QR
      </a>

      <button
        className={`${styles.btnFloating} ${styles.rightBtn} ${styles.menuGlow}`}
        onClick={() => setShowMenu(true)}
      >
        <img className={styles.menuIcon} src={menu.src} alt="menu" />
        Thực đơn
      </button>

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
