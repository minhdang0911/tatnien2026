"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HTMLFlipBook from "react-pageflip";

import background from "../assests/img/anh4.png";

// menu images (Y HỆT PAGE)
import goitommuc from "../assests/menu/goitommuc.jpg";
import soup from "../assests/menu/soup.jpg";
import gaboxoi from "../assests/menu/gaboxoi.jpg";
import comduongchau from "../assests/menu/comduongchau.webp";
import cachem from "../assests/menu/cachem.jpg";
import lauthai from "../assests/menu/lauthai.jpg";
import raucau from "../assests/menu/raucau.jpg";

import "../menu.css";

/* ================= PAGE (Y HỆT) ================= */

const BookPage = React.forwardRef(function BookPage(props, ref) {
  const { title, desc, img, isCover, isBackCover } = props;

  if (isCover) {
    return (
      <div ref={ref} className="page cover">
        <div className="coverInner">
          <div className="coverTitle">THỰC ĐƠN</div>
          <div className="coverSub">Tiệc tất niên 2026</div>
          <div className="coverHint">
            Kéo góc trang hoặc chạm mép để lật
          </div>
        </div>
      </div>
    );
  }

  if (isBackCover) {
    return (
      <div ref={ref} className="page cover">
        <div className="coverInner">
          <div className="coverTitle" style={{ fontSize: 26 }}>
            Chúc ngon miệng!
          </div>
          <div className="coverSub">Hẹn gặp bạn ở buổi tiệc 🎉</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="page">
      <div className="pageInner">
        <div className="left">
          <div className="dishTitle">{title}</div>
          <div className="dishDesc">{desc}</div>
          <div className="divider" />
        </div>
        <div className="right">
          <div className="imgWrap">
            <img src={img} alt={title} />
          </div>
        </div>
      </div>
    </div>
  );
});

/* ================= SIZE HOOK (Y HỆT) ================= */

function useBookSize(open) {
  const [size, setSize] = useState({
    pageW: 520,
    pageH: 680,
    portrait: false,
  });

  useEffect(() => {
    if (!open) return;

    const calc = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw <= 768;

      const pageH = Math.min(760, vh * 0.86);
      const pageW = pageH * 0.76;

      setSize({
        pageW: isMobile ? Math.min(pageW, vw * 0.9) : pageW,
        pageH,
        portrait: isMobile,
      });
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [open]);

  return size;
}

/* ================= TABLE POS ================= */

const TABLE_POS = {
  BGD: { x: "38%", y: "42%" },
  KM: { x: "52%", y: "42%" },
  QL: { x: "66%", y: "42%" },
  NV1: { x: "44%", y: "58%" },
  NV2: { x: "58%", y: "58%" },
  NV3: { x: "72%", y: "58%" },
};

/* ================= MAIN ================= */

export default function CheckinPage() {
  const sp = useSearchParams();
  const name = sp.get("name") || "Khách";
  const table = sp.get("table");

  const [showMenu, setShowMenu] = useState(false);
  const bookRef = useRef(null);

  const { pageW, pageH, portrait } = useBookSize(showMenu);

  const pages = useMemo(
    () => [
      { title: "Gỏi tôm mực Thái", desc: "Khai vị", img: goitommuc.src },
      { title: "Soup hải sản", desc: "Khai vị", img: soup.src },
      { title: "Cá chẽm sốt cam", desc: "Món chính", img: cachem.src },
      { title: "Gà bó xôi", desc: "Món chính", img: gaboxoi.src },
      { title: "Cơm dương châu", desc: "Món chính", img: comduongchau.src },
      { title: "Lẩu Thái hải sản", desc: "Món chính", img: lauthai.src },
      { title: "Rau câu", desc: "Tráng miệng", img: raucau.src },
    ],
    []
  );

  const pos = TABLE_POS[table];

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* BACKGROUND (Y HỆT) */}
      <img
        src={background.src}
        alt="bg"
        style={{
          width: "100%",
          height: "100%",
        
          background: "#000",
        }}
      />

      {/* TOOLTIP + HIGHLIGHT */}
      {pos && (
        <div
          style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "rgba(255,200,0,.35)",
              boxShadow: "0 0 40px 20px rgba(255,200,0,.9)",
            }}
          />
          <div
            style={{
              marginTop: 6,
              background: "#fff",
              padding: "8px 12px",
              borderRadius: 10,
              fontSize: 13,
              whiteSpace: "nowrap",
              boxShadow: "0 10px 25px rgba(0,0,0,.25)",
            }}
          >
            👋 Xin chào <b>{name}</b>
            <br />
            📍 Bàn của bạn: <b>{table}</b>
          </div>
        </div>
      )}

      {/* BUTTON MENU (Y HỆT, CHỈ BỎ TẠO QR) */}
      <button
        onClick={() => setShowMenu(true)}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          background: "#caa24d",
          color: "#fff",
          padding: "12px 18px",
          borderRadius: 12,
          border: "none",
          fontSize: 16,
          fontWeight: 900,
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        📖 Thực đơn
      </button>

      {/* MODAL MENU (Y HỆT) */}
      {showMenu && (
        <div className="menuModal" onClick={() => setShowMenu(false)}>
          <div className="menuBox" onClick={(e) => e.stopPropagation()}>
            <button className="closeBtn" onClick={() => setShowMenu(false)}>
              ✕
            </button>

            {!portrait && (
              <button
                className="arrow left"
                onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
              >
                ‹
              </button>
            )}

            <div className="bookStage">
              <HTMLFlipBook
                ref={bookRef}
                width={pageW}
                height={pageH}
                showCover
                usePortrait={portrait}
              >
                <BookPage isCover />
                {pages.map((p, i) => (
                  <BookPage key={i} {...p} />
                ))}
                <BookPage isBackCover />
              </HTMLFlipBook>
            </div>

            {!portrait && (
              <button
                className="arrow right"
                onClick={() => bookRef.current?.pageFlip()?.flipNext()}
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
