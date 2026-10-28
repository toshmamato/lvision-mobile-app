
import { supabase } from './supabase';
import type { Product } from './types';

export async function getProducts(dept?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')
    .order('id', { ascending: false });

  if (dept) {
    query = query.eq('dept', dept);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Mahsulotlarni yuklash xatosi:', error.message);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getProduct(id: number): Promise<Product | null> {
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Mahsulotni yuklash xatosi:', error.message);
    return null;
  }

  return (data ?? null) as Product | null;
}
