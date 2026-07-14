import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Image from "next/image";
import Header from "@/app/ui/header/header";
import dynamic from 'next/dynamic';
import FAQSection from "@/app/ui/FAQsection/FAQSection";
const Carousel = dynamic(() => import("@/app/ui/carousel/carousel"), {
  loading: () => <div className="h-[400px] w-full animate-pulse bg-base-200/20 rounded-box"></div>
});
import Contact from "@/app/ui/contact/contact";
import Footer from "@/app/ui/Footer/Footer";
import { setRequestLocale } from 'next-intl/server';
import GSAPInitializer from "@/app/ui/components/GSAPInitializer";
const CardStack = dynamic(() => import("@/app/ui/cardstack/cardstak"), {
  loading: () => <div className="h-[300px] w-full animate-pulse bg-base-200/20 rounded-box"></div>
});
import type { Metadata } from 'next';
import { keywordsByPage } from '@/config/keywords';
import StructuredData from "../ui/StructuredData";

import type { locales } from '../../i18n/routing'
type Props = { params: Promise<{ locale: typeof locales[number] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  const baseUrl = 'https://www.idealy.com.mx';

  return {
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
        'en-US': `${baseUrl}/en`,
        'es-MX': `${baseUrl}/es`,
        'x-default': `${baseUrl}/es`,
      },
    },
    title: isEn
      ? "Idea.ly | High-Performance Solutions & AI Automation"
      : "Idea.ly | Software de Alto Rendimiento y Automatización de IA",
    description: isEn
      ? "Scale your business with Next.js & Go software. Experts in custom AI agents, workflow automation & high-impact UX for US & MX markets."
      : "Escala tu negocio con software de Next.js y Go. Expertos en agentes de IA personalizados, automatización de flujos y UX de alto impacto para mercados de EE.UU. y México.",
    keywords: isEn
      ? [...keywordsByPage['home-en']]
      : [...keywordsByPage['home-es']]
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Home');
  return (
    <>
      <GSAPInitializer>
        <div className="w-full">
          <main className="flex flex-wrap sm:w-full sm:flex-row">
            <Header />
            <div className="w-full bg-base-100/50 py-8 border-b border-white/5 backdrop-blur-sm">
              <h2 className="text-center text-xl md:text-2xl font-semibold text-gray-400 max-w-5xl mx-auto px-4 tracking-wide">
                {t("hero-subtitle")}
              </h2>
            </div>
            <div className="bg-[#334B5F] w-full lg:pb-5 sm:mt-5">
              <div className='flex flex-wrap w-3/4 m-auto '>
                <div id="about" className="lg:w-full sm:w-full  grow py-5 p-10 sm:p-3 ">
                  <div className='w-full lg:mt-10 '>
                    <h2 className=" font-bold text-4xl text-center mb-5 text-[#00B5A7]">{t("frase")}</h2>
                    <p className=" text-center text-lg text-[#ffffff]">{t("About-us")}</p>
                    <p className=" text-center text-lg text-[#ffffff]">{t("About-us2")}</p>
                    <p className=" text-center text-lg text-[#ffffff]">{t("About-us3")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div id="services" className='w-full flex py-5 p-10 justify-center items-center bg-base-200/50'>
              <div className='lg:w-3/4 m-auto items-center'>
                <h2 className='item-center font-bold text-4xl text-center mb-5 text-primary'>{t("title-services")}</h2>
                <h3 className='item-center font-bold text-2xl text-center mb-5 text-secondary'>{t("subtitle-services")}</h3>
              </div>
            </div>
            <div className="w-full">
              <Carousel />
            </div>
            <div className='w-full flex justify-center items-center mb-10'>
              <h2 className='text-primary center font-bold text-4xl'>{t("title-method")}</h2>
            </div>
            <div id="method" className='w-full mb-15 '>
              <div className='w-3/4 m-auto flex flex-wrap'>
                <div className='lg:w-1/2 grow sm:w-full hover-3d center'>
                  <Image
                    src="/img/idealy-dev.webp"
                    alt='Arquitectura de software y desarrollo a la medida con Next.js y Go'
                    width={600}
                    height={400}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className='object-cover mask mask-squircle overflow-hidden shadow-md'
                  />
                </div>
                <div className='lg:w-1/2 pl-5 grow sm:w-full'>
                  <h2 className='w-full font-bold text-3xl  text-primary'>{t("title-development")}</h2>
                  <p className='w-full mb-5 text-md text-secondary'>{t("subtitle-development")}</p>
                  <p className='w-full text-md'>{t("text-development")}</p>
                  <ul className='list list-disc ml-10'>
                    <li className='list-row'>{t("bullet1")}</li>
                    <li className='list-row'>{t("bullet2")}</li>
                    <li className='list-row'>{t("bullet3")}</li>
                  </ul>
                  <p className='w-full text-md'>{t("text2-development")}</p>
                  <p className='w-full  text-md text-secondary'>{t("frase-dev")}</p>
                  <a href="/services/software-development" aria-label={`${t("button-development")} - ${t("title-development")}`} className="mt-5 btn btn-soft btn-primary"> {t("button-development")} </a>
                </div>
              </div>
            </div>
            <div className='w-full mb-15'>
              <div className='w-3/4 m-auto flex flex-wrap-reverse '>
                <div className='lg:w-1/2 pr-5 sm:w-full grow sm:pl-1'>
                  <h2 className='w-full font-bold text-3xl  mb-5 text-primary'>{t("title-MD")}</h2>
                  <p className='w-full  text-md text-secondary'>{t("subtitle-MD")}</p>
                  <p className='w-full text-md text-justify'>{t("text-MD")}</p>
                  <ul className='list list-disc ml-10'>
                    <li className='list-row'>{t("bullet4")}</li>
                    <li className='list-row'>{t("bullet5")}</li>
                    <li className='list-row'>{t("bullet6")}</li>
                  </ul>
                  <p className='w-full  text-md text-secondary'>{t("frase-MD")}</p>

                </div>
                <div className='lg:w-1/2 sm:w-full grow hover-3d center'>

                  <Image
                    src="/img/idealy-ai-automate.webp"
                    alt='Automatización de procesos con inteligencia artificial y agentes de IA'
                    width={600}
                    height={300}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className=' object-cover mask mask-squircle overflow-hidden shadow-md'
                  />

                </div>

              </div>
            </div>
            <div id="portfolio" className='w-full mb-10'>
              <div className='w-3/4 m-auto flex flex-wrap'>
                <div className='lg:w-1/2 sm:w-full grow hover-3d'>

                  <Image
                    src="/img/idealy-ux-ui.webp"
                    alt='Diseño UX/UI premium e interfaces de usuario para productos digitales'
                    width={600}
                    height={400}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className='object-cover mask mask-squircle overflow-hidden shadow-md'
                  />

                </div>
                <div className='lg:w-1/2 pl-5 grow sm:w-full'>
                  <h2 className='w-full font-bold text-3xl  text-primary'>{t("title-ux")}</h2>
                  <p className='w-full mb-5 text-md text-secondary'>{t("subtitle-ux")}</p>
                  <p className='w-full text-md'>{t("text-ux")}</p>
                  <ul className='list list-disc ml-10'>
                    <li className='list-row'>{t("bullet7")}</li>
                    <li className='list-row'>{t("bullet8")}</li>
                    <li className='list-row'>{t("bullet9")}</li>
                  </ul>
                  <p className='w-full  text-md text-secondary'>{t("frase-ux")}</p>
                  <a href="/services/ux-ui-design" aria-label={`${t("button-ux")} - ${t("title-ux")}`} className="mt-5 btn btn-soft btn-primary"> {t("button-ux")} </a>
                </div>
              </div>
            </div>
            <div className='w-full mb-15'>
              <div className='w-3/4 m-auto flex flex-wrap-reverse '>
                <div className='lg:w-1/2 pr-5 sm:w-full grow sm:pl-1'>
                  <h2 className='w-full font-bold text-3xl  mb-5 text-primary'>{t("title-grow")}</h2>
                  <p className='w-full  text-md text-secondary'>{t("subtitle-grow")}</p>
                  <p className='w-full text-md text-justify'>{t("text-grow")}</p>
                  <ul className='list list-disc ml-10'>
                    <li className='list-row'>{t("bullet10")}</li>
                    <li className='list-row'>{t("bullet11")}</li>
                    <li className='list-row'>{t("bullet12")}</li>
                  </ul>
                  <p className='w-full  text-md text-secondary'>{t("frase-grow")}</p>
                  <a href="/services/digital-marketing" aria-label={`${t("button-grow")} - ${t("title-grow")}`} className="mt-5 btn btn-soft btn-primary"> {t("button-grow")} </a>
                </div>
                <div className='lg:w-1/2 sm:w-full grow hover-3d'>

                  <Image
                    src="/img/idealy-marketing.webp"
                    alt='Estrategia de marketing digital y crecimiento de negocios en línea'
                    width={600}
                    height={300}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className='object-cover mask mask-squircle overflow-hidden shadow-xl'
                  />

                </div>

              </div>
            </div>
            <FAQSection language={locale} />
            <div className='w-full bg-primary pt-10 pb-10 flex flex-wrap'>

              <div className='lg:w-1/3 sm:w-full grow hover-3d items-center p-5'>
                <Image
                  src="/img/Consulting-leo-idealy.jpg"
                  alt='LEO, el consultor de inteligencia artificial de Idea.ly'
                  width={600}
                  height={300}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className='w-[22rem] h-[22rem] ml-10 m-auto  mask mask-squircle shadow-xl'
                />

              </div>
              <div className='lg:w-1/3 pl-1.5 p-3 sm:w-full grow center'>
                <div className='w-full p-5'>
                  <h2 className='w-full font-bold text-3xl  mb-5 text-[#ffffff]'>{t("title-consulting")}</h2>
                  <p className='w-full  text-md text-[#ababab]'>{t("subtitle-consulting")}</p>
                  <p className='w-full text-lg text-justify text-[#ffffff]'>{t("text-consulting")}</p>
                  <p className='w-full text-lg text-justify text-[#ffffff] mt-10'>{t("text-consulting2")}</p>
                  <Link href="/leo" aria-label={`${t("button-consulting")} - ${t("title-consulting")}`} className='btn border-none bg-gradient-to-r from-primary to-purple-600 text-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] mt-10 px-8'>{t("button-consulting")}</Link>
                </div>
              </div>
              <div className="lg:w-1/3 sm:w-full center p-5">
                <h2 className="text-3xl font-bold text-white center">{t("title-stack")}</h2>

                <CardStack />

              </div>
            </div>
            <div id="contact" className='w-full'>

              <Contact />
            </div>
          </main>
          <Footer />
        </div>
      </GSAPInitializer>
    </>
  );
}