
export const fmt = (n: number) => {
  const value = Number(n);

  if (!Number.isFinite(value)) {
    return '0 сум';
  }

  return (
    Math.round(value).toLocaleString('ru-RU').replace(/\u00a0/g, ' ') +
    ' сум'
  );
};

export const disc = (p: {
  price: number;
  old_price: number | null;
}) => {
  const price = Number(p.price);
  const oldPrice = Number(p.old_price);

  if (
    !Number.isFinite(price) ||
    !Number.isFinite(oldPrice) ||
    oldPrice <= price ||
    oldPrice <= 0
  ) {
    return 0;
  }

  return Math.round((1 - price / oldPrice) * 100);
};

export const tot = (
  stock: Record<string, number | string> | null | undefined
) =>
  Object.values(stock || {}).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0
  );
