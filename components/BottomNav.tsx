'use client';
import Link from 'next/link';import {usePathname,useRouter} from 'next/navigation';import {Home,LayoutGrid,Heart,ShoppingBag,User} from 'lucide-react';
import {useStore} from '@/lib/store';import {useMounted} from '@/lib/useMounted';
const T:[string,string,any][]=[['/','Главная',Home],['/catalog','Каталог',LayoutGrid],['/fav','Избранное',Heart],['cart','Корзина',ShoppingBag],['/profile','Профиль',User]];
export default function BottomNav(){
 const p=usePathname(),r=useRouter(),m=useMounted(),{cart,fav,user,setOpen,setLogin}=useStore();
 const cnt:Record<string,number>={'/fav':m?fav.length:0,cart:m?cart.reduce((a,c)=>a+c.qty,0):0};
 return <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">{T.map(([h,l,I])=>{
  const c=<><I size={20} className="mx-auto"/><span className="mt-0.5 block text-[10px]">{l}</span>{cnt[h]>0&&<i className="absolute right-[calc(50%-22px)] top-1 grid h-4 min-w-4 place-items-center rounded-full bg-fg px-1 text-[10px] not-italic text-bg">{cnt[h]}</i>}</>;
  const cls='relative flex-1 py-2 text-center '+((h==='/'?p==='/':h!=='cart'&&p.startsWith(h))?'text-fg':'text-mute');
  if(h==='cart')return <button key={h} onClick={()=>setOpen(true)} className={cls}>{c}</button>;
  if(h==='/profile')return <button key={h} onClick={()=>user?r.push('/profile'):setLogin(true)} className={cls}>{c}</button>;
  return <Link key={h} href={h} className={cls}>{c}</Link>})}</nav>}
