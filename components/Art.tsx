
'use client';

import { useState } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

const PHOTO_BASE = SUPABASE_URL
  ? `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/photos/`
  : '';

const SH: Record<string, (g: string) => React.ReactNode> = {
  lv: (g) => (
    <>
      <path
        d="M30 15L10 32l9 13 9-5v65h44V40l9 5 9-13L70 15Q50 30 30 15Z"
        fill={g}
        stroke="#f9e29b"
        strokeOpacity=".45"
        strokeWidth=".8"
      />
      <path
        d="M30 15Q50 30 70 15"
        fill="none"
        stroke="#fff"
        strokeOpacity=".45"
      />
      <path
        d="M42 24L50 34 58 24"
        fill="none"
        stroke="#fff"
        strokeOpacity=".5"
        strokeWidth=".8"
      />
    </>
  ),

  marry: (g) => (
    <>
      <circle
        cx="50"
        cy="72"
        r="24"
        fill="none"
        stroke={g}
        strokeWidth="7"
      />
      <circle
        cx="50"
        cy="72"
        r="17"
        fill="none"
        stroke="#f9e29b"
        strokeOpacity=".5"
        strokeWidth=".6"
      />
      <path d="M40 40l10-14 10 14-10 10z" fill="#fff0bb" />
      <path d="M40 40h20l-10 10z" fill="#d4af37" />
    </>
  ),

  flowers: (g) => (
    <>
      <path
        d="M50 112V58"
        fill="none"
        stroke="#83966b"
        strokeWidth="3"
      />
      <path
        d="M50 90Q30 75 24 86Q35 99 50 90Z"
        fill="#6b8255"
      />
      <path
        d="M50 102Q70 82 78 94Q65 109 50 102Z"
        fill="#8a9c68"
      />
      {[
        [50, 32],
        [68, 46],
        [32, 46],
        [62, 64],
        [38, 64],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="12"
          fill={g}
          opacity=".92"
        />
      ))}
      <circle cx="50" cy="50" r="9" fill="#e9d27a" />
    </>
  ),

  coffee: (g) => (
    <>
      <path
        d="M26 52h46v28a23 23 0 01-46 0z"
        fill={g}
      />
      <path
        d="M72 60h6a9 9 0 010 18h-7"
        fill="none"
        stroke={g}
        strokeWidth="4"
      />
      <path
        d="M38 40q-5-8 0-14M52 40q-5-8 0-14M64 40q-5-8 0-14"
        fill="none"
        stroke="#f9e29b"
        strokeOpacity=".8"
        strokeWidth="2"
      />
      <ellipse
        cx="49"
        cy="52"
        rx="23"
        ry="4"
        fill="#f9e29b"
        fillOpacity=".4"
      />
    </>
  ),
};

/**
 * Rasm manzillari:
 * hero.jpg
 * p-12.jpg
 * dept-lv.jpg
 * dept-marry.jpg
 *
 * Barcha fayllar Supabase Storage -> photos bucket ichida bo'ladi.
 */
export default function Art({
  file,
  dept,
  g = '#d4af37',
  className = '',
  alt = '',
}: {
  file: string;
  dept: string;
  g?: string;
  className?: string;
  alt?: string;
}) {
  const [ok, setOk] = useState(true);

  const imageUrl = PHOTO_BASE
    ? `${PHOTO_BASE}${file}.jpg`
    : '';

  return (
    <div
      className={
        'group relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,#302719_0%,#17130e_42%,#090909_100%)] ' +
        className
      }
    >
      {/* Premium fon bezagi */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 15% 15%, rgba(212,175,55,.13), transparent 38%), radial-gradient(circle at 85% 85%, rgba(170,119,28,.10), transparent 40%)',
        }}
      />

      {/* No-photo holati uchun kategoriya silueti */}
      <svg
        viewBox="0 0 100 120"
        aria-hidden="true"
        className="absolute inset-x-[10%] inset-y-[8%] z-0 h-[84%] w-[80%] opacity-80"
      >
        <defs>
          <linearGradient
            id={`gold-${file.replace(/[^a-zA-Z0-9_-]/g, '-')}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f9e29b" />
            <stop offset="50%" stopColor={g} />
            <stop offset="100%" stopColor="#765116" />
          </linearGradient>
        </defs>

        <g
          fill={`url(#gold-${file.replace(/[^a-zA-Z0-9_-]/g, '-')})`}
        >
          {(SH[dept] ?? SH.lv)(g)}
        </g>
      </svg>

      {/* Supabase rasmi */}
      {imageUrl && ok && (
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setOk(false)}
          className="absolute inset-0 z-[1] h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        />
      )}

      {/* Premium overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/10 via-transparent to-white/[0.025]"
      />

      {/* Nafis ramka */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 z-[3] border border-white/[0.07] transition-colors duration-500 group-hover:border-[#d4af37]/30"
      />

      {/* Pastdagi oltin chiziq */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent"
      />
    </div>
  );
}
