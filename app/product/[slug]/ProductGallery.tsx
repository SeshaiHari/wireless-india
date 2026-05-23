"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import styles from "./product.module.css";

export function ProductGallery({
  images,
  name,
  badge,
}: {
  images: string[];
  name: string;
  badge?: string | null;
}) {
  const [active, setActive] = useState(0);
  // Always show at least 1 thumb; pad to a few for the design's rail feel.
  const thumbs = images.length > 1 ? images : images;

  return (
    <div className={styles.gallery}>
      {thumbs.length > 1 && (
        <div className={styles.thumbs}>
          {thumbs.map((src, i) => (
            <button
              key={`${src}-${i}`}
              className={i === active ? styles.on : undefined}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
      <div className={styles.stage}>
        {badge && <span className={styles.tag}>{badge}</span>}
        <span className={styles.heart}>
          <Icon name="heart" />
        </span>
        <img src={images[active]} alt={name} />
        <span className={styles.zoomHint}>Showcase</span>
      </div>
    </div>
  );
}
