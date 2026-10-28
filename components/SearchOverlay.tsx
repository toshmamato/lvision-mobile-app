'use client';
import Link from 'next/link';import {useEffect,useState} from 'react';import {AnimatePresence,motion} from 'framer-motion';import {Search,X} from 'lucide-react';
import Art from './Art';import {useStore} from '@/lib/store';import {fmt} from '@/lib/format';import type {Product} from '@/lib/types';
export default function SearchOverlay(){
 const {searchOpen,setSearch}=useStore(),[q,setQ]=useState(''),[all,setAll]=useState<Product[]>([]);
 useEffect(()=>{if(searchOpen&&!all.length)fetch('/api/products').then(r=>r.json()).then(d=>setAll(Array.isArray(d)?d:[])).catch(()=>{})},[searchOpen,all.length]);
 useEffect(()=>{const k=(e:KeyboardEvent)=>{if(e.key==='Escape')setSearch(false)};addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[setSearch]);
 const l=q.trim()?all.filter(p=>(p.name+' '+p.category).toLowerCase().includes(q.toLowerCase())).slice(0,8):[];
 return <AnimatePresence>{searchOpen&&<motion.div role="dialog" aria-modal="true" aria-label="Поиск" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.2}} className="fixed inset-0 z-[90] overflow-auto bg-bg/95 backdrop-blur-xl">
  <div className="mx-auto max-w-2xl px-5 pt-6"><div className="flex items-center gap-3 border-b border-fg pb-3"><Search size={22}/><input autoFocus placeholder="Поиск: кольцо, букет, худи, кофе…" value={q} onChange={e=>setQ(e.target.value)} aria-label="Поиск" className="!border-0 !bg-transparent !p-0 text-xl !shadow-none outline-none"/><button aria-label="Закрыть" onClick={()=>setSearch(false)}><X size={22}/></button></div>
  <div className="mt-4 space-y-2">{l.map(p=><Link key={p.id} href={`/p/${p.id}`} onClick={()=>setSearch(false)} className="flex items-center gap-4 border border-line p-2 transition hover:border-fg"><Art file={`p-${p.id}`} dept={p.dept} g={p.color} alt={p.name} className="h-16 w-14 shrink-0"/><div className="flex-1"><p>{p.name}</p><p className="text-xs uppercase tracking-widest text-mute">{p.category}</p></div><p className="pr-2">{fmt(p.price)}</p></Link>)}
   {q.trim()&&!l.length&&<p className="py-10 text-center text-mute">Ничего не найдено</p>}</div></div></motion.div>}</AnimatePresence>}
