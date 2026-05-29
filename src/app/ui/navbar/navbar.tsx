'use client'
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import React from 'react';
import Image from 'next/image';
import '@/app/globals.css';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from '../ThemeToggle';


import { usePathname } from 'next/navigation';

const Navbar = ({ locale }: { locale: string }) => {
    const t = useTranslations("NavbarLinks");
    const pathname = usePathname();
    const isExcluded = pathname?.includes('/admin') || pathname?.includes('/auth');

    if (isExcluded) return null;


    return (

    <div className=' w-full backdrop-blur-xs glass z-50 shadow-sm fixed'>
        <div className="navbar w-3/4 m-auto text-base-content flex flex-1 flex-nowrap items-center justify-between">
            <div className='navbar-start flex-1 flex items-center gap-2'>
                <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                        <ul  tabIndex={0} className='flex menu menu-sm menu-horizontal dropdown-content rounded-sm bg-base-100 px-1 gap-2 w-45 shadow-lg border border-base-300'>
                            <li className='min-w-40'><Link href="/">{t("home")}</Link></li>
                            <li className='min-w-40'><Link href="/#about">{t("about")}</Link></li>
                            <li className='min-w-40'><Link href="/services">{t("services")}</Link></li>
                            <li className='min-w-40'><Link href="/blog">{t("blog")}</Link></li>
                            <li className='min-w-40'><Link href="/#contact">{t("contact")}</Link></li>
                            <li className='min-w-40 flex-row items-center justify-between gap-2 px-4 py-2 border-t mt-2'>
                              <LanguageSwitcher locale={locale} />
                              <ThemeToggle />
                            </li>
                        </ul> 
                    </div>
                <Image
                    src="/img/Logo-Idealy.png"
                    alt='Logo Mauricio Casado'
                    width={150}
                    height={150}
                    className='object-contain'
                />
            </div>

            {/* Centered Main Menu on Desktop */}
            <div className="navbar-center hidden lg:flex flex-nowrap">
                <ul className="menu menu-horizontal px-1 gap-1 flex-nowrap">
                    <li><Link href="/">{t("home")}</Link></li>
                    <li><Link href="/#about" scroll={true}>{t("about")}</Link></li>
                    <li><Link href="/services">{t("services")}</Link></li>
                    <li><Link href="/blog">{t("blog")}</Link></li>
                    <li><Link href="/#contact" scroll={true}>{t("contact")}</Link></li>
                </ul>
            </div>

            {/* Right-aligned Switchers & Actions */}
            <div className='navbar-end hidden lg:flex flex-nowrap items-center justify-end gap-4'>
                <LanguageSwitcher locale={locale} />
                <ThemeToggle />
            </div>
        </div>
    </div>
)
};

export default Navbar;
