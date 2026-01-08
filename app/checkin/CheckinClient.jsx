"use client";

import React, { useMemo, useState } from "react";
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
import menu from "../assests/img/menu.png";

// covers
import bia from "../assests/menu/bia.png";
import thankyou from "../assests/menu/thankyou.png";
import biaket from "../assests/menu/ketbia.png";

/* ================= TABLE POS (tọa độ highlight) ================= */
const TABLE_POS = {
  BGD: { x: "38%", y: "42%" },
  KM: { x: "52%", y: "42%" },
  QL: { x: "66%", y: "42%" },

  NV1: { x: "44%", y: "58%" },
  NV2: { x: "58%", y: "58%" },
  NV3: { x: "72%", y: "58%" },

  // Nếu có NV4 thì bạn add toạ độ ở đây
  // NV4: { x: "??%", y: "??%" },

  // Nếu KA/DP có bàn trên map thì bạn add thêm:
  // KA: { x: "??%", y: "??%" },
  // DP: { x: "??%", y: "??%" },
};

/* ================= TABLE LABEL (hiển thị chuyên nghiệp) ================= */
const TABLE_INFO = {
  BGD: { label: "Bàn Ban Giám đốc" },
  KM: { label: "Bàn Khách mời" },
  KA: { label: "Bàn Công ty Kiến An" },
  QL: { label: "Bàn Quản lý" },
  DP: { label: "Bàn Dự phòng" },

  NV1: { label: "Bàn Nhân viên 1" },
  NV2: { label: "Bàn Nhân viên 2" },
  NV3: { label: "Bàn Nhân viên 3" },
  NV4: { label: "Bàn Nhân viên 4" },
};

const TITLE_MAP = {
  anh: "Anh",
  chi: "Chị",
};

function safeTrim(s) {
  return (s || "").trim();
}

export default function CheckinClient() {
  const sp = useSearchParams();

  const rawName = safeTrim(sp.get("name"));
  const name = rawName || "Quý khách";

  const titleKey = safeTrim(sp.get("title")) || "anh";
  const honorific = TITLE_MAP[titleKey] || "Quý khách";
  const honorificOnly =
    name === "Quý khách" ? "quý khách" : honorific.toLowerCase();

  const tableCode = safeTrim(sp.get("table")); // ví dụ: NV1
  const tableMeta = tableCode ? TABLE_INFO[tableCode] : null;
  const tableLabel = tableMeta?.label || "Khu vực đón tiếp";

  const [showMenu, setShowMenu] = useState(false);

  // highlight theo map (nếu không có tọa độ thì chỉ hiện panel ở giữa dưới)
  const pos = tableCode ? TABLE_POS[tableCode] : null;

  /* ================= MENU PAGES ================= */
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

  // text chào chuyên nghiệp
  // - Nếu name là "Quý khách" thì không kèm honorific để khỏi "Anh Quý khách"
  const greetingName =
    name === "Quý khách" ? "Quý khách" : `${honorific} ${name}`;

  return (
    <div className={styles.root}>
      {/* BACKGROUND */}
      <div className={styles.bgWrap}>
        <img className={styles.bgImg} src={background.src} alt="bg" />
        <div className={styles.bgOverlay} />
      </div>

      {/* HIGHLIGHT + PANEL */}
      <div
        className={styles.tableWrap}
        style={
          pos ? { left: pos.x, top: pos.y } : { left: "50%", top: "68%" } // fallback vị trí panel nếu không có pos
        }
      >
        {pos && <div className={styles.tableGlow} />}

        <div className={styles.tooltip}>
          <div className={styles.greetTitle}>Kính chào {greetingName}</div>
          <div className={styles.greetSub}>
            Bàn của {honorificOnly} là: <b>{tableLabel}</b>
          </div>
        </div>
      </div>

      {/* MENU BUTTON */}
      <button
        className={`${styles.btnFloating} ${styles.rightBtn} ${styles.menuGlow}`}
        onClick={() => setShowMenu(true)}
      >
        <img className={styles.menuIcon} src={menu.src} alt="menu" />
        Thực đơn
      </button>

      {/* MENU FLIPBOOK */}
      <MenuFlipbook
        open={showMenu}
        onClose={() => setShowMenu(false)}
        pages={pages}
        autoCloseLastMs={3000}
      />
    </div>
  );
}
