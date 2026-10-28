import type {ReactNode} from 'react';
import Providers from '@/components/Providers';import Ticker from '@/components/Ticker';import Header from '@/components/Header';import BottomNav from '@/components/BottomNav';import CartDrawer from '@/components/CartDrawer';import Intro from '@/components/Intro';import Footer from '@/components/Footer';import LoginModal from '@/components/LoginModal';import SearchOverlay from '@/components/SearchOverlay';
export default function SiteLayout({children}:{children:ReactNode}){return <Providers>
 <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[400] focus:bg-fg focus:px-4 focus:py-2 focus:text-bg">Перейти к содержимому</a>
 <Intro/><Ticker/><Header/><main id="main">{children}</main><Footer/><BottomNav/><CartDrawer/><LoginModal/><SearchOverlay/></Providers>}
