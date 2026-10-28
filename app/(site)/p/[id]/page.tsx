import {notFound} from 'next/navigation';import ProductView from '@/components/ProductView';import {getProduct,getProducts} from '@/lib/products';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:{id:string}}){const p=await getProduct(+params.id);return p?{title:p.name,description:p.description||undefined}:{title:'Товар не найден'}}
export default async function Page({params}:{params:{id:string}}){
 const p=await getProduct(+params.id);if(!p)notFound();
 const related=(await getProducts(p.dept)).filter(x=>x.id!==p.id).slice(0,4);
 return <ProductView key={p.id} p={p} related={related}/>}
