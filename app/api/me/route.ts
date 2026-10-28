
import { admin, session } from '@/lib/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await session();

  if (!s) {
    return Response.json({
      user: null,
      orders: [],
    });
  }

  const db = admin();

  const [c, o] = await Promise.all([
    db
      .from('customers')
      .select('name')
      .eq('phone', s.phone)
      .maybeSingle(),

    db
      .from('orders')
      .select('no,total,status,items,created_at')
      .eq('customer_phone', s.phone)
      .order('created_at', { ascending: false }),
  ]);

  return Response.json({
    user: {
      phone: s.phone,
      name: c.data?.name || '',
    },
    orders: o.data ?? [],
  });
}
