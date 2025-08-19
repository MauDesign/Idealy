import {getTranslations} from 'next-intl/server';
import Image from "next/image";
import Header from "@/app/ui/header/header";
import Contact from "@/app/ui/contact/contact";
import Footer from "@/app/ui/Footer/Footer";
import {setRequestLocale} from 'next-intl/server';

import type {locales } from '../../i18n/routing'
type Props = {params: Promise<{locale: typeof locales[number]}>};

export default async function Home({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Home');
  return (
    <div className="w-full">
      <main className="flex flex-wrap sm:w-full sm:flex-row">
        <Header/>
        <div className="bg-[#334B5F] lg:mt-45 sm:mt-5 ">
          <div className='flex flex-wrap w-3/4 m-auto '>
            <div className='lg:w-1/4 sm:w-full grow justify-center items-center'>
              <Image
              src="/img/AI_Idealy.gif"
              alt='brain'
              width={300}
              height={300}
              className='shadow-sm rounded-lg grow  sm:w-48' 
              />
            </div>
            <div className="lg:w-3/4 sm:w-full grow py-5 p-10 sm:p-3 ">
              <div className='w-full  '>
                <h1 className=" font-bold text-4xl text-center mb-5 text-[#00B5A7]">{t("frase")}</h1>
                <p className=" text-justify text-lg text-[#ffffff]">{t("About-us")}</p>
                <p className=" text-center text-lg text-[#ffffff]">{t("About-us2")}</p>
                <p className=" text-center text-lg text-[#ffffff]">{t("About-us3")}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full flex py-5 p-10 justify-center items-center'>
            <div className='lg:w-3/4 m-auto items-center'>
              <h1 className='item-center font-bold text-4xl text-center mb-5 text-[#00B5A7]'>{t("title-services")}</h1>
              <h3 className='item-center fonrt-bold text-2xl text-center mb-5 text-[#00B5A7]'>{t("subtitle-services")}</h3>
              <p className='item-center text-center text-lg'>{t("text-services")}</p>
            </div>
          </div>
        <div className='w-full mb-10 '>
          <div className='w-3/4 m-auto flex flex-wrap'>
            <div className='lg:w-1/2 sm:w-full grow sm:p-1.5 '>
              <Image
              src= "/img/Desarrollo_idealy.jpg"
              alt='Desarrollo a la medida'
              width={600}
              height={300}
              className='w-full shadow-sm rounded-lg '
              />
            </div>
            <div className='lg:w-1/2 pl-5 grow sm:w-full'>
              <h2 className='w-full font-bold text-3xl  mb-5 text-[#00B5A7]'>{t("title-development")}</h2>
              <p className='w-full  text-md text-[#ababab]'>{t("subtitle-development")}</p>
              <p className='w-full text-md'>{t("text-development")}</p>
              <ul className='list list-disc ml-10'>
                <li className='list-row'>{t("bullet1")}</li>
                <li className='list-row'>{t("bullet2")}</li>
                <li className='list-row'>{t("bullet3")}</li>
              </ul>
              <p className='w-full text-md'>{t("text2-development")}</p>
              <a role="button" href="#" className="btn btn-soft btn-primary"> {t("button-development")} </a>
            </div>
          </div>
        </div>
        <div className='w-full mb-15'>
          <div className='w-3/4 m-auto flex flex-wrap-reverse '>
            <div className='lg:w-1/2 pr-5 sm:w-full grow sm:pl-1'>
              <h2 className='w-full font-bold text-3xl  mb-5 text-[#00B5A7]'>{t("title-MD")}</h2>
              <p className='w-full  text-md text-[#ababab]'>{t("subtitle-MD")}</p>
              <p className='w-full text-md text-justify'>{t("text-MD")}</p>
              <p className='w-full text-md text-justify'>{t("text-MD2")}</p>
              <p className='w-full text-md text-justify'>{t("text-MD3")}</p>
              <p className='w-full  text-md text-[#00B5A7]'>{t("frase-MD")}</p>
            </div>
            <div className='lg:w-1/2  sm:w-full grow'>
              <Image
              src= "/img/markethink_idealy.jpg"
              alt='Desarrollo a la medida'
              width={600}
              height={300}
              className='w-100% h-auto rounded-lg shadow-sm'
              />
            </div>
            
          </div>
        </div>
        <div className='w-full bg-primary pt-10 pb-10'>
          <div className='w-3/4 m-auto flex flex-wrap'>
            <div className='lg:w-1/3 sm:w-full grow'>
              <Image
              src= "/img/Consulting-leo-idealy.jpg"
              alt='Desarrollo a la medida'
              width={600}
              height={300}
              className='w-100% h-auto rounded-lg shadow-sm mask mask-squircle'
              />
            </div>
            <div className='lg:w-2/3 pl-1.5 sm:w-full grow'>
              <div className='w-full'>
                <h2 className='w-full font-bold text-3xl  mb-5 text-[#ffffff]'>{t("title-consulting")}</h2>
                <p className='w-full  text-md text-[#ababab]'>{t("subtitle-consulting")}</p>
                <p className='w-full text-lg text-justify text-[#ffffff]'>{t("text-consulting")}</p>
                <p className='w-full text-lg text-justify text-[#ffffff] mt-10'>{t("text-consulting2")}</p>
                <button className='btn btn-outline btn-primary mt-10'>{t("button-consulting")}</button>

              </div>
            </div>
          </div>
        </div>
         <div className='w-full'>
              <Contact/>
          </div>        
      </main>
      <Footer/>  
    </div>
  );
}