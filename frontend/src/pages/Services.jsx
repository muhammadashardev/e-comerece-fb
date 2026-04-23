import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Headphones, RefreshCcw, CreditCard, Gift, Globe, Zap } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, desc, color }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group"
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${color}`}>
      <Icon size={32} className="group-hover:scale-110 transition-transform" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
  </motion.div>
);

const Services = () => {
  const services = [
    { icon: Truck, title: 'Express Delivery', desc: 'Enjoy lightning-fast shipping on all orders. Get your favorite items delivered to your doorstep in 24-48 hours.', color: 'bg-blue-50 text-blue-600' },
    { icon: ShieldCheck, title: 'Secure Shopping', desc: 'Your security is our priority. We use industry-standard encryption to protect your data and transactions.', color: 'bg-emerald-50 text-emerald-600' },
    { icon: Headphones, title: '24/7 Support', desc: 'Our dedicated support team is always here to help you. Reach out to us anytime through chat, email, or phone.', color: 'bg-purple-50 text-purple-600' },
    { icon: RefreshCcw, title: 'Easy Returns', desc: 'Not satisfied with your purchase? No worries! We offer a hassle-free 30-day return policy for all products.', color: 'bg-rose-50 text-rose-600' },
    { icon: CreditCard, title: 'Flexible Payments', desc: 'Choose from multiple payment options including Credit cards, PayPal, and interest-free installment plans.', color: 'bg-amber-50 text-amber-600' },
    { icon: Gift, title: 'Gift Premium', desc: 'Make someone\'s day special with our elegant gift wrapping and personalized messaging services.', color: 'bg-indigo-50 text-indigo-600' },
    { icon: Globe, title: 'Global Sourcing', desc: 'We travel the world to bring you unique, high-quality products that you won\'t find anywhere else.', color: 'bg-cyan-50 text-cyan-600' },
    { icon: Zap, title: 'Instant Rewards', desc: 'Join our loyalty program and earn points on every purchase. Redeem them for exclusive discounts and perks.', color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="pt-32 pb-20 bg-white overflow-hidden">
      {/* Service Header */}
      <section className="relative py-32 border-b border-slate-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[150px] -mr-96 -mt-96" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50/30 rounded-full blur-[120px] -ml-72 -mb-72" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-8">Service Intelligence</h4>
            <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-12 uppercase italic">
              Elite <br /> <span className="text-indigo-600">Protocols.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl font-medium leading-relaxed">
              Every interaction is an opportunity for excellence. We provide a bespoke infrastructure designed for the most discerning global clientele.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Matrix */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-elite transition-all duration-500"
            >
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-lg group-hover:rotate-6 transition-transform ${service.color.split(' ')[0]} ${service.color.split(' ')[1]}`}>
                <service.icon size={32} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">{service.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{service.desc}</p>
              <div className="h-[1px] bg-slate-100 italic" />
              <div className="pt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600">Active Service</span>
                <Zap size={14} className="text-indigo-600" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Corporate Protocol Timeline */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-24 uppercase">The Fulfillment <span className="text-indigo-400">Roadmap.</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
             {/* Connector Line */}
             <div className="hidden md:block absolute top-12 left-12 right-12 h-[2px] bg-white/10 -z-10" />

             {[
               { id: 'I', title: 'Curated Discovery', desc: 'Precise selection of global excellence.' },
               { id: 'II', title: 'Encrypted Checkout', desc: 'Multi-layer security protocols.' },
               { id: 'III', title: 'Global Logistics', desc: 'Insured international transit.' },
               { id: 'IV', title: 'Elite Delivery', desc: 'Direct to your established sanctuary.' }
             ].map((step, i) => (
               <div key={i} className="flex flex-col items-center">
                 <div className="w-24 h-24 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black text-indigo-400 mb-8 hover:bg-white hover:text-slate-900 transition-all cursor-default">
                    {step.id}
                 </div>
                 <h4 className="text-sm font-black uppercase tracking-widest mb-4">{step.title}</h4>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{step.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Elite Partnership CTA */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative glass-elite rounded-[4rem] p-16 md:p-32 overflow-hidden bg-slate-50 border border-slate-100 text-center group">
          <div className="absolute top-0 right-0 p-20 opacity-5 group-hover:opacity-10 transition-opacity">
            <Globe size={300} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-12 uppercase italic leading-none">
              Initiate <span className="text-indigo-600">The Discovery.</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="h-20 px-16 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-900/40">
                Enter The Shop
              </button>
              <button className="h-20 px-16 bg-white border-2 border-slate-900 text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-50 transition-all">
                Contact Concierge
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
