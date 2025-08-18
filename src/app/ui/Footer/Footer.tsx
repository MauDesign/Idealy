'use client';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '../../../i18n/navigation';
import Image from 'next/image';

export default function Footer() {
const t = useTranslations("Footer");

return(
  <div className='w-full bg-gray-800'>
    <div className='w-3/4 m-auto flex'>
      <div className='w-1/3 flex p-5'>
        <div className="p-3 w-full flex justify-center items-center "  >
            <Image 
              src="/img/Logo-Idealy.png"
              width={340}
              height={200}
              alt="Fondo Mauricio Casado"
              className=""
            />
        </div>
      </div>
      <div className='w-1/3 flex p-5'>
        <h1 className='font-bold text-2xl text-center text-white'>{t("foot-title1")}</h1>
      </div>
      <div className='w-1/3 flex p-5'>
        <h1 className='font-bold text-2xl text-center text-white'>{t("foot-title2")}</h1>
      </div>
    </div>
  </div>
)
}
  
  
