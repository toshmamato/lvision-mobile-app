
import { admin, session } from '@/lib/server';

export async function POST(req: Request) {
  try {
    // Foydalanuvchi sessiyasini tekshirish
    const s = await session();

    if (!s) {
      return Response.json(
        { error: 'login' },
        { status: 401 }
      );
    }

    // So'rov ma'lumotlarini olish
    let b: any;

    try {
      b = await req.json();
    } catch {
      return Response.json(
        { error: 'invalid_json' },
        { status: 400 }
      );
    }

    const name = String(b.name || '').trim();
    const address = String(b.address || '').trim();

    if (
      name.length < 3 ||
      address.length < 6 ||
      !Array.isArray(b.items) ||
      b.items.length === 0
    ) {
      return Response.json(
        { error: 'bad_input' },
        { status: 400 }
      );
    }

    // Buyurtmani Supabase orqali joylashtirish
    const db = admin();

    const r = await db.rpc('place_order', {
      p: {
        name,
        phone: s.phone,
        address,
        delivery: b.delivery === 'exp' ? 'exp' : 'std',
        payment: 'cod',
        promo: String(b.promo || ''),
        items: b.items,
      },
    });

    if (r.error) {
      console.error('PLACE ORDER ERROR:', r.error.message);

      return Response.json(
        { error: r.error.message },
        { status: 400 }
      );
    }

    // Buyurtma va mijoz ma'lumotlarini yangilash
    const order = r.data;

    if (!order?.no) {
      return Response.json(
        { error: 'order_creation_failed' },
        { status: 500 }
      );
    }

    const { error: orderError } = await db
      .from('orders')
      .update({ customer_phone: s.phone })
      .eq('no', order.no);

    if (orderError) {
      console.error('ORDER UPDATE ERROR:', orderError.message);
    }

    const { error: customerError } = await db
      .from('customers')
      .update({ name })
      .eq('phone', s.phone);

    if (customerError) {
      console.error('CUSTOMER UPDATE ERROR:', customerError.message);
    }

    return Response.json(order, { status: 200 });
  } catch (error) {
    console.error('ORDER API ERROR:', error);

    return Response.json(
      { error: 'internal_server_error' },
      { status: 500 }
    );
  }
}
