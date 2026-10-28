
'use client';

import Link from 'next/link';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Heart,
  ShoppingBag,
  Search,
  User,
  LayoutDashboard,
} from 'lucide-react';
import { Suspense } from 'react';

import { useStore } from '@/lib/store';
import { useMounted } from '@/lib/useMounted';
import { DEPTS } from '@/lib/depts';
import { toggleTheme, useTheme } from '@/lib/theme';

const iconButton =
  'group relative grid h-10 w-10 shrink-0 place-items-center rounded-full text-mute transition-all duration-300 hover:bg-[var(--gold-soft)] hover:text-[var(--g2)] active:scale-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--g2)]';

function Badge({ n }: { n: number }) {
  return (
    <motion.i
      key={n}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute -right-0.5 -top-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-full border border-bg bg-[var(--g2)] px-1 text-[9px] font-semibold not-italic leading-none text-[#100d06]"
    >
      {n}
    </motion.i>
  );
}

function Nav() {
  const pathname = usePathname();
  const department = useSearchParams().get('d');

  const active = (href: string, dept?: string) => {
    if (dept) {
      return pathname === '/catalog' && department === dept;
    }

    if (href === '/') {
      return pathname === '/';
    }

    if (href === '/catalog') {
      return pathname === '/catalog' && !department;
    }

    return pathname.startsWith(href);
  };

  const linkClass = (isActive: boolean) =>
    'relative whitespace-nowrap py-2 text-[10px] uppercase tracking-[0.13em] transition-colors duration-300 hover:text-[var(--g2)] ' +
    (isActive ? 'text-[var(--g2)]' : 'text-mute');

  return (
    <nav
      aria-label="Основная навигация"
      className="hidden items-center gap-5 lg:flex xl:gap-7"
    >
      <Link
        href="/"
        aria-current={active('/') ? 'page' : undefined}
        className={linkClass(active('/'))}
      >
        Главная
        {active('/') && (
          <span className="absolute inset-x-0 -bottom-[18px] h-px bg-[var(--g2)]" />
        )}
      </Link>

      <Link
        href="/catalog"
        aria-current={active('/catalog') ? 'page' : undefined}
        className={linkClass(active('/catalog'))}
      >
        Каталог
        {active('/catalog') && (
          <span className="absolute inset-x-0 -bottom-[18px] h-px bg-[var(--g2)]" />
        )}
      </Link>

      {DEPTS.map((dept) => {
        const selected = active('/catalog', dept.id);

        return (
          <Link
            key={dept.id}
            href={`/catalog?d=${dept.id}`}
            aria-current={selected ? 'page' : undefined}
            className={linkClass(selected) + ' hidden xl:inline-block'}
          >
            {dept.name}
            {selected && (
              <span className="absolute inset-x-0 -bottom-[18px] h-px bg-[var(--g2)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const department = useSearchParams().get('d');

  const itemClass =
    'shrink-0 border-b pb-1 text-[9px] uppercase tracking-[0.16em] transition-colors duration-300';

  return (
    <>
      <Link
        href="/"
        aria-current={pathname === '/' ? 'page' : undefined}
        className={
          itemClass +
          ' ' +
          (pathname === '/'
            ? 'border-[var(--g2)] text-[var(--g2)]'
            : 'border-transparent text-mute hover:text-[var(--g2)]')
        }
      >
        Главная
      </Link>

      <Link
        href="/catalog"
        aria-current={
          pathname === '/catalog' && !department ? 'page' : undefined
        }
        className={
          itemClass +
          ' ' +
          (pathname === '/catalog' && !department
            ? 'border-[var(--g2)] text-[var(--g2)]'
            : 'border-transparent text-mute hover:text-[var(--g2)]')
        }
      >
        Каталог
      </Link>

      {DEPTS.map((dept) => {
        const selected =
          pathname === '/catalog' && department === dept.id;

        return (
          <Link
            key={dept.id}
            href={`/catalog?d=${dept.id}`}
            aria-current={selected ? 'page' : undefined}
            className={
              itemClass +
              ' ' +
              (selected
                ? 'border-[var(--g2)] text-[var(--g2)]'
                : 'border-transparent text-mute hover:text-[var(--g2)]')
            }
          >
            {dept.name}
          </Link>
        );
      })}
    </>
  );
}

function NavFallback() {
  return <div className="hidden h-5 lg:block" aria-hidden="true" />;
}

export default function Header() {
  const mounted = useMounted();
  const router = useRouter();
  const theme = useTheme();

  const {
    cart,
    fav,
    user,
    setOpen,
    setSearch,
    setLogin,
  } = useStore();

  const cartCount = mounted
    ? cart.reduce((sum, item) => sum + item.qty, 0)
    : 0;

  const favCount = mounted ? fav.length : 0;
  const dark = theme === 'dark';

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-2xl transition-colors duration-300">
      {/* Nafis oltin chiziq */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--g2)]/50 to-transparent"
      />

      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 lg:h-[76px] lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          aria-label="L Vision — главная"
          className="group flex shrink-0 items-center gap-2 sm:gap-3"
        >
          <span className="grid h-9 w-9 place-items-center border border-[var(--gold-border)] text-sm font-light tracking-[-0.08em] text-ac transition-all duration-300 group-hover:border-[var(--g2)] group-hover:bg-[var(--gold-soft)] sm:h-10 sm:w-10">
            LV
          </span>

          <span className="flex flex-col gap-1">
            <span className="text-[11px] font-light leading-none tracking-[0.16em] text-fg transition-colors group-hover:text-[var(--g1)] sm:text-sm sm:tracking-[0.23em]">
              L VISION
            </span>

            <span className="hidden text-[8px] uppercase leading-none tracking-[0.2em] text-mute sm:block">
              Curated lifestyle
            </span>
          </span>
        </Link>

        {/* Desktop navigatsiya */}
        <Suspense fallback={<NavFallback />}>
          <Nav />
        </Suspense>

        {/* Tugmalar */}
        <div className="flex shrink-0 items-center gap-0 sm:gap-1">
          {/* Qidiruv */}
          <button
            type="button"
            aria-label="Поиск"
            title="Поиск"
            onClick={() => setSearch(true)}
            className={iconButton}
          >
            <Search
              size={18}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </button>

          {/* Dark / light mode */}
          <button
            type="button"
            aria-label={
              dark
                ? 'Включить светлую тему'
                : 'Включить тёмную тему'
            }
            title="Тема оформления"
            onClick={toggleTheme}
            className={iconButton}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -70, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 70, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                {dark ? (
                  <Sun size={18} strokeWidth={1.5} />
                ) : (
                  <Moon size={18} strokeWidth={1.5} />
                )}
              </motion.span>
            </AnimatePresence>
          </button>

          {/* Sevimlilar */}
          <Link
            href="/fav"
            aria-label={`Избранное${favCount ? `: ${favCount}` : ''}`}
            title="Избранное"
            className={iconButton}
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            {favCount > 0 && <Badge n={favCount} />}
          </Link>

          {/* Profil */}
          <button
            type="button"
            aria-label="Профиль"
            title="Профиль"
            onClick={() =>
              user ? router.push('/profile') : setLogin(true)
            }
            className={iconButton + ' hidden md:grid'}
          >
            <User
              size={18}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </button>

          {/* Savat */}
          <button
            type="button"
            aria-label={`Корзина${cartCount ? `: ${cartCount}` : ''}`}
            title="Корзина"
            onClick={() => setOpen(true)}
            className={iconButton}
          >
            <ShoppingBag
              size={18}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            {cartCount > 0 && <Badge n={cartCount} />}
          </button>

          {/* ADMIN PANEL — savat yonida */}
          <Link
            href="/admin"
            aria-label="Админ-панель"
            title="Админ-панель"
            className={
              iconButton +
              ' ml-1 border border-[var(--gold-border)] text-ac hover:bg-[var(--gold-soft)]'
            }
          >
            <LayoutDashboard
              size={18}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </Link>

          {/* Desktop uchun katalog tugmasi */}
          <Link
            href="/catalog"
            className="ml-1 hidden h-10 items-center gap-2 border border-[var(--gold-border)] px-3 text-[9px] uppercase tracking-[0.12em] text-fg transition-all duration-300 hover:bg-[var(--gold-soft)] hover:text-[var(--g1)] xl:flex"
          >
            Каталог
          </Link>
        </div>
      </div>

      {/* Mobil kategoriya menyusi */}
      <div className="border-t border-line/70 lg:hidden">
        <nav
          aria-label="Мобильная навигация"
          className="mx-auto flex max-w-[1600px] items-center gap-6 overflow-x-auto px-5 py-3 sm:justify-center sm:gap-8"
        >
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
