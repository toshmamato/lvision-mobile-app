
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  CheckCircle2,
  MapPin,
  Printer,
  ShoppingBag,
  Truck,
  X,
  ArrowRight,
} from 'lucide-react';

import { useStore, type Line } from '@/lib/store';
import { useMounted } from '@/lib/useMounted';
import { totals, DEL0 } from '@/lib/totals';
import { fmt } from '@/lib/format';

type Receipt = {
  no: string;
  name: string;
  phone: string;
  address: string;
  delivery: 'std' | 'exp';
  items: Line[];
  subtotal: number;
  discount: number;
  deliveryCost: number;
  total: number;
};

export default function Checkout() {
  const mounted = useMounted();

  const { cart, promo, clear, user, setLogin } = useStore();

  const [f, setF] = useState({ name: '', address: '' });
  const [del, setDel] = useState<'std' | 'exp'>('std');
  const [D, setD] = useState(DEL0);
  const [er, setEr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [fail, setFail] = useState('');
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then(setD)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user?.name && !f.name) {
      setF((x) => ({ ...x, name: user.name }));
    }
  }, [user, f.name]);

  const T = totals(cart, promo, D, del);

  async function submit() {
    const errors: Record<string, string> = {};

    if (f.name.trim().length < 3) {
      errors.name = 'Введите имя, минимум 3 символа';
    }

    if (f.address.trim().length < 6) {
      errors.address = 'Укажите полный адрес доставки';
    }

    setEr(errors);

    if (Object.keys(errors).length) return;

    setBusy(true);
    setFail('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...f,
          delivery: del,
          promo: promo?.code || '',
          items: cart.map((c) => ({
            id: c.id,
            size: c.size,
            qty: c.qty,
          })),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        setLogin(true);
        setFail('Сначала войдите по номеру телефона.');
        return;
      }

      if (!response.ok) {
        setFail(
          /out_of_stock/i.test(data.error || '')
            ? 'Некоторые товары закончились. Обновите корзину.'
            : 'Не удалось оформить заказ. Попробуйте ещё раз.'
        );
        return;
      }

      const orderNo = String(data.no ?? 'Подтверждён');

      // Buyurtma muvaffaqiyatli bo'lgandagina chek ma'lumotlarini saqlaymiz.
      setReceipt({
        no: orderNo,
        name: f.name.trim(),
        phone: user?.phone || '',
        address: f.address.trim(),
        delivery: del,
        items: cart.map((item) => ({ ...item })),
        subtotal: T.sub,
        discount: T.d,
        deliveryCost: T.dl,
        total: T.t,
      });

      setDone(orderNo);
      clear();
    } catch {
      setFail(
        'Сервер недоступен. Проверьте подключение и попробуйте снова.'
      );
    } finally {
      setBusy(false);
    }
  }

  // PREMIUM ORDER RECEIPT MODAL
  if (done && receipt) {
    return (
      <div className="fixed inset-0 z-[500] flex items-start justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:items-center sm:p-6">
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="receipt-title"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="receipt-print-area my-auto w-full max-w-xl overflow-hidden border border-[var(--gold-border)] bg-bg shadow-[0_25px_100px_rgba(0,0,0,.55)]"
        >
          {/* Brend sarlavhasi */}
          <div className="relative overflow-hidden border-b border-line px-5 py-7 text-center sm:px-9 sm:py-9">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,var(--gold-soft),transparent_70%)]" />

            <button
              type="button"
              onClick={() => {
                setDone(null);
                setReceipt(null);
              }}
              aria-label="Закрыть чек"
              className="no-print absolute right-4 top-4 grid h-9 w-9 place-items-center border border-line text-mute transition-colors hover:border-[var(--g2)] hover:text-ac"
            >
              <X size={17} />
            </button>

            <div className="relative mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border border-[var(--gold-border)] text-ac">
              <CheckCircle2 size={34} strokeWidth={1.2} />
            </div>

            <p className="relative mb-3 text-[9px] uppercase tracking-[0.3em] text-ac">
              L Vision · Order confirmation
            </p>

            <h1
              id="receipt-title"
              className="relative text-3xl font-light tracking-[-0.05em] sm:text-4xl"
            >
              Заказ принят<span className="text-ac">.</span>
            </h1>

            <p className="relative mt-3 text-sm leading-6 text-mute">
              Спасибо за покупку! Мы свяжемся с вами для подтверждения заказа.
            </p>

            <div className="relative mt-5 inline-flex items-center gap-3 border border-[var(--gold-border)] px-4 py-2.5">
              <span className="text-[9px] uppercase tracking-[0.17em] text-mute">
                Заказ №
              </span>
              <span className="text-sm tracking-wider text-ac">
                {receipt.no}
              </span>
            </div>
          </div>

          {/* Xaridor va yetkazib berish */}
          <div className="grid gap-5 border-b border-line px-5 py-5 sm:grid-cols-2 sm:px-9">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-ac" />

              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.16em] text-mute">
                  Получатель
                </p>

                <p className="mt-2 break-words text-sm">
                  {receipt.name}
                </p>

                <p className="mt-1 break-words text-xs leading-5 text-mute">
                  {receipt.address}
                </p>

                <p className="mt-1 break-words text-xs text-mute">
                  {receipt.phone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck size={18} className="mt-0.5 shrink-0 text-ac" />

              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] text-mute">
                  Доставка
                </p>

                <p className="mt-2 text-sm">
                  {receipt.delivery === 'exp'
                    ? 'Экспресс-доставка'
                    : 'Стандартная доставка'}
                </p>

                <p className="mt-1 text-xs leading-5 text-mute">
                  Оплата наличными при получении
                </p>
              </div>
            </div>
          </div>

          {/* Buyurtma tarkibi */}
          <div className="px-5 py-6 sm:px-9">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-[9px] uppercase tracking-[0.2em] text-ac">
                Состав заказа
              </p>

              <ShoppingBag size={17} className="text-mute" />
            </div>

            <div className="space-y-4">
              {receipt.items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="break-words text-sm">{item.name}</p>

                    <p className="mt-1 text-xs leading-5 text-mute">
                      {item.size !== 'ONE'
                        ? `Размер: ${item.size} · `
                        : ''}
                      {item.qty} шт. × {fmt(item.price)}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm tabular-nums">
                    {fmt(item.price * item.qty)}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-5 border-t border-dashed border-line" />

            {/* Hisob-kitob */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between gap-4 text-mute">
                <span>Подытог</span>
                <span className="text-right tabular-nums">
                  {fmt(receipt.subtotal)}
                </span>
              </div>

              {receipt.discount > 0 && (
                <div className="flex justify-between gap-4 text-emerald-500">
                  <span>Скидка</span>
                  <span className="text-right tabular-nums">
                    −{fmt(receipt.discount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4 text-mute">
                <span>Доставка</span>
                <span className="text-right tabular-nums">
                  {receipt.deliveryCost === 0
                    ? 'Бесплатно'
                    : fmt(receipt.deliveryCost)}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between gap-4 border-t border-[var(--gold-border)] pt-5">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-mute">
                  Итого к оплате
                </p>

                <p className="mt-2 text-[9px] text-mute">
                  В узбекских сумах
                </p>
              </div>

              <p className="text-right text-2xl font-light tracking-[-0.04em] text-ac sm:text-3xl">
                {fmt(receipt.total)}
              </p>
            </div>

            <div className="mt-6 flex items-start gap-3 border border-line bg-surf p-3">
              <CheckCircle2
                size={16}
                className="mt-0.5 shrink-0 text-ac"
              />

              <p className="text-xs leading-5 text-mute">
                Заказ оформлен. Сохраните номер заказа для обращения
                по вопросам покупки.
              </p>
            </div>

            {/* Modal tugmalari */}
            <div className="no-print mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn o w-full"
              >
                <Printer size={15} />
                Распечатать чек
              </button>

              <Link
                href="/profile"
                className="btn w-full"
              >
                Мои заказы
                <ArrowRight size={15} />
              </Link>
            </div>

            <Link
              href="/catalog"
              className="no-print lnk mt-5 flex justify-center text-[9px] uppercase tracking-[0.17em] text-mute hover:text-ac"
            >
              Вернуться в каталог
            </Link>
          </div>

          {/* Footer */}
          <div className="border-t border-line px-5 py-4 text-center sm:px-9">
            <p className="text-[9px] tracking-[0.3em] text-ac">
              L VISION
            </p>

            <p className="mt-1 text-[8px] uppercase tracking-[0.15em] text-mute">
              Curated lifestyle · By Inoshkins
            </p>
          </div>
        </motion.div>

        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden !important;
            }

            .receipt-print-area,
            .receipt-print-area * {
              visibility: visible !important;
            }

            .receipt-print-area {
              position: absolute !important;
              inset: 0 !important;
              width: 100% !important;
              max-width: none !important;
              margin: 0 !important;
              border: 1px solid #ccc !important;
              box-shadow: none !important;
              background: white !important;
              color: #111 !important;
              overflow: visible !important;
            }

            .receipt-print-area .no-print {
              display: none !important;
            }

            .receipt-print-area * {
              color: #111 !important;
              border-color: #ddd !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // Savat bo'sh
  if (mounted && !cart.length) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center border border-line text-ac">
          <ShoppingBag size={25} strokeWidth={1.2} />
        </div>

        <h1 className="mb-3 text-3xl font-light">
          Корзина пуста
        </h1>

        <p className="mb-6 text-sm text-mute">
          Добавьте товары в корзину, чтобы оформить заказ.
        </p>

        <Link href="/catalog" className="btn">
          В каталог
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  // Login kerak
  if (mounted && !user) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <Phone className="mx-auto mb-4 text-ac" size={32} />

        <h1 className="mb-2 text-3xl font-light">
          Нужен номер телефона
        </h1>

        <p className="mb-6 text-sm leading-6 text-mute">
          Войдите по номеру телефона, чтобы оформить заказ.
        </p>

        <button className="btn" onClick={() => setLogin(true)}>
          Войти по номеру
        </button>
      </div>
    );
  }

  // Checkout sahifasi
  return (
    <main className="mx-auto max-w-3xl px-5 py-8 md:py-14">
      <div className="mb-8 border-b border-line pb-6">
        <p className="mb-3 text-[9px] uppercase tracking-[0.25em] text-ac">
          L Vision · Checkout
        </p>

        <h1 className="text-3xl font-light tracking-[-0.05em] md:text-5xl">
          Оформление заказа<span className="text-ac">.</span>
        </h1>

        <p className="mt-3 text-sm leading-6 text-mute">
          Проверьте данные доставки и состав заказа перед подтверждением.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-mute">
              Телефон
            </span>

            <input
              readOnly
              value={user?.phone || ''}
              aria-label="Телефон"
              className="opacity-70"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-mute">
              Имя и фамилия
            </span>

            <input
              placeholder="Ваше имя"
              value={f.name}
              onChange={(e) =>
                setF({ ...f, name: e.target.value })
              }
            />

            <p className="mt-1 min-h-4 text-xs text-red-500">
              {er.name}
            </p>
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-[9px] uppercase tracking-[0.15em] text-mute">
            Адрес доставки
          </span>

          <input
            placeholder="Город, улица, дом"
            value={f.address}
            onChange={(e) =>
              setF({ ...f, address: e.target.value })
            }
          />

          <p className="mt-1 min-h-4 text-xs text-red-500">
            {er.address}
          </p>
        </label>
      </div>

      <section className="mt-8">
        <p className="mb-3 text-[9px] uppercase tracking-[0.2em] text-ac">
          Способ доставки
        </p>

        {(
          [
            ['std', 'Стандартная доставка', D.std],
            ['exp', 'Экспресс-доставка', D.exp],
          ] as const
        ).map(([key, label, value]) => (
          <label
            key={key}
            className={
              'mb-2 flex cursor-pointer items-center gap-3 border p-4 transition-colors ' +
              (del === key
                ? 'border-[var(--gold-border)] bg-[var(--gold-soft)]'
                : 'border-line hover:border-[var(--gold-border)]')
            }
          >
            <input
              type="radio"
              name="delivery"
              className="!w-auto"
              checked={del === key}
              onChange={() => setDel(key)}
            />

            <span className="flex-1 text-sm">{label}</span>

            <span className="text-right text-xs text-ac">
              {fmt(value)}

              {key === 'std' && D.free > 0 && (
                <span className="mt-1 block text-[9px] text-mute">
                  Бесплатно от {fmt(D.free)}
                </span>
              )}
            </span>
          </label>
        ))}
      </section>

      <section className="mt-7">
        <p className="mb-3 text-[9px] uppercase tracking-[0.2em] text-ac">
          Оплата
        </p>

        <div className="flex items-center gap-3 border border-line p-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center border border-[var(--gold-border)] text-ac">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <p className="text-sm">Наличными при получении</p>
            <p className="mt-1 text-xs text-mute">
              Оплата после получения заказа.
            </p>
          </div>
        </div>
      </section>

      {/* Order summary */}
      <section className="mt-8 border border-line bg-surf p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-ac">
              Order summary
            </p>
            <h2 className="mt-2 text-xl font-light">
              Ваш заказ
            </h2>
          </div>

          <ShoppingBag size={21} className="text-mute" />
        </div>

        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="break-words text-sm">{item.name}</p>

                <p className="mt-1 text-xs text-mute">
                  {item.size !== 'ONE' ? `${item.size} · ` : ''}
                  {item.qty} шт.
                </p>
              </div>

              <p className="shrink-0 text-sm">
                {fmt(item.price * item.qty)}
              </p>
            </div>
          ))}
        </div>

        <div className="my-5 border-t border-dashed border-line" />

        <div className="space-y-3 text-sm">
          <p className="flex justify-between gap-4 text-mute">
            <span>Подытог</span>
            <span>{fmt(T.sub)}</span>
          </p>

          {T.d > 0 && (
            <p className="flex justify-between gap-4 text-emerald-500">
              <span>Промокод</span>
              <span>−{fmt(T.d)}</span>
            </p>
          )}

          <p className="flex justify-between gap-4 text-mute">
            <span>Доставка</span>
            <span>{T.dl === 0 ? 'Бесплатно' : fmt(T.dl)}</span>
          </p>

          <div className="flex items-end justify-between gap-4 border-t border-[var(--gold-border)] pt-5">
            <span className="text-sm">Итого</span>

            <span className="text-right text-2xl font-light text-ac">
              {fmt(T.t)}
            </span>
          </div>
        </div>
      </section>

      {fail && (
        <p
          role="alert"
          className="mt-5 border border-red-500/25 bg-red-500/5 p-4 text-sm leading-6 text-red-400"
        >
          {fail}
        </p>
      )}

      <button
        className="btn mt-6 w-full"
        disabled={busy || !cart.length}
        onClick={submit}
      >
        {busy ? 'Оформляем заказ…' : 'Подтвердить заказ'}
        {!busy && <ArrowRight size={16} />}
      </button>

      <p className="mt-4 text-center text-[9px] leading-5 text-mute">
        Нажимая кнопку, вы подтверждаете данные заказа и адрес доставки.
      </p>
    </main>
  );
}
