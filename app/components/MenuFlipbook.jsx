"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";
import styles from "../menu.module.css";

/* ================= PAGE ================= */

const BookPage = React.forwardRef(function BookPage(props, ref) {
  const { fullImg } = props;

  return (
    <div ref={ref} className={`${styles.page} ${styles.pageImage}`}>
      <div className={styles.pageImgWrap}>
        <Image
          src={fullImg}
          alt=""
          fill
          sizes="(max-width: 768px) 92vw, 520px"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
    </div>
  );
});

/* ================= SIZE HOOK ================= */

function useBookSize(open) {
  const [size, setSize] = useState({ pageW: 520, pageH: 680, portrait: false });

  useEffect(() => {
    if (!open) return;

    const calc = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw <= 768;

      const pageH = Math.min(780, vh * 0.84);
      const pageW = pageH * 0.7;

      setSize({
        pageW: isMobile ? Math.min(pageW, vw * 0.92) : pageW,
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

/* ================= OUTER: keyed remount ================= */

export default function MenuFlipbook(props) {
  const { open } = props;
  if (!open) return null;
  return <MenuFlipbookInner key="menu-flipbook-open" {...props} />;
}

/* ================= INNER ================= */

function MenuFlipbookInner({ open, onClose, pages, autoCloseLastMs = 2000 }) {
  const bookRef = useRef(null);
  const closeTimerRef = useRef(null);

  const { pageW, pageH, portrait } = useBookSize(open);

  const [pageIndex, setPageIndex] = useState(0);
  const totalPages = pages.length;
  const last = totalPages - 1;

  const mode = useMemo(() => {
    if (pageIndex === 0) return "single-start";
    if (pageIndex === last) return "single-end";
    return "spread";
  }, [pageIndex, last]);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleFlip = (e) => {
    const idx = e.data;
    setPageIndex(idx);

    clearCloseTimer();

    // ✅ tới trang cuối thì tự đóng sau N ms
    if (idx === last && autoCloseLastMs > 0) {
      closeTimerRef.current = setTimeout(() => onClose?.(), autoCloseLastMs);
    }
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  return (
    <div className={styles.menuModal} onClick={onClose}>
      <div className={styles.menuBox} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeBtnPro}
          onClick={onClose}
          aria-label="Đóng"
          type="button"
        >
          ✕
        </button>

        {!portrait && (
          <>
            <button
              className={`${styles.navBtn} ${styles.navLeft}`}
              onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
              aria-label="Previous page"
              type="button"
            >
              ‹
            </button>
            <button
              className={`${styles.navBtn} ${styles.navRight}`}
              onClick={() => bookRef.current?.pageFlip()?.flipNext()}
              aria-label="Next page"
              type="button"
            >
              ›
            </button>
          </>
        )}

        <div
          className={[
            styles.bookStage,
            styles[mode], // single-start | spread | single-end
            portrait ? styles.portrait : styles.landscape,
          ].join(" ")}
          style={{ "--pagew": `${pageW}px` }}
        >
          {/* ✅ wrap để translate mượt, tránh "nhảy center" khi đổi 1 trang <-> 2 trang */}
          <div className={styles.bookWrap}>
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
              startPage={0}
              flippingTime={850} // ✅ mượt hơn
              onFlip={handleFlip}
            >
              {pages.map((p, i) => (
                <BookPage key={i} {...p} />
              ))}
            </HTMLFlipBook>
          </div>
        </div>
      </div>
    </div>
  );
}
