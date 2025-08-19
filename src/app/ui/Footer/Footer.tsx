'use client';
import { useTranslations } from 'next-intl';
import { Link } from '../../../i18n/navigation';
import Image from 'next/image';

export default function Footer() {
const t = useTranslations("Footer");

return(
  <div className='w-full bg-gray-800'>
    <div className='w-3/4 m-auto flex flex-wrap'>
      <div className='lg:w-1/3 sm:w-full grow p-5'>
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
      <div className='lg:w-1/3 sm:w-full grow p-5'>
        <div className='flex w-full justify-center items-center'>
          <h1 className='font-bold text-2xl justify-center text-center text-white'>{t("foot-title1")}</h1>
        </div>
        <div className='lg:w-full sm:w-full grow justify-center items-center'>
          
          <ul className='list text-white'>
            <li><Link href="https://www.facebook.com/">Facebook</Link></li>
            <li><Link href="https://www.instagram.com/">Instagram</Link> </li>
            <li><Link href="https://www.x.com/">X</Link>  </li>
            <li><Link href="https://www.linkedin.com/">Linkedin</Link>  </li>
            <li><Link href="https://www.tiktok.com/">Tik Tok</Link> </li>
          </ul>
        </div> 
      </div>
    </div>
  </div>
)
}
  
  
