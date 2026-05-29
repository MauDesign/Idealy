import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Terminal, Cpu, Layers, TrendingUp, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import Header from "@/app/ui/header/header";
import Contact from "@/app/ui/contact/contact";
import Footer from "@/app/ui/Footer/Footer";
import GSAPInitializer from "@/app/ui/components/GSAPInitializer";
import type { Metadata } from 'next';
import { keywordsByPage } from '@/config/keywords';
import type { locales } from '../../../i18n/routing';

type Props = { params: Promise<{ locale: typeof locales[number] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    alternates: {
      canonical: locale === 'en' ? '/en/services' : '/services',
      languages: {
        en: '/en/services',
        es: '/services',
        'x-default': '/services',
      },
    },
    title: isEn 
      ? "Our Services | Idea.ly — High-Performance Software & AI Automation" 
      : "Nuestros Servicios | Idea.ly — Software de Alto Rendimiento y Automatización",
    description: isEn 
      ? "Explore our custom software development, advanced AI agents, UX/UI premium designs, growth marketing, and digital consulting services."
      : "Explora nuestros servicios de desarrollo de software a la medida, agentes de IA avanzados, diseño UX/UI, marketing digital y consultoría tecnológica.",
    keywords: isEn 
      ? [...keywordsByPage['home-en']] 
      : [...keywordsByPage['home-es']]
  };
}

const serviceMetadata = [
  {
    slug: 'software-development',
    image: '/img/idealy-dev.webp',
    icon: Terminal,
    color: 'from-cyan-500/20 to-blue-600/5',
    borderColor: 'group-hover:border-cyan-500/50'
  },
  {
    slug: 'ai-automation',
    image: '/img/idealy-ai-automate.webp',
    icon: Cpu,
    color: 'from-purple-500/20 to-indigo-600/5',
    borderColor: 'group-hover:border-purple-500/50'
  },
  {
    slug: 'ux-ui-design',
    image: '/img/idealy-ux-ui.webp',
    icon: Layers,
    color: 'from-pink-500/20 to-rose-600/5',
    borderColor: 'group-hover:border-pink-500/50'
  },
  {
    slug: 'digital-marketing',
    image: '/img/idealy-marketing.webp',
    icon: TrendingUp,
    color: 'from-emerald-500/20 to-teal-600/5',
    borderColor: 'group-hover:border-emerald-500/50'
  },
  {
    slug: 'consulting',
    image: '/img/Consulting-leo-idealy.jpg',
    icon: Lightbulb,
    color: 'from-amber-500/20 to-orange-600/5',
    borderColor: 'group-hover:border-amber-500/50'
  }
];

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tPage = await getTranslations('ServicesPage');
  const tDetails = await getTranslations('ServicesDetails');

  return (
    <div className="flex flex-col min-h-screen bg-[#01131b]">
      {/* Hero Banner */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-gradient-to-b from-[#011b27] to-[#01131b]">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
        {/* Ambient background glows */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[250px] rounded-full bg-primary/10 blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[200px] rounded-full bg-[#00B5A7]/10 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            {tPage('badge')}
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none text-white">
            {tPage('title')}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {tPage('subtitle')}
          </p>
        </div>
      </section>

      {/* Main content with GSAP Animations */}
      <main className="flex-grow container mx-auto px-6 pb-24 relative z-10">
        <GSAPInitializer>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-12">
            {serviceMetadata.map((service) => {
              const Icon = service.icon;
              const slug = service.slug;

              // Read translated contents dynamically
              const title = tDetails(`${slug}.title`);
              const subtitle = tDetails(`${slug}.subtitle`);
              const description = tDetails(`${slug}.description`);
              const feature1 = tDetails(`${slug}.feature1_title`);
              const feature2 = tDetails(`${slug}.feature2_title`);
              const feature3 = tDetails(`${slug}.feature3_title`);

              return (
                <div
                  key={slug}
                  className="group hover-3d flex flex-col rounded-3xl overflow-hidden border border-white/5 bg-[#011c27]/60 backdrop-blur-md shadow-2xl hover:shadow-primary/10 hover:border-primary/20 transition-all duration-500 min-h-[580px]"
                >
                  {/* Image container */}
                  <div className="relative aspect-[16/10] bg-base-300 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    {/* Dark gradient overlay on top of the image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#011c27] via-transparent to-black/10" />
                    
                    {/* Icon badge floating on image */}
                    <div className="absolute bottom-4 left-6 flex items-center justify-center p-3 rounded-2xl bg-[#01131b]/90 border border-white/10 backdrop-blur-md text-primary group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Content space */}
                  <div className="p-8 flex flex-col flex-grow justify-between">
                    <div>
                      {/* Subtitle / Category */}
                      <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">
                        {subtitle}
                      </span>
                      
                      {/* Service Title */}
                      <h2 className="text-2xl font-black text-white leading-tight mb-4 tracking-tight group-hover:text-primary transition-colors duration-300">
                        {title}
                      </h2>
                      
                      {/* Small Summary */}
                      <p className="text-slate-300/80 text-sm leading-relaxed mb-6 line-clamp-3">
                        {description}
                      </p>

                      {/* Bullet highlights */}
                      <ul className="space-y-3 mb-8 border-t border-white/5 pt-5">
                        {[feature1, feature2, feature3].map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Saber más Button */}
                    <div className="pt-4 border-t border-white/5">
                      <Link
                        href={`/${locale}/services/${slug}`}
                        className="inline-flex w-full items-center justify-between px-6 py-3.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-primary hover:text-black hover:border-primary hover:-translate-y-0.5 transition-all duration-300 group-hover:shadow-lg"
                      >
                        <span>{tPage('ver_mas')}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA middle banner */}
          <div className="mt-24 p-12 rounded-3xl bg-gradient-to-r from-[#00b4a6]/10 via-[#011c27]/80 to-[#01131b] border border-primary/20 text-center relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-primary/10 blur-[60px]" />
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight relative z-10">
              {tPage('cta_title')}
            </h2>
            <Link
              href={`/${locale}/#contact`}
              className="inline-flex items-center gap-2 bg-primary text-black font-black px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/30 hover:opacity-95 transition-all duration-300 transform hover:-translate-y-0.5 relative z-10"
            >
              {tPage('cta_button')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </GSAPInitializer>

        {/* Contact Form Section */}
        <div id="contact" className="w-full mt-24">
          <Contact />
        </div>
      </main>

      <Footer />
    </div>
  );
}
