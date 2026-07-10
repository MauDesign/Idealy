'use client';

import { motion } from 'framer-motion';
import { BrainCircuit, LineChart, Cpu, Rocket, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LeoClient({ texts }: { texts: Record<string, string> }) {
  return (
    <div className="w-full text-white bg-black pb-24 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] opacity-40 pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-56 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto mb-10 w-48 h-48 md:w-56 md:h-56 relative"
        >
          <Image 
            src="/img/Consulting-leo-idealy.jpg" 
            alt="LEO AI Consultant" 
            fill 
            sizes="(max-width: 768px) 192px, 224px"
            className="object-cover mask mask-squircle shadow-[0_0_50px_-10px] shadow-primary/40" 
          />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-black mb-6 tracking-tighter"
        >
          {texts.hero_title}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
        >
          {texts.hero_subtitle}
        </motion.p>
      </section>

      {/* Agency Subtitle */}
      <div className="w-full bg-white/5 py-6 border-y border-white/10 backdrop-blur-sm relative z-20">
        <h2 className="text-center text-lg md:text-xl font-semibold text-gray-400 max-w-5xl mx-auto px-4 tracking-wide">
          {texts.agency_subtitle}
        </h2>
      </div>

      {/* What is LEO Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square md:aspect-auto md:h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <Image 
              src="/img/Consulting-leo-idealy.jpg" 
              alt="LEO AI Consultant" 
              fill 
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary tracking-tight">{texts.what_is_leo}</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              {texts.what_is_leo_desc}
            </p>
            <div className="flex flex-col gap-6">
              {[
                { icon: BrainCircuit, text: texts.benefit_2_desc },
                { icon: LineChart, text: texts.benefit_1_desc },
                { icon: Cpu, text: texts.process_3_desc }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <p className="text-gray-300 mt-1">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 tracking-tight">{texts.process_title}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: texts.process_1, desc: texts.process_1_desc },
            { step: texts.process_2, desc: texts.process_2_desc },
            { step: texts.process_3, desc: texts.process_3_desc }
          ].map((process, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">{process.step}</h3>
              <p className="text-gray-400 leading-relaxed">{process.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-24 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/30 shadow-2xl shadow-primary/20"
        >
          <Rocket className="w-16 h-16 text-primary mx-auto mb-8" />
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">{texts.cta_title}</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {texts.cta_desc}
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-full hover:bg-primary/80 transition-colors text-lg shadow-xl shadow-primary/30">
            {texts.cta_button}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
