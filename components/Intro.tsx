'use client';
import {useEffect,useState} from 'react';import {AnimatePresence,motion} from 'framer-motion';
export default function Intro(){
 const [show,setShow]=useState(false);
 useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;try{if(sessionStorage.getItem('lv-i'))return;sessionStorage.setItem('lv-i','1')}catch{}setShow(true);const t=setTimeout(()=>setShow(false),1900);return()=>clearTimeout(t)},[]);
 return <AnimatePresence>{show&&<motion.div exit={{opacity:0}} transition={{duration:.7}} className="fixed inset-0 z-[200] grid place-items-center bg-[#080808] text-center text-white">
  <div><motion.h1 initial={{opacity:0,letterSpacing:'.1em'}} animate={{opacity:1,letterSpacing:'.45em'}} transition={{duration:1.4}} className="text-4xl font-extralight md:text-6xl">L VISION</motion.h1>
  <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.6,duration:1}} className="mt-4 text-[11px] tracking-[.5em] text-[#c0c0c0]">BY INOSHKINS</motion.p>
  <motion.span initial={{width:0}} animate={{width:220}} transition={{delay:.2,duration:1.4}} className="mx-auto mt-6 block h-px bg-gradient-to-r from-transparent via-[#c0c0c0] to-transparent"/></div></motion.div>}</AnimatePresence>}
