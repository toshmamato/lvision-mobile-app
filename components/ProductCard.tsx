'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Art from './Art';
import { useStore } from '@/lib/store';
import { useMounted } from '@/lib/useMounted';
import { fmt, disc, tot } from '@/lib/format';
import type { Product } from '@/lib/types';

export default function ProductCard({ p }: { p: Product }) {
  const m = useMounted();
  const { fav, toggleFav } = useStore();
  const on = m && fav.includes(p.id);
  const out = tot(p.stock) === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group card-glow relative"
    >
      <Link href={`/p/${p.id}`}>
        <div className="relative">
          <Art
            file={`p-${p.id}`}
            dept={p.dept}
            g={p.color}
            alt={p.name}
            className="aspect-[4/5]"
          />

          {(p.is_new || p.old_price) && (
            <span className="absolute left-2 top-2 bg-fg px-2 py-1 text-[9px] tracking-widest text-bg">
              {p.old_price ? `−${disc(p)}%` : 'НОВОЕ'}
            </span>
          )}

          {out && (
            <span className="absolute inset-x-0 bottom-0 bg-bg/80 p-2 text-center text-xs text-mute">
              Нет в наличии
            </span>
          )}
        </div>

        <h3 className="mt-3 text-[15px]">{p.name}</h3>

        <p className="text-xs uppercase tracking-widest text-mute">
          {p.category}
        </p>

        <p className="mt-1 flex gap-2">
          {fmt(p.price)}
          {p.old_price && (
            <s className="text-xs text-mute">{fmt(p.old_price)}</s>
          )}
        </p>
      </Link>

      <button
        aria-label="Избранное"
        onClick={() => toggleFav(p.id)}
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-bg/70"
      >
        <Heart size={16} fill={on ? 'currentColor' : 'none'} />
      </button>
    </motion.div>
  );
}