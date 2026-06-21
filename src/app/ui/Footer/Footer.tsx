'use client';
import { useTranslations } from 'next-intl';
import { Link } from '../../../i18n/navigation';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full bg-neutral" aria-label="Footer">
      <div className="w-3/4 m-auto flex flex-wrap">
        {/* Logo column */}
        <div className="lg:w-1/3 sm:w-full grow p-5">
          <div className="p-3 w-full flex justify-center items-center">
            <Link href="/" aria-label="Idea.ly — ir al inicio">
              <Image
                src="/img/Logo-Idealy.png"
                width={340}
                height={200}
                alt="Idea.ly — Estudio de Software y Automatización con IA"
              />
            </Link>
          </div>
        </div>

        {/* Social links column */}
        <div className="lg:w-1/3 sm:w-full grow p-5">
          <div className="flex w-full justify-center items-center">
            {/* h2 is correct here — footer headings should not be h1 */}
            <h2 className="font-bold text-2xl justify-center text-center text-neutral-content">
              {t('foot-title1')}
            </h2>
          </div>
          <nav aria-label="Redes sociales">
            <ul className="list text-slate-300 space-y-1.5 pt-2 text-center lg:text-left">
              <li>
                <a
                  href="https://www.facebook.com/idealymx"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Idea.ly en Facebook (abre en nueva pestaña)"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/idea.ly_design/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Idea.ly en Instagram (abre en nueva pestaña)"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/idealy_mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Idea.ly en X / Twitter (abre en nueva pestaña)"
                  className="hover:text-primary transition-colors duration-200"
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/idea-ly-mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Idea.ly en LinkedIn (abre en nueva pestaña)"
                  className="hover:text-primary transition-colors duration-200"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@idealy.com.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Idea.ly en TikTok (abre en nueva pestaña)"
                  className="hover:text-primary transition-colors duration-200"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Legal links column */}
        <div className="lg:w-1/3 sm:w-full grow p-5">
          <div className="flex w-full justify-center items-center">
            <h2 className="font-bold text-2xl justify-center text-center text-neutral-content">
              {t('foot-title2')}
            </h2>
          </div>
          <nav aria-label="Enlaces legales">
            <ul className="list text-neutral-content text-center">
              <li>
                <Link href="/privacy-policy" className="hover:text-[#00B5A7] transition-colors">
                  {t('privacy-policy')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
