
'use client';

import { useMemo, useState } from 'react';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import ProductCard from './ProductCard';
import { DEPTS } from '@/lib/depts';
import { tot } from '@/lib/format';
import type { Product } from '@/lib/types';

const EXTRA_CLOTHES = [
  {
    id: 1,
    name: 'Kiyim 1',
    imageUrl: 'BU_YERGA_1_RASM_URL',
  },
  {
    id: 2,
    name: 'Kiyim 2',
    imageUrl: 'BU_YERGA_2_RASM_URL',
  },
];

export default function Catalog({
  products,
  dept0,
}: {
  products: Product[];
  dept0: string;
}) {
  const top = Math.max(100000, ...products.map((p) => p.price));

  const [
    dept,
    setDept,
  ] = useState(DEPTS.some((d) => d.id === dept0) ? dept0 : '');

  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [max, setMax] = useState(top);
  const [av, setAv] = useState(false);
  const [sort, setSort] = useState('new');
  const [size, setSize] = useState('');
  const [open, setOpen] = useState(false);

  const d = DEPTS.find((x) => x.id === dept);

  const list = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (!dept || p.dept === dept) &&
            (!cat || p.category === cat) &&
            p.name.toLowerCase().includes(q.toLowerCase()) &&
            p.price <= max &&
            (!av || tot(p.stock) > 0) &&
            (!size || (p.stock[size] || 0) > 0)
        )
        .sort((a, b) =>
          sort === 'lo'
            ? a.price - b.price
            : sort === 'hi'
              ? b.price - a.price
              : b.id - a.id
        ),
    [products, dept, cat, q, max, av, sort, size]
  );

  const chip = (on: boolean) =>
    'shrink-0 border px-3 py-2 text-[11px] uppercase tracking-widest transition ' +
    (on
      ? 'border-fg bg-fg text-bg'
      : 'border-line hover:border-fg');

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="text-4xl font-light md:text-6xl">
          {d ? d.name : 'Каталог'}
        </h1>

        <button
          className="btn o flex items-center gap-2 md:hidden"
          onClick={() => setOpen(true)}
        >
          <SlidersHorizontal size={14} />
          Фильтры
        </button>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto">
        {[{ id: '', name: 'Все' }, ...DEPTS].map((x) => (
          <button
            key={x.id}
            onClick={() => {
              setDept(x.id);
              setCat('');
              setSize('');
            }}
            className={chip(dept === x.id)}
          >
            {x.name}
          </button>
        ))}
      </div>

      {/* Ikki dona kiyim rasmi */}
      {(!dept || dept === 'lv') && (
        <div className="mb-8 grid grid-cols-2 gap-4 lg:gap-6">
          {EXTRA_CLOTHES.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="overflow-hidden bg-bg">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="aspect-[3/4] w-full object-cover transition duration-500 hover:scale-[1.02]"
                />
              </div>

              <p className="mt-3 text-sm font-light tracking-wide">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p className="border border-line p-12 text-center text-mute">
          Товары скоро появятся
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-[230px_1fr]">
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
              className="btn w-full md:hidden"
              onClick={() => setOpen(false)}
            >
              Показать {list.length}
            </button>
          </aside>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
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
      )}
    </div>
  );
}
