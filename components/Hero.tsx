
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

const wrap = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const up = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease },
  },
};

const mask = {
  hidden: { y: '110%' },
  show: {
    y: 0,
    transition: { duration: 1.05, ease },
  },
};

export default function Hero() {
  const ref = useRef<HTMLElement | null>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();

    element.style.setProperty('--x', `${e.clientX - rect.left}px`);
    element.style.setProperty('--y', `${e.clientY - rect.top}px`);
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="spot relative isolate overflow-hidden border-b border-line bg-bg"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,var(--glow),transparent_70%)] opacity-70"
      />

      <motion.div
        variants={wrap}
        initial="hidden"
        animate="show"
        className="relative mx-auto grid max-w-[1600px] items-center gap-10 px-5 py-10 sm:px-8 md:min-h-[84vh] md:grid-cols-[1.05fr_0.95fr] md:gap-8 md:px-10 md:py-12 lg:gap-14 lg:px-16"
      >
        {/* LEFT: Editorial typography */}
        <div className="relative z-10">
          <motion.div
            variants={up}
            className="mb-7 flex items-center gap-3 md:mb-10"
          >
            <span className="h-px w-8 bg-ac" />

            <p className="text-[9px] uppercase tracking-[0.28em] text-mute md:text-[10px]">
              L Vision · Exclusive collection
            </p>

            <span className="hidden text-[9px] tracking-[0.2em] text-ac sm:inline">
              2026
            </span>
          </motion.div>

          <h1 className="font-light leading-[0.88] tracking-[-0.075em]">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                variants={mask}
                className="shine block text-[clamp(52px,10vw,128px)]"
              >
                DEFINED
              </motion.span>
            </span>

            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                variants={mask}
                className="block text-[clamp(48px,9.5vw,118px)]"
              >
                BY VISION<span className="text-ac">.</span>
              </motion.span>
            </span>
          </h1>

          <motion.div
            variants={up}
            className="mt-7 flex items-start gap-4 md:mt-9"
          >
            <span className="mt-1 h-10 w-px shrink-0 bg-gradient-to-b from-ac to-transparent" />

            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-fg md:text-xs">
                L Vision by Inoshkins
              </p>

              <p className="mt-3 max-w-[340px] text-sm leading-6 text-mute md:text-base md:leading-7">
                Стиль в деталях. Эстетика в каждом выборе.
                Откройте мир L Vision.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={up}
            className="mt-8 flex flex-wrap items-center gap-5 md:mt-10"
          >
            <Link
              href="/catalog"
              className="btn group inline-flex items-center gap-4"
            >
              <span>Открыть каталог</span>

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </Link>

            <Link
              href="/catalog"
              className="lnk inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-mute hover:text-ac"
            >
              Коллекции
              <ArrowRight size={13} />
            </Link>
          </motion.div>

          {/* Editorial footer */}
          <motion.div
            variants={up}
            className="mt-12 hidden max-w-md grid-cols-2 gap-5 border-t border-line pt-5 sm:grid md:mt-16"
          >
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-mute">
                Philosophy
              </p>

              <p className="mt-2 text-xs tracking-wide text-fg">
                Less, but better.
              </p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-mute">
                Collection
              </p>

              <p className="mt-2 text-xs tracking-wide text-fg">
                Curated for you.
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: L VISION STUDIO IMAGE */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 22, scale: 0.97 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 1.1, ease },
            },
          }}
          className="relative mx-auto w-full max-w-[570px] md:ml-auto"
        >
          {/* Gold decorative frame */}
          <div
            aria-hidden="true"
            className="absolute -right-2 -top-2 z-0 h-24 w-24 border-r border-t border-[var(--gold-border)] md:-right-3 md:-top-3 md:h-32 md:w-32"
          />

          {/* Main image */}
          <div className="relative z-10 overflow-hidden border border-line bg-surf p-1">
            <div className="relative overflow-hidden bg-[#f2eee5]">
              <img
                src="/lvision-studio.png"
                alt="L Vision Studio 01 / 26 — The new perspective"
                loading="eager"
                decoding="async"
                className="block h-auto w-full object-contain transition-transform duration-700 hover:scale-[1.015]"
              />
            </div>
          </div>

          {/* Bottom decoration */}
          <div
            aria-hidden="true"
            className="absolute -bottom-3 -left-3 z-0 h-20 w-20 border-b border-l border-[var(--gold-border)] md:-bottom-4 md:-left-4 md:h-28 md:w-28"
          />
        </motion.div>
      </motion.div>

      {/* Bottom strip */}
      <div className="relative border-t border-line">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 sm:px-8 md:px-10 lg:px-16">
          <p className="text-[8px] uppercase tracking-[0.2em] text-mute md:text-[9px]">
            Explore your own style
          </p>

          <Link
            href="/catalog"
            className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-fg transition-colors hover:text-ac"
          >
            Discover more
            <ArrowRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
