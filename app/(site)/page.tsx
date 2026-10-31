import Link from 'next/link';
import {
  Banknote,
  PhoneCall,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  MoveRight,
  LockKeyhole,
} from 'lucide-react';

import Hero from '@/components/Hero';
import Art from '@/components/Art';
import ProductCard from '@/components/ProductCard';
import { DEPTS } from '@/lib/depts';
import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

function isComingSoon(id: string) {
  return id === 'marry' || id === 'coffee';
}

function SectionHeading({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href: string;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4 md:mb-9">
      <div>
        <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.28em] text-ac">
          {eyebrow}
        </p>

        <h2 className="text-3xl font-light tracking-[-0.045em] md:text-5xl">
          {title}
        </h2>
      </div>

      <Link
        href={href}
        className="lnk mb-1 flex shrink-0 items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-mute transition-colors hover:text-ac"
      >
        <span>Р вЂ™РЎРѓР Вµ РЎвЂљР С•Р Р†Р В°РЎР‚РЎвЂ№</span>
        <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}

const benefits = [
  {
    Icon: Banknote,
    number: '01',
    title: 'Р С›Р С—Р В»Р В°РЎвЂљР В° Р С—РЎР‚Р С‘ Р С—Р С•Р В»РЎС“РЎвЂЎР ВµР Р…Р С‘Р С‘',
    description: 'Р С›Р С—Р В»Р В°РЎвЂЎР С‘Р Р†Р В°Р в„–РЎвЂљР Вµ Р В·Р В°Р С”Р В°Р В·, Р С”Р С•Р С–Р Т‘Р В° Р С—Р С•Р В»РЎС“РЎвЂЎР С‘РЎвЂљР Вµ Р ВµР С–Р С•.',
  },
  {
    Icon: PhoneCall,
    number: '02',
    title: 'Р вЂ”Р В°Р С”Р В°Р В· Р С—Р С• РЎвЂљР ВµР В»Р ВµРЎвЂћР С•Р Р…РЎС“',
    description: 'Р СџР С•Р Т‘РЎвЂљР Р†Р ВµРЎР‚Р В¶Р Т‘Р ВµР Р…Р С‘Р Вµ Р В·Р В°Р С”Р В°Р В·Р В° Р С—Р С• Р Р†Р В°РЎв‚¬Р ВµР СРЎС“ Р Р…Р С•Р СР ВµРЎР‚РЎС“.',
  },
  {
    Icon: Sparkles,
    number: '03',
    title: 'Р В§Р ВµРЎвЂљРЎвЂ№РЎР‚Р Вµ Р Р…Р В°Р С—РЎР‚Р В°Р Р†Р В»Р ВµР Р…Р С‘РЎРЏ',
    description: 'Р С›Р Т‘Р ВµР В¶Р Т‘Р В°, Р С”Р С•Р В»РЎРЉРЎвЂ Р В°, РЎвЂ Р Р†Р ВµРЎвЂљРЎвЂ№ Р С‘ Р С”Р С•РЎвЂћР Вµ Р Р† Р С•Р Т‘Р Р…Р С•Р С Р СР ВµРЎРѓРЎвЂљР Вµ.',
  },
];

