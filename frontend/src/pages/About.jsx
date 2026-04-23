import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Award, ArrowRight } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Happy Customers', value: '50k+' },
    { label: 'Products Sold', value: '120k+' },
    { label: 'Expert Team', value: '25+' },
    { label: 'Years Experience', value: '10+' },
  ];

  return (
    <div className="pt-32 pb-20 bg-white overflow-hidden">
      {/* Manifesto Header */}
      <section className="relative min-h-[70vh] flex items-center pt-20">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <h1 className="text-[12vw] font-black text-slate-100 absolute -top-20 -left-10 select-none leading-none tracking-tighter">
              ESSENCE
            </h1>
            <div className="relative z-10">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-12"
              >
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                Est. 2016 / London
              </motion.div>
              <h2 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-12 uppercase italic">
                The <br /> <span className="text-indigo-600">Manifesto.</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-500 max-w-2xl font-medium leading-relaxed">
                We don't just sell products. We curate experiences. Our mission is to redefine luxury through transparency, ethics, and unparalleled craft.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Split */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              style={{ rotate: -2 }}
              className="relative rounded-[4rem] overflow-hidden shadow-2xl border-[15px] border-white/5"
            >
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200" alt="Process" className="w-full h-[700px] object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12">
                <Target className="text-indigo-400 mb-4" size={48} />
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Radical Precision.</h3>
              </div>
            </motion.div>

            <div className="space-y-16">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-6">Our Philosophy</h4>
                <p className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-8">
                  Elegance is the only beauty that <span className="italic text-slate-400">never fades.</span>
                </p>
                <p className="text-lg text-slate-400 font-medium leading-relaxed">
                  Every material we select, every craftsman we partner with, and every line of code we write is dedicated to one goal: providing you with a seamless, superior lifestyle acquisition.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                   { icon: Award, title: 'Heritage Quality', desc: 'Sourced from the finest global labs.' },
                   { icon: Users, title: 'Collective Heart', desc: 'A community of 50k+ enthusiasts.' }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                    <item.icon className="text-emerald-400 mb-4" size={32} />
                    <h5 className="font-black text-sm uppercase tracking-widest mb-2">{item.title}</h5>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Glass */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-slate-50 skew-y-3 origin-right translate-y-20 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass-elite p-12 rounded-[2.5rem] shadow-elite text-center border border-slate-100"
              >
                <h3 className="text-6xl font-black text-slate-900 tracking-tighter mb-2">{stat.value}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-32 max-w-5xl mx-auto px-4 text-center">
        <div className="mb-20">
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 uppercase italic">The Core <span className="text-indigo-600">Pillars.</span></h2>
          <p className="text-xl text-slate-500 font-medium">Built on values that represent the future of commerce.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { tag: '01', title: 'Curated Excellence', desc: 'We filter through thousands of items to bring you only the top 1%.' },
            { tag: '02', title: 'Absolute Truth', desc: 'Full transparency in sourcing and pricing. No hidden narratives.' },
            { tag: '03', title: 'Future Centric', desc: 'Sustainability is not an option; it\'s our primary infrastructure.' }
          ].map((v, i) => (
            <div key={i} className="relative group p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-elite transition-all duration-500">
              <span className="absolute -top-6 -left-6 w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl rotate-[-15deg] group-hover:rotate-0 transition-transform">
                {v.tag}
              </span>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">{v.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
