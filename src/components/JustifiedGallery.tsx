import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

export interface GalleryPhoto {
  src: string;
  alt: string;
}

interface JustifiedGalleryProps {
  photos: GalleryPhoto[];
  /** Altezza indicativa di ogni riga; le foto vengono scalate per riempire la larghezza. */
  targetRowHeight?: number;
  /** Spazio (in px) tra le foto, sia orizzontale che verticale. */
  gap?: number;
  onPhotoClick?: (index: number) => void;
}

interface RowItem {
  index: number;
  width: number;
}

interface Row {
  items: RowItem[];
  height: number;
}

/**
 * Galleria "justified" (stile Flickr / Google Foto): le immagini vengono
 * disposte in righe che riempiono l'intera larghezza mantenendo il loro
 * rapporto d'aspetto originale. Nessuna foto viene tagliata, anche se hanno
 * dimensioni diverse. Il rapporto d'aspetto reale viene misurato al caricamento
 * di ciascuna immagine, quindi il layout si adatta da solo.
 */
export const JustifiedGallery: React.FC<JustifiedGalleryProps> = ({
  photos,
  targetRowHeight = 320,
  gap = 12,
  onPhotoClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  // 0 = rapporto non ancora misurato -> trattato come quadrato finché non carica
  const [ratios, setRatios] = useState<number[]>(() => photos.map(() => 0));

  // Reset dei rapporti quando si cambia album
  useEffect(() => {
    setRatios(photos.map(() => 0));
  }, [photos]);

  // Larghezza del contenitore, aggiornata in modo responsive
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleImageLoad = (
    index: number,
    e: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const img = e.currentTarget;
    if (!img.naturalWidth || !img.naturalHeight) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    setRatios(prev => {
      if (prev[index] === ratio) return prev;
      const next = [...prev];
      next[index] = ratio;
      return next;
    });
  };

  const rows = useMemo<Row[]>(() => {
    if (!containerWidth) return [];
    const aspect = (i: number) => (ratios[i] > 0 ? ratios[i] : 1);

    const result: Row[] = [];
    let rowIndexes: number[] = [];
    let ratioSum = 0;

    const flush = (isLast: boolean) => {
      if (rowIndexes.length === 0) return;
      const gaps = gap * (rowIndexes.length - 1);
      const fittedHeight = (containerWidth - gaps) / ratioSum;
      // L'ultima riga (parziale) non viene stirata a tutta larghezza
      const height = isLast ? Math.min(targetRowHeight, fittedHeight) : fittedHeight;
      result.push({
        items: rowIndexes.map(i => ({ index: i, width: aspect(i) * height })),
        height,
      });
      rowIndexes = [];
      ratioSum = 0;
    };

    for (let i = 0; i < photos.length; i++) {
      rowIndexes.push(i);
      ratioSum += aspect(i);
      const gaps = gap * (rowIndexes.length - 1);
      const projectedWidth = ratioSum * targetRowHeight + gaps;
      if (projectedWidth >= containerWidth) {
        flush(false);
      }
    }
    flush(true);
    return result;
  }, [containerWidth, ratios, photos, gap, targetRowHeight]);

  return (
    <div ref={containerRef} className="photos-justified" id="photos-justified">
      {rows.map((row, ri) => (
        <div
          className="jg-row"
          key={ri}
          style={{
            gap: `${gap}px`,
            height: `${row.height}px`,
            marginBottom: ri === rows.length - 1 ? 0 : `${gap}px`,
          }}
        >
          {row.items.map(item => {
            const photo = photos[item.index];
            return (
              <div
                key={photo.src}
                className="jg-item"
                style={{ width: `${item.width}px` }}
                onClick={() => onPhotoClick?.(item.index)}
                id={`photo-item-${item.index}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  onLoad={e => handleImageLoad(item.index, e)}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
