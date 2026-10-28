
'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { DEPTS, ALLC, deptOf } from '@/lib/depts';
import { fmt, tot } from '@/lib/format';
import type { Product } from '@/lib/types';

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Image as ImageIcon,
  TrendingUp,
  LogOut,
  Upload,
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Sparkles,
  CircleDollarSign,
  X,
} from 'lucide-react';

const ST = ['Новый', 'Собирается', 'Доставляется', 'Доставлен'];

const inputClass =
  'w-full !rounded-none !border !border-line !bg-bg !px-4 !py-3 !text-sm !text-fg placeholder:!text-mute focus:!border-[var(--g2)] focus:!outline-none';

const selectClass =
  'w-full !rounded-none !border !border-line !bg-bg !px-3 !py-3 !text-sm !text-fg';

const btnPrimary =
  'inline-flex items-center justify-center gap-2 border border-[var(--g2)] bg-[var(--g2)] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#100d06] transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50';

const btnSecondary =
  'inline-flex items-center justify-center gap-2 border border-line px-4 py-3 text-[10px] uppercase tracking-[0.12em] text-fg transition-all duration-300 hover:border-[var(--g2)] hover:bg-[var(--gold-soft)] disabled:opacity-50';

const cardClass = 'border border-line bg-[var(--surf)]';

function SectionTitle({
  eyebrow,
  title,
  count,
  action,
}: {
  eyebrow: string;
  title: string;
  count?: string | number;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-ac">
          {eyebrow}
        </p>

        <h2 className="text-2xl font-light tracking-[-0.04em] md:text-3xl">
          {title}
          {count !== undefined && (
            <span className="ml-3 text-sm text-mute">{count}</span>
          )}
        </h2>
      </div>

      {action}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  Icon,
  index,
}: {
  label: string;
  value: string | number;
  detail: string;
  Icon: typeof Package;
  index: string;
}) {
  return (
    <div
      className={`${cardClass} group relative overflow-hidden p-5 transition-all duration-300 hover:border-[var(--gold-border)] md:p-6`}
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[var(--gold-soft)] blur-2xl transition-transform duration-500 group-hover:scale-150" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center border border-[var(--gold-border)] text-ac">
          <Icon size={19} strokeWidth={1.5} />
        </div>

        <span className="text-[9px] tracking-[0.2em] text-mute">
          {index}
        </span>
      </div>

      <p className="relative mt-7 text-[10px] uppercase tracking-[0.16em] text-mute">
        {label}
      </p>

      <p className="relative mt-2 break-words text-2xl font-light tracking-[-0.04em] md:text-3xl">
        {value}
      </p>

      <p className="relative mt-2 text-xs text-mute">{detail}</p>
    </div>
  );
}

