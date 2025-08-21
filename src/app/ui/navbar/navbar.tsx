'use client'
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import React from 'react';
import Image from 'next/image';
import '@/app/globals.css';
import LanguageSwitcher from './LanguageSwitcher';


const Navbar = ({ locale }: {locale: string}) => {
    const t = useTranslations("NavbarLinks");

    return (
    <div className=' w-full backdrop-blur-xs glass z-50 shadow-sm fixed'>
        <div className="navbar w-3/4 m-auto text-grey-200 flex flex-1 items-center justify-between">
            <div className='navbar-start'>
                <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                        <ul  tabIndex={0} className='flex menu menu-sm menu-horizontal dropdown-content rounded-sm bg-white px-1 gap-2 w-45'>
                            <li className='min-w-40'><Link href="/">{t("home")}</Link></li>
                            <li className='min-w-40'><Link href="/#about">{t("about")}</Link></li>
                            <li className='min-w-40'><Link href="/#services">{t("services")}</Link></li>
                            <li className='min-w-40'><Link href="/#contact">{t("contact")}</Link></li>
                            <li className='min-w-40'>
                              <LanguageSwitcher locale={locale} />
                            </li>
                        </ul> 
                    </div>
                <Image
                    src="/img/Logo-Idealy.png"
                    alt='Logo Mauricio Casado'
                    width={150}
                    height={150}
                    className=''
                />
            </div>

            <div className='navbar-end hidden lg:flex'>
                    <ul  tabIndex={0} className='flex menu menu-horizontal px-1 gap-2'>
                        <li><Link href="/">{t("home")}</Link></li>
                        <li><Link href="/#about" scroll={true}>{t("about")}</Link></li>
                        <li><Link href="/#services">{t("services")}</Link></li>
                        <li><Link href="/#contact" scroll={true}>{t("contact") } </Link></li>
                        <li>
                            <LanguageSwitcher locale={locale} />
                        </li>
                    </ul>  
            </div>
        </div>
    </div>
)
};

export default Navbar;
