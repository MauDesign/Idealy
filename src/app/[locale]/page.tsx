import { getTranslations } from 'next-intl/server';
import Image from "next/image";
import Header from "@/app/ui/header/header";
import Carousel from "@/app/ui/carousel/carousel";
import Contact from "@/app/ui/contact/contact";
import Footer from "@/app/ui/Footer/Footer";
import { setRequestLocale } from 'next-intl/server';
import GSAPInitializer from "@/app/ui/components/GSAPInitializer";
import CardStack from "@/app/ui/cardstack/cardstak";

import type { locales } from '../../i18n/routing'
type Props = { params: Promise<{ locale: typeof locales[number] }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Home');
  return (
    <GSAPInitializer>
      <div className="w-full">
        <main className="flex flex-wrap sm:w-full sm:flex-row">
          <Header />
          <div className="bg-[#334B5F]  lg:pb-5 sm:mt-5 ">
            <div className='flex flex-wrap w-3/4 m-auto '>
              <div id="about" className="lg:w-full sm:w-full  grow py-5 p-10 sm:p-3 ">
                <div className='w-full lg:mt-10 '>
                  <h1 className=" font-bold text-4xl text-center mb-5 text-[#00B5A7]">{t("frase")}</h1>
                  <p className=" text-center text-lg text-[#ffffff]">{t("About-us")}</p>
                  <p className=" text-center text-lg text-[#ffffff]">{t("About-us2")}</p>
                  <p className=" text-center text-lg text-[#ffffff]">{t("About-us3")}</p>
                </div>
              </div>
            </div>
          </div>
          <div id="services" className='w-full flex py-5 p-10 justify-center items-center bg-base-200/50'>
            <div className='lg:w-3/4 m-auto items-center'>
              <h1 className='item-center font-bold text-4xl text-center mb-5 text-primary'>{t("title-services")}</h1>
              <h3 className='item-center font-bold text-2xl text-center mb-5 text-secondary'>{t("subtitle-services")}</h3>
            </div>
          </div>
          <div className="w-full">
            <Carousel />
          </div>
          <div className='w-full flex justify-center items-center mb-10'>
            <h1 className='text-primary center font-bold text-4xl'>{t("title-method")}</h1>
          </div>
          <div id="services" className='w-full mb-15 '>
            <div className='w-3/4 m-auto flex flex-wrap'>
              <div className='lg:w-1/2 grow sm:w-full hover-3d center'>
                <Image
                  src="/img/idealy-dev.webp"
                  alt='Desarrollo a la medida'
                  width={600}
                  height={400}
                  className='object-cover mask mask-squircle overflow-hidden shadow-md'
                />
              </div>
              <div className='lg:w-1/2 pl-5 grow sm:w-full'>
                <h2 className='w-full font-bold text-3xl  text-[#00B5A7]'>{t("title-development")}</h2>
                <p className='w-full mb-5 text-md text-[#0069a9]'>{t("subtitle-development")}</p>
                <p className='w-full text-md'>{t("text-development")}</p>
                <ul className='list list-disc ml-10'>
                  <li className='list-row'>{t("bullet1")}</li>
                  <li className='list-row'>{t("bullet2")}</li>
                  <li className='list-row'>{t("bullet3")}</li>
                </ul>
                <p className='w-full text-md'>{t("text2-development")}</p>
                <p className='w-full  text-md text-[#00B5A7]'>{t("frase-dev")}</p>
                <a role="button" href="#" className="mt-5 btn btn-soft btn-primary"> {t("button-development")} </a>
              </div>
            </div>
          </div>
          <div className='w-full mb-15'>
            <div className='w-3/4 m-auto flex flex-wrap-reverse '>
              <div className='lg:w-1/2 pr-5 sm:w-full grow sm:pl-1'>
                <h2 className='w-full font-bold text-3xl  mb-5 text-[#00B5A7]'>{t("title-MD")}</h2>
                <p className='w-full  text-md text-[#ababab]'>{t("subtitle-MD")}</p>
                <p className='w-full text-md text-justify'>{t("text-MD")}</p>
                <ul className='list list-disc ml-10'>
                  <li className='list-row'>{t("bullet4")}</li>
                  <li className='list-row'>{t("bullet5")}</li>
                  <li className='list-row'>{t("bullet6")}</li>
                </ul>
                <p className='w-full  text-md text-[#00B5A7]'>{t("frase-MD")}</p>

              </div>
              <div className='lg:w-1/2 sm:w-full grow hover-3d center'>

                <Image
                  src="/img/idealy-ai-automate.webp"
                  alt='Desarrollo a la medida'
                  width={600}
                  height={300}
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
                  alt='Desarrollo a la medida'
                  width={600}
                  height={400}
                  className='object-cover mask mask-squircle overflow-hidden shadow-md'
                />

              </div>
              <div className='lg:w-1/2 pl-5 grow sm:w-full'>
                <h2 className='w-full font-bold text-3xl  text-[#00B5A7]'>{t("title-ux")}</h2>
                <p className='w-full mb-5 text-md text-[#0069a9]'>{t("subtitle-ux")}</p>
                <p className='w-full text-md'>{t("text-ux")}</p>
                <ul className='list list-disc ml-10'>
                  <li className='list-row'>{t("bullet7")}</li>
                  <li className='list-row'>{t("bullet8")}</li>
                  <li className='list-row'>{t("bullet9")}</li>
                </ul>
                <p className='w-full  text-md text-[#00B5A7]'>{t("frase-ux")}</p>
                <a role="button" href="#" className="mt-5 btn btn-soft btn-primary"> {t("button-ux")} </a>
              </div>
            </div>
          </div>
          <div className='w-full mb-15'>
            <div className='w-3/4 m-auto flex flex-wrap-reverse '>
              <div className='lg:w-1/2 pr-5 sm:w-full grow sm:pl-1'>
                <h2 className='w-full font-bold text-3xl  mb-5 text-[#00B5A7]'>{t("title-grow")}</h2>
                <p className='w-full  text-md text-[#ababab]'>{t("subtitle-grow")}</p>
                <p className='w-full text-md text-justify'>{t("text-grow")}</p>
                <ul className='list list-disc ml-10'>
                  <li className='list-row'>{t("bullet10")}</li>
                  <li className='list-row'>{t("bullet11")}</li>
                  <li className='list-row'>{t("bullet12")}</li>
                </ul>
                <p className='w-full  text-md text-[#00B5A7]'>{t("frase-grow")}</p>
                <a role="button" href="#" className="mt-5 btn btn-soft btn-primary"> {t("button-grow")} </a>
              </div>
              <div className='lg:w-1/2 sm:w-full grow hover-3d'>

                <Image
                  src="/img/idealy-marketing.webp"
                  alt='Desarrollo a la medida'
                  width={600}
                  height={300}
                  className='object-cover mask mask-squircle overflow-hidden shadow-xl'
                />

              </div>

            </div>
          </div>
          <div className='w-full bg-primary pt-10 pb-10 flex flex-wrap'>

            <div className='lg:w-1/3 sm:w-full grow hover-3d items-center p-5'>
              <Image
                src="/img/Consulting-leo-idealy.jpg"
                alt='Desarrollo a la medida'
                width={600}
                height={300}
                className='w-[22rem] h-[22rem] m-auto  mask mask-squircle shadow-xl center align-center'
              />

            </div>
            <div className='lg:w-1/3 pl-1.5 p-3 sm:w-full grow center'>
              <div className='w-full p-5'>
                <h2 className='w-full font-bold text-3xl  mb-5 text-[#ffffff]'>{t("title-consulting")}</h2>
                <p className='w-full  text-md text-[#ababab]'>{t("subtitle-consulting")}</p>
                <p className='w-full text-lg text-justify text-[#ffffff]'>{t("text-consulting")}</p>
                <p className='w-full text-lg text-justify text-[#ffffff] mt-10'>{t("text-consulting2")}</p>
                <button className='btn btn-outline btn-primary mt-10'>{t("button-consulting")}</button>
              </div>
            </div>
            <div className="lg:w-1/3 sm:w-full center p-5">
              <h1 className="text-3xl font-bold text-white item-center">{t("title-stack")}</h1>

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
  );
}