export default async function Home() {
  const all = await getProducts();

  const nw = all.filter((p) => p.is_new).slice(0, 4);
  const sale = all.filter((p) => p.old_price).slice(0, 4);

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <Hero />

      {/* KATEGORIYALAR NAVIGATSIYASI */}
      <section className="border-y border-line">
        <div className="mx-auto max-w-7xl px-5 py-8 md:py-10">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-[0.25em] text-mute">
              Р СњР В°РЎв‚¬Р С‘ Р Р…Р В°Р С—РЎР‚Р В°Р Р†Р В»Р ВµР Р…Р С‘РЎРЏ
            </p>

            <span className="text-[9px] tracking-[0.2em] text-ac">
              L / VISION
            </span>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-2 md:justify-between md:gap-8">
            {DEPTS.map((d, index) => {
              const soon = isComingSoon(d.id);

              const content = (
                <>
                  <div className="relative mx-auto mb-3 aspect-square w-full rounded-full border border-line p-1 transition-all duration-500 group-hover:border-ac group-hover:shadow-[0_0_25px_var(--glow)]">
                    <div className="h-full w-full overflow-hidden rounded-full">
                      <Art
                        file={`dept-${d.id}`}
                        dept={d.id}
                        alt={d.name}
                        className="aspect-square rounded-full transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full border border-line bg-bg text-[8px] text-ac">
                      0{index + 1}
                    </span>

                    {soon && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap border border-[var(--gold-border)] bg-bg px-2 py-1 text-[7px] uppercase tracking-[0.12em] text-ac">
                        Soon
                      </span>
                    )}
                  </div>

                  <span
                    className={
                      'block text-[9px] uppercase tracking-[0.12em] transition-colors duration-300 md:text-[10px] ' +
                      (soon
                        ? 'text-mute/60'
                        : 'text-mute group-hover:text-ac')
                    }
                  >
                    {d.name}
                  </span>
                </>
              );

              return soon ? (
                <div
                  key={d.id}
                  aria-disabled="true"
                  title="Р РЋР С”Р С•РЎР‚Р С• Р С•РЎвЂљР С”РЎР‚РЎвЂ№РЎвЂљР С‘Р Вµ"
                  className="group w-[76px] shrink-0 cursor-not-allowed text-center opacity-70 md:w-28"
                >
                  {content}
                </div>
              ) : (
                <Link
                  key={d.id}
                  href={`/catalog?d=${d.id}`}
                  className="group w-[76px] shrink-0 text-center md:w-28"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="grid gap-5 border-b border-line pb-10 md:grid-cols-[1fr_auto] md:items-end md:gap-10 md:pb-14">
          <div>
            <p className="mb-4 text-[9px] uppercase tracking-[0.3em] text-ac">
              The L Vision edit
            </p>

            <h2 className="max-w-3xl text-4xl font-light leading-[1.12] tracking-[-0.055em] md:text-6xl lg:text-7xl">
              Р РЋРЎвЂљР С‘Р В»РЎРЉ Р Р…Р В°РЎвЂЎР С‘Р Р…Р В°Р ВµРЎвЂљРЎРѓРЎРЏ
              <span className="block text-ac">РЎРѓ Р Т‘Р ВµРЎвЂљР В°Р В»Р ВµР в„–.</span>
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-7 text-mute md:text-right">
            Р С›РЎвЂљР С”РЎР‚Р С•Р в„–РЎвЂљР Вµ Р С”Р С•Р В»Р В»Р ВµР С”РЎвЂ Р С‘Р С‘ L Vision Р С‘ Р Р…Р В°Р в„–Р Т‘Р С‘РЎвЂљР Вµ Р Т‘Р ВµРЎвЂљР В°Р В»Р С‘, Р С”Р С•РЎвЂљР С•РЎР‚РЎвЂ№Р Вµ Р С—Р С•Р Т‘РЎвЂЎР ВµРЎР‚Р С”Р Р…РЎС“РЎвЂљ
            Р Р†Р В°РЎв‚¬ Р С‘Р Р…Р Т‘Р С‘Р Р†Р С‘Р Т‘РЎС“Р В°Р В»РЎРЉР Р…РЎвЂ№Р в„– РЎРѓРЎвЂљР С‘Р В»РЎРЉ.
          </p>
        </div>
      </section>

      {/* NOVINKALAR */}
      {nw.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-14 md:pb-20">
          <SectionHeading
            eyebrow="Р СњР ВµР Т‘Р В°Р Р†Р Р…Р С• Р Р† Р С”Р С•Р В»Р В»Р ВµР С”РЎвЂ Р С‘Р С‘ / 01"
            title="Р СњР С•Р Р†Р С‘Р Р…Р С”Р С‘"
            href="/catalog"
          />

          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5 md:gap-y-10">
            {nw.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      {/* ASOSIY KATEGORIYALAR */}
      <section className="border-y border-line bg-[var(--surf)]">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-20">
          <SectionHeading
            eyebrow="Р С›РЎвЂљР С”РЎР‚Р С•Р в„–РЎвЂљР Вµ Р Т‘Р В»РЎРЏ РЎРѓР ВµР В±РЎРЏ / 02"
            title="Р вЂњР В»Р В°Р Р†Р Р…РЎвЂ№Р Вµ РЎР‚Р В°Р В·Р Т‘Р ВµР В»РЎвЂ№"
            href="/catalog"
          />

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {DEPTS.map((d, index) => {
              const soon = isComingSoon(d.id);

              const card = (
                <div className="group relative block overflow-hidden bg-bg">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Art
                      file={`dept-${d.id}`}
                      dept={d.id}
                      alt={d.name}
                      className="aspect-[4/3]"
                    />

                    {/* Rasm ustidagi gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

                    {/* Oltin ramka */}
                    <div className="absolute inset-2 border border-white/[0.08] transition-colors duration-500 group-hover:border-[var(--gold-border)]" />

                    <span className="absolute left-3 top-3 text-[9px] tracking-[0.2em] text-white/80 md:left-5 md:top-5">
                      0{index + 1}
                    </span>

                    {!soon && (
                      <ArrowUpRight
                        size={19}
                        strokeWidth={1.2}
                        className="absolute right-3 top-3 -translate-x-1 -translate-y-1 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 md:right-5 md:top-5"
                      />
                    )}

                    {/* Coming Soon overlay */}
                    {soon && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/55 px-2 text-center backdrop-blur-[2px]">
                        <div className="mb-3 grid h-10 w-10 place-items-center rounded-full border border-[var(--gold-border)] text-ac">
                          <LockKeyhole size={17} strokeWidth={1.2} />
                        </div>

                        <span className="border border-[var(--gold-border)] bg-black/30 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-ac sm:px-5 sm:text-[11px]">
                          Coming Soon
                        </span>

                        <p className="mt-3 text-[8px] uppercase tracking-[0.13em] text-white/60">
                          Р РЋР С”Р С•РЎР‚Р С• Р С•РЎвЂљР С”РЎР‚РЎвЂ№РЎвЂљР С‘Р Вµ
                        </p>
                      </div>
                    )}

                    {/* Kategoriya ma'lumotlari */}
                    <div className="absolute inset-x-0 bottom-0 z-20 p-3 md:p-5">
                      <p className="mb-2 text-[8px] uppercase tracking-[0.22em] text-white/60 md:text-[9px]">
                        {soon ? 'Coming soon collection' : 'L Vision collection'}
                      </p>

                      <h3 className="text-sm font-light tracking-[0.04em] text-white md:text-xl">
                        {d.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-[10px] leading-5 text-white/65 md:text-xs">
                        {d.sub}
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.17em] text-white/90">
                        <span>
                          {soon ? 'Р РЋР С”Р С•РЎР‚Р С• Р С•РЎвЂљР С”РЎР‚РЎвЂ№РЎвЂљР С‘Р Вµ' : 'Р С›РЎвЂљР С”РЎР‚РЎвЂ№РЎвЂљРЎРЉ РЎР‚Р В°Р В·Р Т‘Р ВµР В»'}
                        </span>

                        {!soon && (
                          <MoveRight
                            size={13}
                            className="transition-transform duration-300 group-hover:translate-x-1.5"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );

              return soon ? (
                <div
                  key={d.id}
                  aria-disabled="true"
                  title="Р РЋР С”Р С•РЎР‚Р С• Р С•РЎвЂљР С”РЎР‚РЎвЂ№РЎвЂљР С‘Р Вµ"
                  className="cursor-not-allowed select-none"
                >
                  {card}
                </div>
              ) : (
                <Link
                  key={d.id}
                  href={`/catalog?d=${d.id}`}
                  className="block"
                >
                  {card}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* TANLANGAN MAHSULOTLAR */}
      {sale.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
          <SectionHeading
            eyebrow="Р вЂ™РЎвЂ№Р В±Р С•РЎР‚ L Vision / 03"
            title="Р СџР С•Р Т‘Р В±Р С•РЎР‚Р С”Р В°"
            href="/catalog"
          />

          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5 md:gap-y-10">
            {sale.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      {/* AFZALLIKLAR */}
      <section className="mx-auto max-w-7xl px-5 pb-14 pt-4 md:pb-20">
        <div className="border-y border-line">
          <div className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
            {benefits.map(({ Icon, number, title, description }) => (
              <div
                key={number}
                className="group relative p-6 transition-colors duration-500 hover:bg-[var(--gold-soft)] md:p-8 lg:p-10"
              >
                <div className="mb-8 flex items-center justify-between">
                  <Icon
                    size={22}
                    strokeWidth={1.2}
                    className="text-ac transition-transform duration-500 group-hover:scale-110"
                  />

                  <span className="text-[9px] tracking-[0.2em] text-mute">
                    {number} / 03
                  </span>
                </div>

                <h3 className="text-base font-normal tracking-wide md:text-lg">
                  {title}
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-mute">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PASTKI CHAQIRIQ */}
        <div className="flex flex-col gap-5 py-10 md:flex-row md:items-end md:justify-between md:py-14">
          <div>
            <p className="mb-3 text-[9px] uppercase tracking-[0.28em] text-ac">
              Your style. Your choice.
            </p>

            <h2 className="text-3xl font-light tracking-[-0.04em] md:text-5xl">
              Р СњР В°Р в„–Р Т‘Р С‘РЎвЂљР Вµ РЎРѓР Р†Р С•РЎвЂ.
            </h2>
          </div>

          <Link
            href="/catalog"
            className="btn group self-start md:self-auto"
          >
            <span>Р вЂ™ Р С”Р В°РЎвЂљР В°Р В»Р С•Р С–</span>
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}