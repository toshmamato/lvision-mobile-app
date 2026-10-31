
export const DEPTS = [
  {
    id: 'lv',
    name: 'L VISION BY INOSHKINS',
    sub: 'Одежда',
    cats: ['T-Shirts', 'Long Sleeve', 'Hoodies', 'Cardigans', 'Sportswear'],
    active: true,
  },
  {
    id: 'marry',
    name: 'MARRY ME',
    sub: 'Кольца, свадьба и подарки',
    cats: ['Rings', 'Gifts', 'Wedding'],
    active: false,
  },
  {
    id: 'flowers',
    name: 'LV FLOWERS',
    sub: 'Цветы и букеты',
    cats: ['Roses', 'Bouquets', 'Premium'],
    active: true,
  },
  {
    id: 'coffee',
    name: 'COFE BY INOSHKINS',
    sub: 'Только кофе',
    cats: ['Beans', 'Drinks', 'Accessories'],
    active: false,
  },
];

export const ALLC = DEPTS.flatMap((d) => d.cats);

export const deptOf = (c: string) =>
  DEPTS.find((d) => d.cats.includes(c))?.id ?? 'lv';
