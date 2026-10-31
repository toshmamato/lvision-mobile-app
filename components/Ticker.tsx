
'use client';

const T = [
  'СКИДКА 10% ЗА ЗАКАЗ ЧЕРЕЗ САЙТ',
  'L VISION BY INOSHKINS',
  'LV FLOWERS',
  'НОВАЯ КОЛЛЕКЦИЯ 2026',
  'MARRY ME — COMING SOON',
  'COFE BY INOSHKINS — COMING SOON',
  'ОФОРМЛЕНИЕ ЗАКАЗА ПО НОМЕРУ ТЕЛЕФОНА',
];

export default function Ticker() {
  const row = (copy: number) =>
    T.map((t, i) => (
      <span
        key={`${copy}-${i}`}
        className="flex shrink-0 items-center gap-6 px-5 sm:px-7"
      >
        <span
          className={
            i === 0
              ? 'font-extrabold tracking-[0.18em] text-[#AA771C]'
              : 'font-medium tracking-[0.13em] text-[#17140E]'
          }
        >
          {t}
        </span>
        <span className="text-[#C6A451]">✦</span>
      </span>
    ));

  return (
    <div
      aria-label="L Vision announcements and offers"
      className="overflow-hidden border-y border-[#D4AF37]/30 bg-white py-3 text-[9px] sm:text-[11px]"
    >
      <div className="flex w-max animate-[mq_45s_linear_infinite]">
        <div className="flex shrink-0 items-center">
          {row(1)}
        </div>

        <div
          className="flex shrink-0 items-center"
          aria-hidden="true"
        >
          {row(2)}
        </div>
      </div>
    </div>
  );
}
