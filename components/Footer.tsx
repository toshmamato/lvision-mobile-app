import Link from 'next/link';
import {DEPTS} from '@/lib/depts';
import Reveal from './Reveal';
import Year from './Year';

/* Faqat loyihada mavjud sahifalar. About / Services / Contact sahifalari yo'q — o'ylab topilmagan. */
const NAV=[{h:'/',l:'Главная'},{h:'/catalog',l:'Каталог'},{h:'/fav',l:'Избранное'},{h:'/profile',l:'Мои заказы'}];
const INFO=['Заказ по номеру телефона','Оплата при получении','Стандартная и экспресс-доставка'];
const H=({children}:{children:string})=><h2 className="mb-5 text-xs font-medium uppercase tracking-[.2em] text-fg">{children}</h2>;

export default function Footer(){
  return <footer className="ft-bg relative mt-24 overflow-hidden border-t border-line">
    <div className="mx-auto max-w-7xl px-5 pt-16">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1.2fr_1fr_1fr]">
        {/* A. Brend */}
        <div className="max-w-sm">
          <Link href="/" className="inline-block text-lg font-light tracking-[.35em]" aria-label="L Vision — на главную">L <b className="font-semibold">VISION</b></Link>
          <p className="mt-4 text-sm leading-relaxed text-mute">Четыре направления под одним именем Inoshkins: одежда, кольца и подарки, цветы и кофе. Оформление заказа — по номеру телефона, оплата при получении.</p>
        </div>

        {/* B. Catalog */}
        <nav aria-label="Каталог">
          <H>Catalog</H>
          <ul className="space-y-3 text-sm text-mute">
            <li><Link href="/catalog" className="lnk">Весь каталог</Link></li>
            {DEPTS.map(d=><li key={d.id}><Link href={`/catalog?d=${d.id}`} className="lnk">{d.name}</Link><span className="mt-0.5 block text-xs opacity-70">{d.sub}</span></li>)}
          </ul>
        </nav>

        {/* C. Navigation */}
        <nav aria-label="Навигация">
          <H>Navigation</H>
          <ul className="space-y-3 text-sm text-mute">{NAV.map(n=><li key={n.h}><Link href={n.h} className="lnk">{n.l}</Link></li>)}</ul>
        </nav>

        {/* D. Как заказать (контактных данных в проекте нет — не выдумываем) */}
        <div>
          <H>Как заказать</H>
          <ul className="space-y-3 text-sm text-mute">{INFO.map(t=><li key={t}>{t}</li>)}</ul>
        </div>
      </div>

      {/* Katta L Vision wordmark */}
      <Reveal className="wm-wrap mt-16 flex justify-center md:mt-20">
        <p className="wm" aria-label="L Vision"><span className="wm-l" aria-hidden="true">L</span><span className="wm-t" aria-hidden="true">Vision</span></p>
      </Reveal>

      {/* E. Copyright */}
      <div className="flex flex-col items-center justify-between gap-2 border-t border-line py-6 text-xs text-mute sm:flex-row">
        <p>© <Year/> L Vision by Inoshkins. Все права защищены.</p>
        <p>Одежда · Кольца · Цветы · Кофе</p>
      </div>
    </div>
  </footer>}
