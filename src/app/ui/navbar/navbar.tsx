'use client'
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '../../../i18n/navigation';
import React, { ChangeEvent } from 'react';
import Image from 'next/image';
import "@/app/globals.css"

const Navbar = ({ locale }: {locale: string}) => {
    const t = useTranslations("NavbarLinks");
    const pathname = usePathname();
    const router = useRouter();


    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newLocale = e.target.value;
        router.push(pathname, { locale: newLocale });
    }

    return (
    <div className=' w-full backdrop-blur-xs glass z-50 shadow-sm fixed'>
        <div className="navbar w-3/4 m-auto text-grey-200 flex flex-1 items-center justify-between">
            <div className='navbar-start'>
                <Image
                    src="/img/Logo-Idealy.png"
                    alt='Logo Mauricio Casado'
                    width={150}
                    height={150}
                />
            </div>

            <div className='navbar-end'>
                    <ul className='flex menu menu-horizontal px-1 gap-2'>
                        <li><Link href="/">{t("home")}</Link></li>
                        <li><Link href="/about">{t("about")}</Link></li>
                        <li><Link href="/services">{t("services")}</Link></li>
                        <li><Link href="/portfolio">{t("portfolio")}</Link></li>
                        <li><Link href="/contact">{t("contact")}</Link></li>
                        <li><select 
                                value={locale} 
                                onChange={handleLanguageChange}
                                className='rounded-md hover:outline-none focus:outline-none bg-[#53f6c7] text-black dropdown' >
                                <option value={"en"}>En</option>
                                <option value={"es"}>Es</option>
                            </select>
                        </li>
                    </ul>  
            </div>
        </div>
    </div>
)
};

export default Navbar;