export default function Admin() {
  const [u, setU] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ps, setPs] = useState<Product[]>([]);
  const [msg, setMsg] = useState('');
  const [lg, setLg] = useState({ e: '', p: '' });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [section, setSection] = useState('overview');

  const [n, setN] = useState({
    name: '',
    cat: ALLC[0],
    price: '',
    old: '',
    stock: '',
    desc: '',
  });

  // Ma'lumotlarni Supabase'dan qayta yuklash
  async function load() {
    try {
      const [ordersResult, productsResult] = await Promise.all([
        supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false }),

        supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false }),
      ]);

      if (ordersResult.error || productsResult.error) {
        const error =
          ordersResult.error?.message ||
          productsResult.error?.message ||
          'Данные не загружены';

        console.error('ADMIN LOAD ERROR:', error);
        setMsg('Ошибка загрузки: ' + error);
        return false;
      }

      setOrders(ordersResult.data ?? []);
      setPs((productsResult.data ?? []) as Product[]);

      return true;
    } catch (error) {
      console.error('ADMIN LOAD ERROR:', error);
      setMsg(
        error instanceof Error
          ? 'Ошибка загрузки: ' + error.message
          : 'Не удалось загрузить данные'
      );
      return false;
    }
  }

  // Sessiyani tekshirish
  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!active) return;

        if (error) {
          setMsg('Ошибка авторизации: ' + error.message);
          setReady(true);
          return;
        }

        setU(data.session?.user ?? null);
        setReady(true);

        if (data.session?.user) {
          await load();
        }
      } catch (error) {
        if (active) {
          setMsg(
            error instanceof Error
              ? error.message
              : 'Не удалось проверить сессию'
          );
          setReady(true);
        }
      }
    }

    void initialize();

    return () => {
      active = false;
    };
  }, []);

  // Umumiy Supabase natijasini tekshirish
  async function ok(
    result: { error: { message: string } | null },
    success = 'Сохранено'
  ) {
    if (result.error) {
      console.error('SUPABASE ACTION ERROR:', result.error);
      setMsg('Ошибка: ' + result.error.message);
      return false;
    }

    setMsg(success);
    await load();
    return true;
  }

  // Admin hisobiga kirish
  async function login() {
    if (!lg.e.trim() || !lg.p) {
      setMsg('Введите email и пароль');
      return;
    }

    setLoading(true);
    setMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: lg.e.trim(),
        password: lg.p,
      });

      if (error) {
        console.error('LOGIN ERROR:', error);
        setMsg('Ошибка входа: ' + error.message);
        return;
      }

      setU(data.user);
      setMsg('');
      await load();
    } catch (error) {
      console.error('LOGIN ERROR:', error);

      setMsg(
        error instanceof Error
          ? error.message
          : 'Не удалось выполнить вход'
      );
    } finally {
      setLoading(false);
    }
  }

  // Admin hisobidan chiqish
  async function logout() {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setMsg('Ошибка выхода: ' + error.message);
        return;
      }

      setU(null);
      setOrders([]);
      setPs([]);
      setMsg('');
    } catch (error) {
      setMsg(
        error instanceof Error
          ? error.message
          : 'Не удалось выйти из аккаунта'
      );
    } finally {
      setLoading(false);
    }
  }

  // Yangi mahsulot qo'shish
  async function add() {
    const name = n.name.trim();
    const price = Number(n.price);
    const oldPrice = n.old.trim() === '' ? 0 : Number(n.old);
    const dp = deptOf(n.cat);

    if (!name) {
      setMsg('Введите название товара');
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setMsg('Введите правильную цену товара');
      return;
    }

    if (
      !Number.isFinite(oldPrice) ||
      oldPrice < 0
    ) {
      setMsg('Проверьте старую цену');
      return;
    }

    const quantities = n.stock
      .split(',')
      .map((value) => {
        const trimmed = value.trim();

        if (trimmed === '') return 0;

        const number = Number(trimmed);

        return Number.isFinite(number) && number >= 0
          ? Math.floor(number)
          : NaN;
      });

    if (quantities.some((value) => !Number.isFinite(value))) {
      setMsg('Остатки должны быть неотрицательными числами через запятую');
      return;
    }

    const stock =
      dp === 'lv'
        ? {
            S: quantities[0] ?? 0,
            M: quantities[1] ?? 0,
            L: quantities[2] ?? 0,
            XL: quantities[3] ?? 0,
          }
        : { ONE: quantities[0] ?? 0 };

    setLoading(true);
    setMsg('');

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name,
          category: n.cat,
          dept: dp,
          price,
          old_price: oldPrice > 0 ? oldPrice : null,
          is_new: true,
          stock,
          description: n.desc.trim(),
        })
        .select('*')
        .single();

      if (error) {
        console.error('ADD PRODUCT ERROR:', error);
        setMsg(
          `Товар не добавлен: ${error.message} (код: ${error.code || 'unknown'})`
        );
        return;
      }

      if (!data) {
        setMsg('Supabase не вернул созданный товар');
        return;
      }

      // Yangi mahsulotni darhol interfeysga qo'shamiz
      setPs((current) => [
        data as Product,
        ...current.filter((item) => item.id !== data.id),
      ]);

      setN({
        name: '',
        cat: ALLC[0],
        price: '',
        old: '',
        stock: '',
        desc: '',
      });

      setMsg(`Товар "${data.name}" добавлен. ID: ${data.id}`);

      // Bazadagi natijani yana tekshiramiz
      await load();
    } catch (error) {
      console.error('ADD PRODUCT ERROR:', error);

      setMsg(
        error instanceof Error
          ? 'Ошибка добавления: ' + error.message
          : 'Не удалось добавить товар'
      );
    } finally {
      setLoading(false);
    }
  }

  // Narx va qoldiqni o'zgartirish
  async function edit(p: Product) {
    const keys = Object.keys(p.stock || {});

    const priceInput = prompt('Цена (сум):', String(p.price));
    if (priceInput === null) return;

    const oldInput = prompt(
      'Старая цена (0 — без скидки):',
      String(p.old_price || 0)
    );
    if (oldInput === null) return;

    const stockInput = prompt(
      'Остатки (' + keys.join(', ') + ') через запятую:',
      keys.map((key) => p.stock[key]).join(',')
    );
    if (stockInput === null) return;

    const price = Number(priceInput);
    const oldPrice = Number(oldInput);

    const quantities = stockInput.split(',').map((value) => {
      const trimmed = value.trim();

      if (trimmed === '') return NaN;

      const number = Number(trimmed);

      return Number.isFinite(number) && number >= 0
        ? Math.floor(number)
        : NaN;
    });

    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isFinite(oldPrice) ||
      oldPrice < 0 ||
      quantities.length !== keys.length ||
      quantities.some((value) => !Number.isFinite(value))
    ) {
      setMsg('Проверьте цену и остатки товара');
      return;
    }

    setLoading(true);
    setMsg('');

    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          price,
          old_price: oldPrice > 0 ? oldPrice : null,
          stock: Object.fromEntries(
            keys.map((key, index) => [key, quantities[index]])
          ),
        })
        .eq('id', p.id)
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('PRODUCT UPDATE ERROR:', error);
        setMsg('Ошибка изменения: ' + error.message);
        return;
      }

      if (!data) {
        setMsg(
          'Товар не обновлён. Проверьте права UPDATE и SELECT в Supabase RLS.'
        );
        return;
      }

      setPs((current) =>
        current.map((item) =>
          item.id === p.id ? (data as Product) : item
        )
      );

      setMsg(`Цена сохранена: ${fmt(Number(data.price))}`);
    } catch (error) {
      console.error('PRODUCT UPDATE ERROR:', error);

      setMsg(
        error instanceof Error
          ? error.message
          : 'Не удалось изменить товар'
      );
    } finally {
      setLoading(false);
    }
  }

  // Mahsulot o'chirish
  async function removeProduct(p: Product) {
    if (!confirm(`Удалить товар "${p.name}"?`)) return;

    setLoading(true);
    setMsg('');

    try {
      const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', p.id)
        .select('id');

      if (error) {
        console.error('DELETE PRODUCT ERROR:', error);
        setMsg('Ошибка удаления: ' + error.message);
        return;
      }

      if (!data || data.length === 0) {
        setMsg(
          'Товар не удалён. Проверьте права DELETE в Supabase RLS.'
        );
        return;
      }

      setPs((current) =>
        current.filter((item) => item.id !== p.id)
      );

      setMsg(`Товар "${p.name}" удалён`);
      await load();
    } catch (error) {
      console.error('DELETE PRODUCT ERROR:', error);

      setMsg(
        error instanceof Error
          ? error.message
          : 'Не удалось удалить товар'
      );
    } finally {
      setLoading(false);
    }
  }

  // Rasmni optimallashtirib Supabase Storage'ga yuklash
  async function upload(file: File, name: string) {
    setLoading(true);
    setMsg('');

    try {
      const image = await new Promise<HTMLImageElement>(
        (resolve, reject) => {
          const objectUrl = URL.createObjectURL(file);
          const img = new Image();

          img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(img);
          };

          img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Не удалось открыть изображение'));
          };

          img.src = objectUrl;
        }
      );

      const scale = Math.min(
        1,
        1200 / Math.max(image.width, image.height)
      );

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);

      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Не удалось обработать изображение');
      }

      context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) resolve(result);
            else reject(new Error('Не удалось подготовить изображение'));
          },
          'image/jpeg',
          0.88
        );
      });

      const { error } = await supabase.storage
        .from('photos')
        .upload(name + '.jpg', blob, {
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (error) {
        console.error('PHOTO UPLOAD ERROR:', error);
        setMsg('Ошибка загрузки фото: ' + error.message);
        return;
      }

      setMsg('Фото загружено. Обновите страницу сайта.');
    } catch (error) {
      console.error('PHOTO UPLOAD ERROR:', error);

      setMsg(
        error instanceof Error
          ? error.message
          : 'Не удалось загрузить фото'
      );
    } finally {
      setLoading(false);
    }
  }

  const F = (name: string, label: string) => (
    <label className="group inline-flex cursor-pointer items-center justify-center gap-2 border border-line px-3 py-2.5 text-[9px] uppercase tracking-[0.12em] text-fg transition-all duration-300 hover:border-[var(--g2)] hover:bg-[var(--gold-soft)] hover:text-ac">
      <Upload size={13} />
      <span>{label}</span>

      <input
        type="file"
        accept="image/*"
        hidden
        disabled={loading}
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) void upload(file, name);

          event.currentTarget.value = '';
        }}
      />
    </label>
  );

  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const newOrders = orders.filter(
    (order) => order.status === 'Новый'
  ).length;

  const filteredProducts = ps.filter((p) => {
    const text = query.toLowerCase();

    return (
      p.name.toLowerCase().includes(text) ||
      p.category.toLowerCase().includes(text) ||
      String(p.id).includes(text)
    );
  });

  const cell =
    'border-b border-line px-4 py-4 text-left align-middle text-xs';

  const sideItems = [
    { id: 'overview', label: 'Обзор', Icon: LayoutDashboard },
    { id: 'orders', label: 'Заказы', Icon: ShoppingBag, count: orders.length },
    { id: 'products', label: 'Товары', Icon: Package, count: ps.length },
    { id: 'photos', label: 'Фотографии', Icon: ImageIcon },
  ];

  if (!ready) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-bg px-5">
        <div className="text-center">
          <div className="mx-auto mb-5 h-8 w-8 animate-spin rounded-full border border-line border-t-[var(--g2)]" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-mute">
            L Vision · Загрузка панели
          </p>
        </div>
      </main>
    );
  }

  if (!u) {
    return (
      <main className="relative grid min-h-[85vh] place-items-center overflow-hidden bg-bg px-5 py-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[var(--gold-soft)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[var(--gold-soft)] blur-3xl" />

        <div className="relative w-full max-w-md">
          <div className={`${cardClass} p-7 sm:p-10`}>
            <div className="mb-8 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center border border-[var(--gold-border)] text-lg tracking-tight text-ac">
                LV
              </div>

              <div>
                <p className="text-sm tracking-[0.22em]">L VISION</p>
                <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-mute">
                  Administration
                </p>
              </div>
            </div>

            <div className="mb-8 border-b border-line pb-7">
              <p className="mb-3 text-[9px] uppercase tracking-[0.25em] text-ac">
                Private access
              </p>

              <h1 className="text-3xl font-light tracking-[-0.05em]">
                Вход в панель
              </h1>

              <p className="mt-3 text-sm leading-6 text-mute">
                Войдите в аккаунт сотрудника, чтобы управлять магазином.
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                void login();
              }}
            >
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-[0.16em] text-mute">
                  Email
                </span>

                <input
                  className={inputClass}
                  type="email"
                  autoComplete="username"
                  placeholder="admin@example.com"
                  value={lg.e}
                  onChange={(event) =>
                    setLg({ ...lg, e: event.target.value })
                  }
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-[0.16em] text-mute">
                  Пароль
                </span>

                <input
                  className={inputClass}
                  type="password"
                  autoComplete="current-password"
                  placeholder="Введите пароль"
                  value={lg.p}
                  onChange={(event) =>
                    setLg({ ...lg, p: event.target.value })
                  }
                  required
                />
              </label>

              {msg && (
                <div className="flex items-start gap-2 border border-red-500/30 bg-red-500/5 p-3 text-xs leading-5 text-red-400">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <p>{msg}</p>
                </div>
              )}

              <button
                className={`${btnPrimary} w-full`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <ShieldCheck size={15} />
                )}

                {loading ? 'Вход...' : 'Войти в систему'}
              </button>
            </form>

            <p className="mt-8 text-center text-[9px] tracking-[0.12em] text-mute">
              L VISION · PRIVATE ADMINISTRATION
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center border border-[var(--gold-border)] text-sm text-ac">
              LV
            </div>

            <div>
              <p className="text-xs tracking-[0.2em]">L VISION</p>
              <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-mute">
                Control center
              </p>
            </div>

            <span className="ml-2 hidden border border-[var(--gold-border)] px-2 py-1 text-[8px] uppercase tracking-[0.15em] text-ac sm:inline">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs">{u.email}</p>
              <p className="mt-1 flex items-center justify-end gap-1 text-[9px] text-ac">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Session active
              </p>
            </div>

            <button
              onClick={() => void logout()}
              className={btnSecondary}
              type="button"
              disabled={loading}
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 md:py-10 lg:px-10">
        {/* Sarlavha */}
        <div className="mb-8 flex flex-col justify-between gap-5 lg:mb-10 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-ac">
              <Sparkles size={13} />
              L Vision management
            </div>

            <h1 className="text-3xl font-light tracking-[-0.055em] sm:text-4xl md:text-5xl">
              Панель управления<span className="text-ac">.</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-mute">
              Управление товарами, заказами и визуальным стилем магазина.
            </p>
          </div>

          <button
            onClick={() => {
              setMsg('');
              void load();
            }}
            type="button"
            className={btnSecondary}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Обновить данные
          </button>
        </div>

        {/* Xabarlar */}
        {msg && (
          <div className="mb-6 flex items-start gap-3 border border-line bg-[var(--surf)] p-4 text-sm">
            {msg.startsWith('Ошибка') ||
            msg.startsWith('Не удалось') ||
            msg.includes('не добавлен') ||
            msg.includes('не обновлён') ||
            msg.includes('не удалён') ? (
              <AlertCircle size={17} className="mt-0.5 shrink-0 text-red-400" />
            ) : (
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-ac" />
            )}

            <p className="flex-1 break-words leading-6">{msg}</p>

            <button
              type="button"
              onClick={() => setMsg('')}
              aria-label="Закрыть сообщение"
              className="text-mute transition-colors hover:text-fg"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Bo'lim navigatsiyasi */}
        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-line pb-3">
          {sideItems.map(({ id, label, Icon, count }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSection(id);

                if (id === 'overview') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  document
                    .getElementById(id)
                    ?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                }
              }}
              className={
                'flex shrink-0 items-center gap-2 border px-4 py-3 text-[9px] uppercase tracking-[0.12em] transition-all duration-300 ' +
                (section === id
                  ? 'border-[var(--g2)] bg-[var(--gold-soft)] text-ac'
                  : 'border-line text-mute hover:border-[var(--gold-border)] hover:text-fg')
              }
            >
              <Icon size={14} />
              {label}

              {count !== undefined && (
                <span className="ml-1 text-ac">{count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Statistikalar */}
        <section id="overview" className="mb-12 scroll-mt-28">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
                Overview / 01
              </p>
              <h2 className="mt-2 text-xl font-light">
                Общая статистика
              </h2>
            </div>

            <span className="hidden items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-mute sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live data
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              index="01 / 04"
              label="Общая выручка заказов"
              value={fmt(revenue)}
              detail="Сумма всех загруженных заказов"
              Icon={CircleDollarSign}
            />

            <MetricCard
              index="02 / 04"
              label="Все заказы"
              value={orders.length}
              detail={`${newOrders} новых заказов`}
              Icon={ShoppingBag}
            />

            <MetricCard
              index="03 / 04"
              label="Товары каталога"
              value={ps.length}
              detail="Товаров в базе данных"
              Icon={Package}
            />

            <MetricCard
              index="04 / 04"
              label="Новые заказы"
              value={newOrders}
              detail="Ожидают обработки"
              Icon={Clock3}
            />
          </div>
        </section>

        {/* Buyurtmalar */}
        <section id="orders" className="mb-14 scroll-mt-28">
          <SectionTitle
            eyebrow="Sales / 02"
            title="Заказы"
            count={orders.length}
            action={
              <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-mute">
                <TrendingUp size={14} className="text-ac" />
                Заказы клиентов
              </span>
            }
          />

          <div className={`${cardClass} overflow-hidden`}>
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-4 md:px-5">
              <div>
                <p className="text-xs">Все заказы</p>
                <p className="mt-1 text-[10px] text-mute">
                  Просмотр и обновление статусов
                </p>
              </div>

              <span className="border border-line px-3 py-2 text-[10px] text-ac">
                {orders.length} шт.
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <ShoppingBag
                  size={28}
                  strokeWidth={1}
                  className="mx-auto mb-4 text-mute"
                />
                <p className="text-sm">Заказов пока нет</p>
                <p className="mt-2 text-xs text-mute">
                  Новые заказы появятся здесь.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="bg-[var(--gold-soft)]">
                      {[
                        '№ заказа',
                        'Клиент',
                        'Телефон',
                        'Адрес',
                        'Состав заказа',
                        'Сумма',
                        'Статус',
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="border-b border-line px-4 py-4 text-left text-[9px] font-normal uppercase tracking-[0.14em] text-mute"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.no}
                        className="transition-colors duration-200 hover:bg-[var(--gold-soft)]"
                      >
                        <td className={cell}>
                          <span className="text-ac">#{order.no}</span>
                        </td>

                        <td className={cell}>
                          <p className="min-w-24 text-fg">
                            {order.name}
                          </p>
                        </td>

                        <td className={`${cell} whitespace-nowrap text-mute`}>
                          {order.phone}
                        </td>

                        <td className={`${cell} max-w-48 text-mute`}>
                          {order.address}
                        </td>

                        <td className={`${cell} max-w-64 leading-6 text-mute`}>
                          {(order.items || [])
                            .map(
                              (item: any) =>
                                item.name +
                                (item.size === 'ONE' ? '' : ' ' + item.size) +
                                ' ×' +
                                item.qty
                            )
                            .join(', ')}
                        </td>

                        <td className={`${cell} whitespace-nowrap text-fg`}>
                          {fmt(order.total)}
                        </td>

                        <td className={cell}>
                          <select
                            aria-label={`Статус заказа ${order.no}`}
                            value={order.status}
                            onChange={async (event) => {
                              setLoading(true);

                              try {
                                await ok(
                                  await supabase
                                    .from('orders')
                                    .update({ status: event.target.value })
                                    .eq('no', order.no),
                                  'Статус обновлён'
                                );
                              } finally {
                                setLoading(false);
                              }
                            }}
                            disabled={loading}
                            className="min-w-36 !border-line !bg-bg !px-3 !py-2 !text-xs"
                          >
                            {ST.map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Rasmlar */}
        <section id="photos" className="mb-14 scroll-mt-28">
          <SectionTitle
            eyebrow="Art direction / 03"
            title="Фотографии"
          />

          <div className="mb-5 flex items-start gap-3 border border-[var(--gold-border)] bg-[var(--gold-soft)] p-4">
            <ImageIcon size={19} className="mt-0.5 shrink-0 text-ac" />

            <div>
              <p className="text-xs">Управление изображениями</p>
              <p className="mt-1 text-xs leading-5 text-mute">
                Изображения будут сжаты перед загрузкой в хранилище photos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className={`${cardClass} p-5 transition-colors hover:border-[var(--gold-border)]`}>
              <div className="mb-5 grid aspect-[16/8] place-items-center border border-line bg-bg">
                <div className="text-center">
                  <Sparkles
                    size={25}
                    strokeWidth={1}
                    className="mx-auto mb-3 text-ac"
                  />
                  <p className="text-xs">Главный баннер</p>
                  <p className="mt-1 text-[9px] text-mute">hero.jpg</p>
                </div>
              </div>

              <p className="text-sm">Hero</p>
              <p className="mb-4 mt-1 text-[10px] leading-5 text-mute">
                Главное изображение на первой странице.
              </p>

              {F('hero', 'Загрузить фото')}
            </div>

            {DEPTS.map((dept) => (
              <div
                key={dept.id}
                className={`${cardClass} p-5 transition-colors hover:border-[var(--gold-border)]`}
              >
                <div className="mb-5 grid aspect-[16/8] place-items-center border border-line bg-bg">
                  <ImageIcon
                    size={24}
                    strokeWidth={1}
                    className="text-ac"
                  />
                </div>

                <p className="text-sm">{dept.name}</p>
                <p className="mb-4 mt-1 text-[10px] text-mute">
                  dept-{dept.id}.jpg
                </p>

                {F('dept-' + dept.id, 'Загрузить фото')}
              </div>
            ))}
          </div>
        </section>

        {/* Mahsulotlar */}
        <section id="products" className="mb-14 scroll-mt-28">
          <SectionTitle
            eyebrow="Inventory / 04"
            title="Товары"
            count={ps.length}
          />

          <div className={`${cardClass} mb-6`}>
            <div className="flex items-center gap-3 border-b border-line p-5 md:p-6">
              <div className="grid h-10 w-10 place-items-center border border-[var(--gold-border)] text-ac">
                <Plus size={19} />
              </div>

              <div>
                <h3 className="text-base font-light">
                  Добавить товар
                </h3>
                <p className="mt-1 text-[10px] text-mute">
                  Заполните информацию о новом товаре.
                </p>
              </div>
            </div>

            <form
              className="grid gap-4 p-5 sm:grid-cols-2 md:p-6 lg:grid-cols-3"
              onSubmit={(event) => {
                event.preventDefault();
                void add();
              }}
            >
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-[0.14em] text-mute">
                  Название товара *
                </span>

                <input
                  className={inputClass}
                  placeholder="Например, Premium T-shirt"
                  value={n.name}
                  onChange={(event) =>
                    setN({ ...n, name: event.target.value })
                  }
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-[0.14em] text-mute">
                  Категория
                </span>

                <select
                  className={selectClass}
                  value={n.cat}
                  onChange={(event) =>
                    setN({ ...n, cat: event.target.value })
                  }
                >
                  {DEPTS.map((dept) => (
                    <optgroup key={dept.id} label={dept.name}>
                      {dept.cats.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-[0.14em] text-mute">
                  Цена (сум) *
                </span>

                <input
                  className={inputClass}
                  type="number"
                  min="1"
                  step="1"
                  placeholder="150000"
                  value={n.price}
                  onChange={(event) =>
                    setN({ ...n, price: event.target.value })
                  }
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-[0.14em] text-mute">
                  Старая цена
                </span>

                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Если есть скидка"
                  value={n.old}
                  onChange={(event) =>
                    setN({ ...n, old: event.target.value })
                  }
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-[0.14em] text-mute">
                  Склад / размеры
                </span>

                <input
                  className={inputClass}
                  placeholder="Одежда: 5,5,5,5"
                  value={n.stock}
                  onChange={(event) =>
                    setN({ ...n, stock: event.target.value })
                  }
                />

                <span className="mt-2 block text-[9px] leading-4 text-mute">
                  Для одежды: S, M, L, XL. Для других товаров — количество.
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-[0.14em] text-mute">
                  Описание
                </span>

                <input
                  className={inputClass}
                  placeholder="Описание товара"
                  value={n.desc}
                  onChange={(event) =>
                    setN({ ...n, desc: event.target.value })
                  }
                />
              </label>

              <div className="sm:col-span-2 lg:col-span-3">
                <button
                  className={btnPrimary}
                  disabled={loading}
                  type="submit"
                >
                  {loading ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <Plus size={15} />
                  )}
                  {loading ? 'Сохранение...' : 'Добавить товар'}
                </button>
              </div>
            </form>
          </div>

          {/* Mahsulotlar ro'yxati */}
          <div className={`${cardClass} overflow-hidden`}>
            <div className="flex flex-col justify-between gap-4 border-b border-line p-4 sm:flex-row sm:items-center md:p-5">
              <div>
                <h3 className="text-sm">Каталог товаров</h3>
                <p className="mt-1 text-[10px] text-mute">
                  Изменяйте цены, остатки и фотографии.
                </p>
              </div>

              <label className="relative block w-full sm:max-w-xs">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-mute"
                />

                <input
                  className={`${inputClass} !pl-9`}
                  placeholder="Поиск товара..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <Package
                  size={28}
                  strokeWidth={1}
                  className="mx-auto mb-4 text-mute"
                />

                <p className="text-sm">
                  {ps.length ? 'Товары не найдены' : 'Каталог пока пуст'}
                </p>

                <p className="mt-2 text-xs text-mute">
                  Добавьте товар или измените поисковый запрос.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="bg-[var(--gold-soft)]">
                      {[
                        'ID',
                        'Название',
                        'Цена',
                        'Остаток',
                        'Действия',
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="border-b border-line px-4 py-4 text-left text-[9px] font-normal uppercase tracking-[0.14em] text-mute"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="transition-colors hover:bg-[var(--gold-soft)]"
                      >
                        <td className={cell}>
                          <span className="text-ac">
                            #{product.id}
                          </span>
                        </td>

                        <td className={cell}>
                          <p className="max-w-64 text-sm text-fg">
                            {product.name}
                          </p>

                          <p className="mt-1 text-[10px] text-mute">
                            {product.category}
                          </p>
                        </td>

                        <td className={`${cell} whitespace-nowrap`}>
                          <p className="text-fg">
                            {fmt(product.price)}
                          </p>

                          {product.old_price && (
                            <s className="mt-1 block text-[10px] text-mute">
                              {fmt(product.old_price)}
                            </s>
                          )}
                        </td>

                        <td className={cell}>
                          <span
                            className={
                              'inline-flex items-center gap-2 ' +
                              (tot(product.stock) > 0
                                ? 'text-fg'
                                : 'text-red-400')
                            }
                          >
                            <span
                              className={
                                'h-1.5 w-1.5 rounded-full ' +
                                (tot(product.stock) > 0
                                  ? 'bg-emerald-400'
                                  : 'bg-red-400')
                              }
                            />

                            {tot(product.stock)} шт.
                          </span>
                        </td>

                        <td className={cell}>
                          <div className="flex flex-wrap items-center gap-2">
                            {F('p-' + product.id, 'Фото')}

                            <button
                              className={btnSecondary}
                              type="button"
                              disabled={loading}
                              onClick={() => void edit(product)}
                              aria-label={`Изменить ${product.name}`}
                            >
                              <Pencil size={13} />
                              <span>Изменить</span>
                            </button>

                            <button
                              className="inline-flex items-center gap-2 border border-red-500/20 px-3 py-2.5 text-[9px] uppercase tracking-[0.1em] text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/5 disabled:opacity-50"
                              type="button"
                              disabled={loading}
                              onClick={() => void removeProduct(product)}
                            >
                              <Trash2 size={13} />
                              <span>Удалить</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col justify-between gap-3 border-t border-line py-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-mute">
            <span className="text-ac">LV</span>
            L Vision Administration
          </div>

          <p className="text-[9px] tracking-[0.1em] text-mute">
            PRIVATE CONTROL CENTER
          </p>
        </footer>
      </div>
    </main>
  );
}
