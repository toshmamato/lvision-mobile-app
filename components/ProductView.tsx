
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react';

import Art from './Art';
import Candles from './Candles';
import ProductCard from './ProductCard';

import { useStore } from '@/lib/store';
import { useMounted } from '@/lib/useMounted';
import { fmt, disc, tot } from '@/lib/format';
import type { Product } from '@/lib/types';

export default function ProductView({
  p,
  related,
}: {
  p: Product;
  related: Product[];
}) {
  const sizes = Object.keys(p.stock);
  const one = sizes[0] === 'ONE';

  const [size, setSize] = useState(one ? 'ONE' : '');
  const [q, setQ] = useState(1);
  const [err, setErr] = useState('');
  const [added, setAdded] = useState(false);

  const { add, fav, toggleFav } = useStore();
  const mounted = useMounted();

  const isFavorite = mounted && fav.includes(p.id);
  const available = tot(p.stock);
  const max = size ? p.stock[size] || 0 : 0;
  const soldOut = available === 0;

  function addToCart() {
    setErr('');
    setAdded(false);

    if (soldOut) {
      setErr('Этот товар закончился.');
      return;
    }

    if (!size) {
      setErr('Сначала выберите размер.');
      return;
    }

    if (max < 1) {
      setErr('Выбранного размера нет в наличии.');
      return;
    }

    add({
      id: p.id,
      size,
      qty: Math.min(q, max),
      name: p.name,
      price: p.price,
      dept: p.dept,
      max,
    });

    setAdded(true);
  }

  function changeSize(s: string) {
    setSize(s);
    setQ(1);
    setErr('');
    setAdded(false);
  }

  return (
    <main className="min-h-screen bg-bg">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1500px] px-5 pt-5 md:px-8 md:pt-7">
        <div className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-mute">
          <Link
            href="/"
            className="transition-colors hover:text-ac"
          >
            Главная
          </Link>

          <span className="text-line">/</span>

          <Link
            href="/catalog"
            className="transition-colors hover:text-ac"
          >
            Каталог
          </Link>

          <span className="text-line">/</span>

          <span className="max-w-[180px] truncate text-fg">
            {p.name}
          </span>
        </div>
      </div>

      {/* Product details */}
      <section className="mx-auto max-w-[1500px] px-5 pb-16 pt-6 md:px-8 md:pb-24 md:pt-10">
        <div className="grid items-start gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-12 lg:gap-20">
          {/* LEFT: Product image */}
          <div className="min-w-0">
            <div className="group relative overflow-hidden border border-line bg-surf">
              <Art
                file={`p-${p.id}`}
                dept={p.dept}
                g={p.color}
                alt={p.name}
                className="aspect-[4/5] w-full"
              />

              {/* Editorial overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/[0.03]" />

              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-6">
                <span className="border border-white/25 bg-black/35 px-3 py-2 text-[8px] uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                  L Vision Studio
                </span>

                {p.is_new && (
                  <span className="border border-[var(--gold-border)] bg-black/50 px-3 py-2 text-[8px] uppercase tracking-[0.2em] text-[#f9e29b] backdrop-blur-sm">
                    New collection
                  </span>
                )}

                {!p.is_new && p.old_price && (
                  <span className="border border-white/25 bg-black/45 px-3 py-2 text-[8px] uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                    −{disc(p)}%
                  </span>
                )}
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-6">
                <div>
                  <p className="mb-2 text-[8px] uppercase tracking-[0.24em] text-white/65">
                    L / V
                  </p>

                  <p className="text-xl font-light tracking-wide text-white md:text-3xl">
                    {p.name}
                  </p>
                </div>

                <span className="grid h-10 w-10 place-items-center rounded-full border border-white/35 text-white md:h-12 md:w-12">
                  <ArrowLeft
                    size={17}
                    strokeWidth={1.3}
                    className="rotate-180"
                  />
                </span>
              </div>

              <div className="pointer-events-none absolute inset-2 border border-white/[0.08]" />
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 text-[8px] uppercase tracking-[0.19em] text-mute md:text-[9px]">
              <span>Curated essentials</span>
              <span className="h-px flex-1 bg-line" />
              <span className="text-ac">№ {p.id}</span>
            </div>

            {/* Product details strip */}
            <div className="mt-7 hidden grid-cols-2 border-y border-line sm:grid">
              <div className="flex items-start gap-3 border-r border-line py-5 pr-4">
                <ShieldCheck
                  size={19}
                  strokeWidth={1.3}
                  className="shrink-0 text-ac"
                />

                <div>
                  <p className="text-xs">Покупка с уверенностью</p>
                  <p className="mt-1 text-[10px] leading-5 text-mute">
                    Данные заказа передаются через защищённый канал.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-5 pl-4">
                <Truck
                  size={19}
                  strokeWidth={1.3}
                  className="shrink-0 text-ac"
                />

                <div>
                  <p className="text-xs">Удобная доставка</p>
                  <p className="mt-1 text-[10px] leading-5 text-mute">
                    Доступные варианты и стоимость покажем при оформлении.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product information */}
          <div className="min-w-0 md:sticky md:top-28">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[9px] uppercase tracking-[0.25em] text-ac">
                {p.category}
              </p>

              <button
                type="button"
                onClick={() => toggleFav(p.id)}
                aria-label={
                  isFavorite
                    ? 'Удалить из избранного'
                    : 'Добавить в избранное'
                }
                aria-pressed={!!isFavorite}
                className="group grid h-11 w-11 shrink-0 place-items-center border border-line transition-all duration-300 hover:border-[var(--gold-border)] hover:bg-[var(--gold-soft)]"
              >
                <Heart
                  size={19}
                  strokeWidth={1.4}
                  className="transition-colors group-hover:text-ac"
                  fill={isFavorite ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            <h1 className="mt-4 max-w-2xl text-3xl font-light leading-[1.13] tracking-[-0.055em] sm:text-4xl md:mt-5 md:text-5xl lg:text-6xl">
              {p.name}
              <span className="text-ac">.</span>
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-mute">
              {p.description || 'Откройте свой стиль с L Vision.'}
            </p>

            {/* Price */}
            <div className="mt-7 border-y border-line py-5 md:mt-9 md:py-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span className="text-2xl font-light tracking-[-0.04em] md:text-3xl">
                  {fmt(p.price)}
                </span>

                {p.old_price && (
                  <>
                    <s className="text-sm text-mute">
                      {fmt(p.old_price)}
                    </s>

                    <span className="border border-[var(--gold-border)] px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-ac">
                      −{disc(p)}%
                    </span>
                  </>
                )}
              </div>

              <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-mute">
                Цена указана в сумах
              </p>
            </div>

            {/* Discount */}
            {p.old_price && (
              <div className="mt-5 border border-line bg-surf p-4 md:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[9px] uppercase tracking-[0.19em] text-ac">
                    Special offer
                  </p>

                  <span className="text-xs text-mute">
                    −{disc(p)}%
                  </span>
                </div>

                <Candles
                  seed={p.id}
                  from={p.old_price}
                  to={p.price}
                />

                <p className="mt-2 text-[9px] leading-4 text-mute">
                  Иллюстрация, не реальная история цен.
                </p>
              </div>
            )}

            {/* Stock status */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <p className="text-[9px] uppercase tracking-[0.19em] text-mute">
                Наличие товара
              </p>

              <span
                className={
                  'flex items-center gap-2 text-[10px] ' +
                  (soldOut ? 'text-red-400' : 'text-emerald-500')
                }
              >
                <span
                  className={
                    'h-1.5 w-1.5 rounded-full ' +
                    (soldOut ? 'bg-red-400' : 'bg-emerald-500')
                  }
                />

                {soldOut
                  ? 'Нет в наличии'
                  : size
                    ? `Доступно: ${max} шт.`
                    : 'В наличии'}
              </span>
            </div>

            {/* Size selector */}
            {!one && (
              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[9px] uppercase tracking-[0.19em] text-mute">
                    Выберите размер
                  </p>

                  {size && (
                    <button
                      type="button"
                      onClick={() => changeSize('')}
                      className="text-[9px] text-mute underline underline-offset-4 transition-colors hover:text-ac"
                    >
                      Сбросить
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((s) => {
                    const inStock = (p.stock[s] || 0) > 0;
                    const selected = size === s;

                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={!inStock || soldOut}
                        aria-pressed={selected}
                        onClick={() => changeSize(s)}
                        className={
                          'relative min-h-12 border text-sm transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-35 ' +
                          (selected
                            ? 'border-[var(--g2)] bg-[var(--gold-soft)] text-ac'
                            : 'border-line hover:border-[var(--gold-border)] hover:text-ac')
                        }
                      >
                        {s}

                        {selected && (
                          <span className="absolute right-1 top-1 text-ac">
                            <Check size={10} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-7">
              <p className="mb-3 text-[9px] uppercase tracking-[0.19em] text-mute">
                Количество
              </p>

              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex h-12 items-center border border-line">
                  <button
                    type="button"
                    aria-label="Уменьшить количество"
                    disabled={q <= 1 || soldOut}
                    onClick={() => setQ((v) => Math.max(1, v - 1))}
                    className="grid h-full w-11 place-items-center text-mute transition-colors hover:text-ac disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="min-w-10 text-center text-sm tabular-nums">
                    {q}
                  </span>

                  <button
                    type="button"
                    aria-label="Увеличить количество"
                    disabled={soldOut || q >= (max || 1)}
                    onClick={() =>
                      setQ((v) => Math.min(max || 1, v + 1))
                    }
                    className="grid h-full w-11 place-items-center text-mute transition-colors hover:text-ac disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <p className="text-right text-[10px] text-mute">
                  {size && !soldOut ? `${max} шт. доступно` : ''}
                </p>
              </div>
            </div>

            {/* Add to cart */}
            <button
              type="button"
              disabled={soldOut}
              onClick={addToCart}
              className="group mt-5 flex min-h-14 w-full items-center justify-between gap-3 border border-[var(--g2)] bg-[var(--g2)] px-5 text-left text-[#100d06] transition-all duration-300 hover:brightness-110 hover:shadow-[0_10px_30px_var(--glow)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:shadow-none md:px-6"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag size={18} strokeWidth={1.5} />

                <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                  {soldOut
                    ? 'Нет в наличии'
                    : added
                      ? 'Добавлено в корзину'
                      : 'Добавить в корзину'}
                </span>
              </span>

              {added ? (
                <Check size={18} />
              ) : (
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              )}
            </button>

            {err && (
              <p
                role="alert"
                className="mt-3 border border-red-500/20 bg-red-500/5 p-3 text-xs leading-5 text-red-400"
              >
                {err}
              </p>
            )}

            {/* Order info */}
            <div className="mt-5 flex items-start gap-3 border border-line p-4">
              <ShieldCheck
                size={17}
                strokeWidth={1.4}
                className="mt-0.5 shrink-0 text-ac"
              />

              <div>
                <p className="text-xs">Оплата при получении</p>

                <p className="mt-1 text-[10px] leading-5 text-mute">
                  Данные заказа и стоимость доставки будут показаны при оформлении.
                </p>
              </div>
            </div>

            {/* Specifications */}
            {p.spec?.length > 0 && (
              <div className="mt-8 border-t border-line pt-6">
                <p className="mb-4 text-[9px] uppercase tracking-[0.2em] text-ac">
                  Характеристики
                </p>

                <ul className="space-y-3">
                  {p.spec.map((spec, index) => (
                    <li
                      key={spec}
                      className="flex items-start gap-3 text-sm leading-6 text-mute"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 bg-ac" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href="/catalog"
              className="lnk mt-8 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-mute hover:text-ac"
            >
              <ArrowLeft size={13} />
              Вернуться в каталог
            </Link>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-line bg-[var(--surf)]">
          <div className="mx-auto max-w-[1500px] px-5 py-12 md:px-8 md:py-20">
            <div className="mb-7 flex items-end justify-between gap-4 md:mb-10">
              <div>
                <p className="mb-3 text-[9px] uppercase tracking-[0.25em] text-ac">
                  You may also like
                </p>

                <h2 className="text-3xl font-light tracking-[-0.05em] md:text-5xl">
                  Похожие товары<span className="text-ac">.</span>
                </h2>
              </div>

              <Link
                href="/catalog"
                className="lnk mb-1 flex shrink-0 items-center gap-2 text-[9px] uppercase tracking-[0.13em] text-mute hover:text-ac"
              >
                Все товары
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5">
              {related.map((r) => (
                <ProductCard key={r.id} p={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
