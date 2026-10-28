'use client';
import {useEffect,useState} from 'react';import {AnimatePresence,motion} from 'framer-motion';import {X,Smartphone,ShieldCheck,MessageSquare} from 'lucide-react';import {useStore} from '@/lib/store';
const post=async(u:string,b:object)=>{const r=await fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});return {ok:r.ok,d:await r.json().catch(()=>({}))}};
export default function LoginModal(){
 const {loginOpen,setLogin,setUser}=useStore(),[step,setStep]=useState<'phone'|'code'>('phone'),[ph,setPh]=useState(''),[code,setCode]=useState(''),[dev,setDev]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{fetch('/api/me').then(r=>r.json()).then(d=>setUser(d.user)).catch(()=>{})},[setUser]);
 const full='+998'+ph.replace(/\D/g,'');
 const close=()=>{setLogin(false);setStep('phone');setCode('');setDev('');setErr('')};
 useEffect(()=>{if(!loginOpen)return;const k=(e:KeyboardEvent)=>{if(e.key==='Escape')close()};addEventListener('keydown',k);return()=>removeEventListener('keydown',k)});
 async function send(){setErr('');if(ph.replace(/\D/g,'').length!==9)return setErr('Введите 9 цифр номера');setBusy(true);const r=await post('/api/auth/send',{phone:full});setBusy(false);
  if(!r.ok)return setErr(r.d.error==='wait'?'Подождите 30 секунд и попробуйте снова':'Не удалось отправить код');setStep('code');setCode('');setDev(r.d.devCode||'')}
 async function verify(){setErr('');setBusy(true);const r=await post('/api/auth/verify',{phone:full,code});setBusy(false);
  if(!r.ok)return setErr(r.d.error==='wrong'?'Неверный код':'Код истёк, запросите новый');setUser(r.d.user);close()}
 return <AnimatePresence>{loginOpen&&<>
  {dev&&step==='code'&&<motion.div key="a" initial={{y:-120,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-120,opacity:0}} transition={{type:'spring',damping:20}} className="fixed left-1/2 top-4 z-[320] w-[min(92vw,400px)] -translate-x-1/2 rounded-2xl border border-white/15 bg-[#1c1c1e]/95 p-4 text-white shadow-2xl backdrop-blur-xl">
   <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-black"><MessageSquare size={20}/></div><div className="flex-1"><p className="flex justify-between text-xs text-white/60"><span>СООБЩЕНИЯ · L VISION</span><span>сейчас</span></p><p className="mt-0.5 text-sm">Ваш код: <b className="text-lg tracking-[.25em]">{dev}</b>. Никому его не сообщайте.</p></div></div></motion.div>}
  <motion.div key="b" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={close} className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm"/>
  <motion.div key="m" role="dialog" aria-modal="true" aria-label="Вход по номеру телефона" initial={{opacity:0,y:40,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:40}} transition={{duration:.35,ease:[.16,1,.3,1]}} className="fixed left-1/2 top-1/2 z-[310] w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 border border-line bg-bg p-7 shadow-[0_0_80px_-20px_rgba(192,192,192,.3)]">
   <button aria-label="Закрыть" onClick={close} className="absolute right-4 top-4 text-mute"><X size={20}/></button>
   <div className="mb-5 grid h-12 w-12 place-items-center rounded-full border border-ac">{step==='phone'?<Smartphone size={22}/>:<ShieldCheck size={22}/>}</div>
   <h2 className="text-2xl font-light">{step==='phone'?'Вход по номеру телефона':'Введите код'}</h2>
   <p className="mb-5 mt-1 text-sm text-mute">{step==='phone'?'Без номера телефона оформить заказ нельзя.':`Код отправлен на ${full}`}</p>
   {step==='phone'?<div className="flex"><span className="grid place-items-center border border-r-0 border-line bg-surf px-3 text-sm">+998</span><input autoFocus inputMode="numeric" placeholder="90 123 45 67" value={ph} onChange={e=>setPh(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}/></div>
   :<input autoFocus inputMode="numeric" maxLength={6} placeholder="••••••" value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))} onKeyDown={e=>e.key==='Enter'&&code.length===6&&verify()} className="text-center text-2xl tracking-[.6em]"/>}
   <p className="min-h-5 pt-2 text-xs text-red-500">{err}</p>
   <button className="btn mt-2 w-full" disabled={busy||(step==='code'&&code.length!==6)} onClick={step==='phone'?send:verify}>{busy?'Подождите…':step==='phone'?'Получить код':'Подтвердить'}</button>
   {step==='code'&&<button className="mt-3 w-full text-xs text-mute underline" onClick={()=>{setStep('phone');setDev('')}}>Изменить номер</button>}
  </motion.div></>}</AnimatePresence>}
