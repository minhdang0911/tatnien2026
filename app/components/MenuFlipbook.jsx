"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";
import styles from "../menu.module.css";

/* ================= PAGE ================= */

const BookPage = React.forwardRef(function BookPage(props, ref) {
  const { title, desc, img, type, fullImg } = props;

  if (type === "image") {
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
  }

  return (
    <div ref={ref} className={styles.page}>
      <div className={styles.pageInner}>
        <div className={styles.left}>
          <div className={styles.chip}>{desc}</div>
          <div className={styles.dishTitle}>{title}</div>
          <div className={styles.dishNote}>
            Món được phục vụ theo set • Vui lòng liên hệ nhân viên nếu cần hỗ trợ
          </div>
          <div className={styles.divider} />
        </div>

        <div className={styles.right}>
          <div className={styles.imgWrap}>
            <Image
              src={img}
              alt={title || ""}
              fill
              sizes="(max-width: 768px) 60vw, 260px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
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

  // mỗi lần open=true => mount mới => state reset, khỏi setState trong effect
  return <MenuFlipbookInner key="menu-flipbook-open" {...props} />;
}

/* ================= INNER ================= */

function MenuFlipbookInner({ open, onClose, pages, autoCloseLastMs = 3000 }) {
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

  const handleFlip = (e) => {
    const idx = e.data;
    setPageIndex(idx);

    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (idx === last && autoCloseLastMs > 0) {
      closeTimerRef.current = setTimeout(() => onClose?.(), autoCloseLastMs);
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
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
            onFlip={handleFlip}
          >
            {pages.map((p, i) => (
              <BookPage key={i} {...p} />
            ))}
          </HTMLFlipBook>
        </div>
      </div>
    </div>
  );
}
