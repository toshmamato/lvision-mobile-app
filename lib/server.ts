
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { cookies } from 'next/headers';

/**
 * Faqat serverda ishlaydi.
 * Secret key hech qachon brauzerga chiqarilmasligi kerak.
 */
export const admin = () => {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase server URL yoki secret key topilmadi. .env.local faylini tekshiring.'
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};

const SEC = () => process.env.SESSION_SECRET || '';

function requireSecret() {
  const secret = SEC();

  if (!secret) {
    throw new Error(
      'SESSION_SECRET topilmadi. .env.local faylini tekshiring.'
    );
  }

  return secret;
}

const mac = (s: string) =>
  crypto
    .createHmac('sha256', requireSecret())
    .update(s)
    .digest('base64url');

export const hash = (phone: string, code: string) =>
  crypto
    .createHmac('sha256', requireSecret())
    .update(phone + ':' + code)
    .digest('hex');

export function sign(o: object) {
  const p = Buffer.from(
    JSON.stringify({
      ...o,
      exp: Date.now() + 30 * 864e5,
    })
  ).toString('base64url');

  return p + '.' + mac(p);
}

export async function session(): Promise<{ phone: string } | null> {
  if (!SEC()) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get('lv-session')?.value;

  if (!token) return null;

  const [payload, signature] = token.split('.');

  if (!payload || !signature) return null;

  const expected = mac(payload);

  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const data = JSON.parse(
      Buffer.from(payload, 'base64url').toString()
    );

    if (
      typeof data.phone !== 'string' ||
      typeof data.exp !== 'number' ||
      data.exp <= Date.now()
    ) {
      return null;
    }

    return { phone: data.phone };
  } catch {
    return null;
  }
}
