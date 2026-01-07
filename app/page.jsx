"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";

import background from "./assests/img/anh4.png";

// menu images
import goitommuc from "./assests/menu/goitommuc.jpg";
import soup from "./assests/menu/soup.jpg";
import gaboxoi from "./assests/menu/gaboxoi.jpg";
import comduongchau from "./assests/menu/comduongchau.webp";
import cachem from "./assests/menu/cachem.jpg";
import lauthai from "./assests/menu/lauthai.jpg";
import raucau from "./assests/menu/raucau.jpg";

import "./menu.css";

/* ================= PAGE ================= */

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

/* ================= SIZE HOOK ================= */

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

/* ================= MAIN ================= */

export default function HomePage() {
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

  const totalPages = pages.length + 2; // cover + back cover

  const isMobile =
    typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* BACKGROUND – GIỮ FULL ẢNH */}
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={background.src}
          alt="bg"
          style={{
            width: "100%",
            height: "100%",
            objectFit: isMobile ? "contain" : "contain",
          }}
        />
      </div>

      {/* BUTTONS */}
      <a
        href="/create"
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          background: "#fff",
          padding: "10px 14px",
          borderRadius: 10,
          textDecoration: "none",
          fontWeight: 800,
          zIndex: 10,
        }}
      >
        → Tạo QR
      </a>

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

      {/* MODAL MENU */}
      {showMenu && (
        <div className="menuModal" onClick={() => setShowMenu(false)}>
          <div className="menuBox" onClick={(e) => e.stopPropagation()}>
            <button className="closeBtn" onClick={() => setShowMenu(false)}>
              ✕
            </button>

            {/* Arrow chỉ hiện desktop */}
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
                size="fixed"
                showCover
                usePortrait={portrait}
                maxShadowOpacity={0.35}
                mobileScrollSupport
                useMouseEvents
                clickEventForward
                onFlip={(e) => {
                  if (e.data === totalPages - 1) {
                    setTimeout(() => setShowMenu(false), 600);
                  }
                }}
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
