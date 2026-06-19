'use client';
import { useTranslations } from 'next-intl';
import { Link } from '../../../i18n/navigation';
import Image from 'next/image';

export default function Footer() {
const t = useTranslations("Footer");

return(
  <div className='w-full bg-neutral'>
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
          <h1 className='font-bold text-2xl justify-center text-center text-neutral-content'>{t("foot-title1")}</h1>
        </div>
        <div className='lg:w-full sm:w-full grow justify-center items-center'>
          
          <ul className='list text-slate-300 space-y-1.5 pt-2 text-center lg:text-left'>
            <li>
              <a href="https://www.facebook.com/idealymx" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-200">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/idea.ly_design/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-200">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://x.com/idealy_mx" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-200">
                X (Twitter)
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/idea-ly-mx" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-200">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com/@idealy.com.mx" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-200">
                TikTok
              </a>
            </li>
          </ul>
        </div> 
      </div>
      <div className='lg:w-1/3 sm:w-full grow p-5'>
        <div className='flex w-full justify-center items-center'>
          <h1 className='font-bold text-2xl justify-center text-center text-neutral-content'>{t("foot-title2")}</h1>
        </div>
        <div className='lg:w-full sm:w-full grow justify-center items-center'>
          <ul className='list text-neutral-content text-center'>
            <li><Link href="/privacy-policy" className="hover:text-[#00B5A7] transition-colors">{t("privacy-policy")}</Link></li>
          </ul>
        </div> 
      </div>
    </div>
  </div>
)
}
  
  
