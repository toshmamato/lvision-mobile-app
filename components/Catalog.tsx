
'use client';

import { useMemo, useState } from 'react';
import {
  SlidersHorizontal,
  Search,
  X,
  LockKeyhole,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

import ProductCard from './ProductCard';
import { DEPTS } from '@/lib/depts';
import { tot } from '@/lib/format';
import type { Product } from '@/lib/types';

const ACTIVE_DEPTS = DEPTS.filter((d) => d.active);
const ACTIVE_DEPT_IDS = ACTIVE_DEPTS.map((d) => d.id);

export default function Catalog({
  products,
  dept0,
}: {
  products: Product[];
  dept0: string;
}) {
  const top = Math.max(100000, ...products.map((p) => p.price));

  const [dept, setDept] = useState(
    DEPTS.some((d) => d.id === dept0 && d.active) ? dept0 : ''
  );

  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [max, setMax] = useState(top);
  const [av, setAv] = useState(false);
  const [sort, setSort] = useState('new');
  const [size, setSize] = useState('');
  const [open, setOpen] = useState(false);

  const d = DEPTS.find((x) => x.id === dept && x.active);

  const activeProducts = useMemo(
    () => products.filter((p) => ACTIVE_DEPT_IDS.includes(p.dept)),
    [products]
  );

  const list = useMemo(
    () =>
      activeProducts
        .filter(
          (p) =>
            (!dept || p.dept === dept) &&
            (!cat || p.category === cat) &&
            p.name.toLowerCase().includes(q.toLowerCase()) &&
            p.price <= max &&
            (!av || tot(p.stock) > 0) &&
            (!size || Number(p.stock[size] || 0) > 0)
        )
        .sort((a, b) =>
          sort === 'lo'
            ? a.price - b.price
            : sort === 'hi'
              ? b.price - a.price
              : b.id - a.id
        ),
    [activeProducts, dept, cat, q, max, av, sort, size]
  );

  const chip = (on: boolean) =>
    'shrink-0 border px-3 py-2 text-[11px] uppercase tracking-widest transition ' +
    (on
      ? 'border-[var(--g2)] bg-[var(--gold-soft)] text-[var(--g1)]'
      : 'border-line hover:border-[var(--g2)]');

  const selectDept = (id: string) => {
    setDept(id);
    setCat('');
    setSize('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-5 md:py-12">

      {/* HEADER */}
      <div className="mb-8 flex items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-[10px] tracking-[0.35em] text-[var(--g2)]">
            L_VISION COLLECTIONS
          </p>

          <h1 className="text-3xl font-light tracking-wide sm:text-4xl md:text-6xl">
            {d ? d.name : 'Каталог'}
          </h1>
        </div>

        <button
          type="button"
          className="btn o flex items-center gap-2 md:hidden"
          onClick={() => setOpen(true)}
        >
          <SlidersHorizontal size={14} />
          Фильтры
        </button>
      </div>

      {/* ALL COLLECTIONS BUTTON */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => selectDept('')}
          className={chip(dept === '')}
        >
          Все активные коллекции
        </button>
      </div>

      {/* COLLECTION CARDS */}
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEPTS.map((item) => {
          const isActive = item.active;

          return (
            <div
              key={item.id}
              className={[
                'group relative isolate min-h-[155px] overflow-hidden border transition-all duration-500',
                isActive
                  ? dept === item.id
                    ? 'border-[var(--g2)] shadow-[0_10px_40px_rgba(212,175,55,0.13)]'
                    : 'border-[var(--gold-border)] hover:border-[var(--g2)]'
                  : 'border-[#51462d]',
              ].join(' ')}
            >
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#211b10] via-[#101010] to-black" />

              <div
                className={[
                  'absolute -right-12 -top-16 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500',
                  isActive
                    ? 'bg-[var(--g2)]/10 group-hover:opacity-100'
                    : 'bg-[#b28b39]/20 opacity-50',
                ].join(' ')}
              />

              {isActive ? (
                <button
                  type="button"
                  onClick={() => selectDept(item.id)}
                  aria-pressed={dept === item.id}
                  className="relative flex h-full min-h-[155px] w-full flex-col items-start justify-between p-5 text-left"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[9px] tracking-[0.28em] text-[var(--g2)]">
                      ACTIVE COLLECTION
                    </span>

                    <Sparkles
                      size={16}
                      className="text-[var(--g2)]"
                    />
                  </div>

                  <div>
                    <h2 className="mb-2 text-base font-light tracking-[0.12em] text-[#f8e9bd] sm:text-lg">
                      {item.name}
                    </h2>

                    <p className="text-xs text-white/50">
                      {item.sub}
                    </p>
                  </div>

                  <div className="flex w-full items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-[9px] tracking-[0.2em] text-white/60">
                      {dept === item.id ? 'SELECTED' : 'EXPLORE'}
                    </span>

                    <ArrowUpRight
                      size={16}
                      className="text-[var(--g2)] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </div>
                </button>
              ) : (
                <div
                  aria-disabled="true"
                  className="relative flex h-full min-h-[155px] flex-col items-start justify-between overflow-hidden bg-black/50 p-5"
                >
                  <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />

                  <div className="relative flex w-full items-center justify-between">
                    <span className="text-[9px] tracking-[0.28em] text-[#bda15f]">
                      FUTURE COLLECTION
                    </span>

                    <LockKeyhole
                      size={16}
                      className="text-[#bda15f]"
                    />
                  </div>

                  <div className="relative">
                    <h2 className="mb-2 text-base font-light tracking-[0.12em] text-white/60 sm:text-lg">
                      {item.name}
                    </h2>

                    <p className="text-xs text-white/35">
                      {item.sub}
                    </p>
                  </div>

                  <div className="relative flex w-full items-center justify-between border-t border-[#bda15f]/25 pt-3">
                    <span className="text-[10px] font-semibold tracking-[0.35em] text-[#d8b75c]">
                      COMING SOON
                    </span>

                    <Sparkles
                      size={15}
                      className="text-[#bda15f]"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* PRODUCTS AND FILTERS */}
      {activeProducts.length === 0 ? (
        <div className="border border-line px-5 py-16 text-center text-mute">
          <Sparkles
            size={25}
            className="mx-auto mb-4 text-[var(--g2)]"
          />

          <h2 className="mb-2 text-lg font-light">
            Коллекция скоро появится
          </h2>

          <p className="text-sm">
            Товары скоро будут доступны.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[230px_1fr]">

          {/* FILTER SIDEBAR */}
          <aside
            className={
              (open
                ? 'fixed inset-x-0 bottom-0 z-[60] max-h-[85vh] overflow-auto border-t border-line bg-bg p-5 '
                : 'hidden ') +
              'space-y-4 md:static md:block md:border-0 md:p-0'
            }
          >
            <div className="flex justify-between md:hidden">
              <b className="font-normal">Фильтры</b>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-mute"
              />

              <input
                className="!pl-9"
                aria-label="Поиск по названию"
                placeholder="Поиск по названию"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            {d && (
              <div className="flex flex-wrap gap-2">
                {['', ...d.cats].map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCat(c)}
                    className={chip(cat === c)}
                  >
                    {c || 'Все'}
                  </button>
                ))}
              </div>
            )}

            {dept === 'lv' && (
              <div className="flex flex-wrap gap-2">
                {['', 'S', 'M', 'L', 'XL'].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSize(s)}
                    className={chip(size === s)}
                  >
                    {s || 'Все размеры'}
                  </button>
                ))}
              </div>
            )}

            <label className="block text-xs text-mute">
              Цена до {Math.round(max).toLocaleString('ru-RU')} сум

              <input
                type="range"
                min={0}
                max={top}
                step={10000}
                value={Math.min(max, top)}
                onChange={(e) => setMax(+e.target.value)}
              />
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="!w-auto"
                checked={av}
                onChange={(e) => setAv(e.target.checked)}
              />
              Только в наличии
            </label>

            <select
              aria-label="Сортировка"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="new">Новые</option>
              <option value="lo">Дешевле → дороже</option>
              <option value="hi">Дороже → дешевле</option>
            </select>

            <button
              type="button"
              className="btn o w-full"
              onClick={() => {
                setQ('');
                setCat('');
                setMax(top);
                setAv(false);
                setSort('new');
                setSize('');
              }}
            >
              Сбросить
            </button>

            <button
              type="button"
              className="btn w-full md:hidden"
              onClick={() => setOpen(false)}
            >
              Показать {list.length}
            </button>
          </aside>

          {/* PRODUCT GRID */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-[10px] tracking-[0.25em] text-mute">
                {d ? d.name : 'ACTIVE COLLECTIONS'}
              </p>

              <p className="text-xs text-mute">
                {list.length} товаров
              </p>
            </div>

            <div className="grid min-w-0 grid-cols-2 gap-4 lg:grid-cols-3">
              {list.length ? (
                list.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))
              ) : (
                <p className="col-span-full py-16 text-center text-mute">
                  Ничего не найдено
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
