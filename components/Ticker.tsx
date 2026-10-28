const T=['COFE BY INOSHKINS ☕','Новая коллекция 2026','MARRY ME','L VISION BY INOSHKINS','LV FLOWERS','Оформление заказа по номеру телефона'];
export default function Ticker(){const row=T.map(t=><span key={t} className="px-6">{t}<i className="ml-12 not-italic opacity-50">✦</i></span>);
 return <div className="overflow-hidden whitespace-nowrap bg-fg py-2 text-[11px] uppercase tracking-[.18em] text-bg"><div className="flex w-max animate-[mq_32s_linear_infinite]"><div className="flex">{row}</div><div className="flex" aria-hidden="true">{row}</div></div></div>}
