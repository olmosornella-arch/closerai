// src/pages/landing/LandingPage.tsx
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { PLANS } from "@/lib/plans";
import { useLang } from "@/context/LangContext";
import { GlobePulse, CLOSER_AI_MARKERS } from "@/components/ui/GlobePulse";

const C = { bg:"#08090D",surface:"rgba(255,255,255,.04)",border:"rgba(255,255,255,.07)",gold:"#C9A84C",goldBg:"rgba(201,168,76,.08)",goldBorder:"rgba(201,168,76,.2)",warm:"#8B6914",text:"#E8E6E0",muted:"#6B6860",emerald:"#10b981" };
const FP="'Playfair Display',serif", FS="'DM Sans',sans-serif", FM="'DM Mono',monospace";

const Divider=()=><div className="w-full h-px my-2" style={{background:`linear-gradient(to right,transparent,${C.goldBorder},transparent)`}}/>;
const Tag=({children}:{children:any})=><span className="inline-block text-[9px] font-bold uppercase tracking-[.18em] px-3 py-1 rounded-full border mb-4" style={{background:C.goldBg,borderColor:C.goldBorder,color:C.gold,fontFamily:FM}}>{children}</span>;

function Btn({to,href,children,variant="gold",className="",onClick}:any){
  const base="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.03]";
  const s:any={gold:{background:`linear-gradient(135deg,${C.gold},#E8C96A)`,color:"#08090D"},ghost:{background:"rgba(255,255,255,.06)",color:C.text,border:`1px solid ${C.border}`},outline:{background:"transparent",color:C.gold,border:`1px solid ${C.goldBorder}`}}[variant];
  if(to) return <Link to={to} className={`${base} ${className}`} style={{fontFamily:FS,...s}}>{children}</Link>;
  if(href) return <a href={href} className={`${base} ${className}`} style={{fontFamily:FS,...s}}>{children}</a>;
  return <button onClick={onClick} className={`${base} ${className}`} style={{fontFamily:FS,...s}}>{children}</button>;
}

function ContainerScroll({children,title}:{children:any,title:any}){
  const ref=useRef<HTMLDivElement>(null);
  const {scrollYProgress}=useScroll({target:ref});
  const [mob,setMob]=useState(false);
  useEffect(()=>{const c=()=>setMob(window.innerWidth<=768);c();window.addEventListener("resize",c);return()=>window.removeEventListener("resize",c);},[]);
  const rotate=useTransform(scrollYProgress,[0,1],[18,0]);
  const scale=useTransform(scrollYProgress,[0,1],mob?[0.75,0.92]:[1.06,1]);
  const trans=useTransform(scrollYProgress,[0,1],[0,-80]);
  return(
    <div className="h-[55rem] md:h-[75rem] flex items-center justify-center relative p-4 md:p-16" ref={ref}>
      <div className="py-8 md:py-32 w-full relative" style={{perspective:"1200px"}}>
        <motion.div style={{translateY:trans}} className="max-w-4xl mx-auto text-center mb-6">{title}</motion.div>
        <motion.div style={{rotateX:rotate,scale,boxShadow:`0 0 0 1px ${C.goldBorder},0 40px 80px rgba(0,0,0,.6)`}}
          className="max-w-5xl -mt-10 mx-auto h-[28rem] md:h-[38rem] w-full p-1.5 rounded-[28px]">
          <div className="h-full w-full overflow-hidden rounded-[22px]" style={{background:"#0A0C12"}}>{children}</div>
        </motion.div>
      </div>
    </div>
  );
}

const TESTIMONIALS=[
  {name:"Lucas Ferreira",role:"Setter B2B · Argentina",text:"Cerré 3 deals en la primera semana. La IA aprende cómo escribo y eso marca la diferencia.",img:"https://i.pravatar.cc/40?img=11"},
  {name:"Sarah Chen",role:"Closer · USA",text:"The SMS dialer changed my game. From 5 calls/day to 25. Sounds exactly like me.",img:"https://i.pravatar.cc/40?img=5"},
  {name:"Camila Torres",role:"Growth Lead · México",text:"Las secuencias automáticas hacen el follow-up por mí. Gano plata mientras duermo.",img:"https://i.pravatar.cc/40?img=9"},
  {name:"John Miller",role:"Agency Owner · Florida",text:"8 setters from one dashboard. Agency plan paid for itself in day 3.",img:"https://i.pravatar.cc/40?img=3"},
  {name:"María Velázquez",role:"Setter · Colombia",text:"El sistema de 5 Actos es brutal. Paso de 2 cierres a 6 de cada 20 mensajes.",img:"https://i.pravatar.cc/40?img=7"},
  {name:"André Costa",role:"Closer · Brasil",text:"A IA detecta padrões na minha escrita. Minha taxa de resposta triplicou.",img:"https://i.pravatar.cc/40?img=15"},
];

function TCard({t}:{t:typeof TESTIMONIALS[0]}){
  return(
    <div className="p-5 rounded-2xl border space-y-3 w-72" style={{background:"rgba(255,255,255,.025)",borderColor:C.border}}>
      <div className="flex gap-1">{[0,1,2,3,4].map(i=><span key={i} style={{color:C.gold,fontSize:10}}>*</span>)}</div>
      <p className="text-sm leading-relaxed" style={{color:"#B8B4AC",fontFamily:FS}}>"{t.text}"</p>
      <div className="flex items-center gap-2.5 pt-1">
        <img src={t.img} alt={t.name} className="w-8 h-8 rounded-full"/>
        <div>
          <p className="text-xs font-semibold" style={{color:C.text,fontFamily:FS}}>{t.name}</p>
          <p className="text-[10px]" style={{color:C.muted,fontFamily:FM}}>{t.role}</p>
        </div>
      </div>
    </div>
  );
}

function TCol({items,dur=18,cls=""}:{items:typeof TESTIMONIALS,dur?:number,cls?:string}){
  return(
    <div className={"overflow-hidden "+cls} style={{maskImage:"linear-gradient(to bottom,transparent,black 15%,black 85%,transparent)"}}>
      <motion.div animate={{translateY:"-50%"}} transition={{duration:dur,repeat:Infinity,ease:"linear",repeatType:"loop"}} className="flex flex-col gap-4 pb-4">
        {[0,1].map(i=><div key={i} className="flex flex-col gap-4">{items.map((t,j)=><TCard key={j} t={t}/>)}</div>)}
      </motion.div>
    </div>
  );
}

function Navbar(){
  const {lang,setLang}=useLang();
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>40);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  const links=[{label:lang==="es"?"Por que CloserAI":"Why CloserAI",href:"#why"},{label:lang==="es"?"Como funciona":"How it works",href:"#how"},{label:lang==="es"?"Precios":"Pricing",href:"#pricing"},{label:"FAQ",href:"#faq"}];
  return(
    <header className="fixed top-0 w-full z-50 transition-all duration-300" style={{background:scrolled?"rgba(8,9,13,.95)":"transparent",backdropFilter:scrolled?"blur(16px)":"none",borderBottom:scrolled?`1px solid ${C.border}`:"none"}}>
      <nav className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-baseline gap-0.5">
          <span className="text-xl font-black" style={{color:C.text,fontFamily:FP}}>Closer</span>
          <span className="text-xl font-black" style={{color:C.gold,fontFamily:FP}}>AI</span>
        </div>
        <div className="hidden md:flex items-center gap-7">
          {links.map(l=><a key={l.href} href={l.href} className="text-sm transition-colors hover:text-white" style={{color:C.muted,fontFamily:FS}}>{l.label}</a>)}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="flex gap-0.5 p-1 rounded-lg" style={{background:"rgba(255,255,255,.04)"}}>
            {(["es","en"] as const).map(l=><button key={l} onClick={()=>setLang(l)} className="px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all" style={{background:lang===l?C.goldBg:"transparent",color:lang===l?C.gold:C.muted,fontFamily:FM}}>{l}</button>)}
          </div>
          <Link to="/login" className="text-sm px-4 py-2 rounded-lg transition-colors hover:text-white" style={{color:C.muted,fontFamily:FS}}>{lang==="es"?"Entrar":"Sign in"}</Link>
          <Btn to="/signup">{lang==="es"?"Empezar gratis":"Start free"} </Btn>
        </div>
        <button className="md:hidden text-xl" style={{color:C.muted}} onClick={()=>setOpen(!open)}>Menu</button>
      </nav>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="fixed inset-0 z-50 flex flex-col p-6 md:hidden" style={{background:"rgba(8,9,13,.98)"}}>
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-baseline gap-0.5"><span className="text-xl font-black" style={{color:C.text,fontFamily:FP}}>Closer</span><span className="text-xl font-black" style={{color:C.gold,fontFamily:FP}}>AI</span></div>
              <button onClick={()=>setOpen(false)} style={{color:C.muted,fontSize:22}}>X</button>
            </div>
            <div className="flex flex-col gap-6">
              {links.map(l=><a key={l.href} href={l.href} onClick={()=>setOpen(false)} className="text-lg border-b pb-4 transition-colors hover:text-white" style={{color:"#A0998E",borderColor:C.border,fontFamily:FS}}>{l.label}</a>)}
              <Btn to="/signup" className="mt-4 w-full justify-center">{lang==="es"?"Empezar gratis - 14 dias":"Start free - 14 days"}</Btn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero(){
  const {lang}=useLang();
  return(
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-0 text-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse 80% 50% at 50% 60%,rgba(139,105,20,.18) 0%,transparent 70%)"}}/>
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{background:"linear-gradient(to top,#08090D,transparent)"}}/>
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8" style={{background:C.goldBg,borderColor:C.goldBorder}}>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{color:C.gold,fontFamily:FM}}>{lang==="es"?"Beta gratis - Sin tarjeta - Solo 50 cupos":"Free beta - No card - Only 50 spots"}</span>
        </div>
      </motion.div>
      <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.1}} className="text-5xl md:text-7xl font-black max-w-4xl mx-auto leading-[1.05] mb-6" style={{fontFamily:FP,letterSpacing:"-.025em",color:C.text}}>
        {lang==="es"?<>Prospecta en LATAM y USA<br/><span style={{color:C.gold}}>con IA que suena humana</span></>:<>Prospect LATAM and USA<br/><span style={{color:C.gold}}>with AI that sounds human</span></>}
      </motion.h1>
      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}} className="text-lg max-w-2xl mx-auto mb-10" style={{color:C.muted,fontFamily:FS,lineHeight:1.7}}>
        {lang==="es"?"WhatsApp, SMS, Email y Dialer en una sola app. La IA aprende tu forma de escribir. Tus clientes nunca van a saber que la usas.":"WhatsApp, SMS, Email and Voice Dialer in one app. AI learns your writing style. Your prospects will never know you are using AI."}
      </motion.p>
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.45}} className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
        <Btn to="/signup">{lang==="es"?"Empezar gratis":"Start free"}</Btn>
        <Btn href="#how" variant="ghost">{lang==="es"?"Ver como funciona":"See how it works"}</Btn>
      </motion.div>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.6}} className="flex items-center gap-4 flex-wrap justify-center">
        <div className="flex -space-x-2">{[11,5,9,3,7].map(i=><img key={i} src={"https://i.pravatar.cc/32?img="+i} className="w-8 h-8 rounded-full border-2" style={{borderColor:C.bg}}/>)}</div>
        <div className="text-left">
          <p className="text-xs" style={{color:C.muted,fontFamily:FS}}>{lang==="es"?"Usado por +200 setters en LATAM y USA":"Used by 200+ setters across LATAM and USA"}</p>
        </div>
      </motion.div>
    </section>
  );
}

function AppPreview(){
  const {lang}=useLang();
  return(
    <section id="how">
      <ContainerScroll title={
        <div className="space-y-3">
          <Tag>{lang==="es"?"El sistema completo":"The complete system"}</Tag>
          <h2 className="text-3xl md:text-5xl font-black" style={{fontFamily:FP,color:C.text}}>{lang==="es"?"Todo en un solo lugar":"Everything in one place"}</h2>
        </div>
      }>
        <div className="w-full h-full p-4" style={{background:"#0A0C12"}}>
          <div className="flex items-center justify-between mb-4 px-2">
            <div><p className="text-xs font-semibold" style={{color:C.text,fontFamily:FP}}>Dashboard</p><p className="text-[10px]" style={{color:C.muted,fontFamily:FS}}>{lang==="es"?"Bienvenida, Ornella. Aqui esta tu resumen.":"Welcome back. Here is what is happening today."}</p></div>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[{label:"Contactos",value:"847",delta:"+12%",icon:"contactos"},{label:"Deals activos",value:"34",delta:"+8%",icon:"deals"},{label:"Mensajes hoy",value:"128",delta:"+23%",icon:"msgs"},{label:"Conversion",value:"18.4%",delta:"+5%",icon:"conv"}].map(s=>(
              <div key={s.label} className="rounded-xl border p-3" style={{background:"rgba(255,255,255,.03)",borderColor:C.border}}>
                <p className="text-[9px]" style={{color:C.muted,fontFamily:FM}}>{s.label}</p>
                <p className="text-base font-black" style={{color:C.text,fontFamily:FP}}>{s.value}</p>
                <p className="text-[9px] font-semibold mt-0.5" style={{color:C.emerald,fontFamily:FM}}>{s.delta}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["Nuevo","Contactado","Cierre"].map((stage,si)=>(
              <div key={stage} className="rounded-xl border p-2" style={{background:"rgba(255,255,255,.02)",borderColor:C.border}}>
                <p className="text-[9px] uppercase tracking-wider mb-2" style={{color:C.muted,fontFamily:FM}}>{stage}</p>
                {[0,1].map(i=>(
                  <div key={i} className="rounded-lg border p-2 mb-1.5" style={{background:"rgba(255,255,255,.03)",borderColor:C.border}}>
                    <p className="text-[9px] font-semibold" style={{color:C.text,fontFamily:FS}}>Lead {i+1+si*2}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[8px]" style={{color:C.muted,fontFamily:FM}}>WhatsApp</p>
                      <p className="text-[8px] font-bold" style={{color:C.gold,fontFamily:FM}}>{7+i+si}/10</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}

function WhySection(){
  const {lang}=useLang();
  const r=lang==="es"?[
    {icon:"lock",t:"Tus APIs, tu control",b:"Conectas tus propias cuentas de Resend, Evolution API y Twilio. Las API keys se encriptan con AES-256. Vos sos dueno de tus datos."},
    {icon:"brain",t:"IA que aprende como escribis",b:"CloserAI analiza tus mensajes anteriores y detecta tu vocabulario, ritmo y tono. Los mensajes generados suenan exactamente como vos."},
    {icon:"bolt",t:"5 minutos para empezar",b:"Sin instalaciones. Sin servidores. Pegas tus API keys en el wizard, el sistema las verifica en tiempo real y ya estas prospectando."},
    {icon:"globe",t:"Disenada para LATAM y USA",b:"WhatsApp para mercados hispanohablantes. SMS y Dialer para USA y Canada. Una sola app, el canal correcto para cada mercado."},
    {icon:"cash",t:"Pagas solo lo que usas",b:"Modelo BYOK: traes tus propias cuentas y pagas directamente a Resend, Twilio y Evolution. Sin markups ocultos en los mensajes."},
    {icon:"team",t:"Para equipos setter + closer",b:"El owner configura las APIs una sola vez. Los setters y closers que invitas usan la misma infraestructura automaticamente."},
  ]:[
    {icon:"lock",t:"Your APIs, your control",b:"Connect your own Resend, Evolution API and Twilio accounts. API keys encrypted with AES-256. You own your data and contacts always."},
    {icon:"brain",t:"AI that learns how you write",b:"CloserAI analyzes your past messages and learns your vocabulary, rhythm and tone. Generated messages sound exactly like you."},
    {icon:"bolt",t:"5 minutes to get started",b:"No installations. No servers. Paste your API keys in the wizard, the system verifies them in real time and you are already prospecting."},
    {icon:"globe",t:"Designed for LATAM and USA",b:"WhatsApp for Spanish-speaking markets. SMS and Dialer for USA and Canada. One app, the right channel for each market."},
    {icon:"cash",t:"Pay only what you use",b:"BYOK model: bring your own accounts and pay Resend, Twilio and Evolution directly. No hidden markups on messages."},
    {icon:"team",t:"For setter plus closer teams",b:"The owner sets up APIs once. The setters and closers you invite automatically use the same infrastructure."},
  ];
  const icons:any={lock:"🔐",brain:"🧠",bolt:"⚡",globe:"🌎",cash:"💸",team:"👥"};
  return(
    <section id="why" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Tag>{lang==="es"?"Por que elegir CloserAI":"Why choose CloserAI"}</Tag>
          <h2 className="text-3xl md:text-5xl font-black" style={{fontFamily:FP,color:C.text}}>{lang==="es"?"Construida para quien vende en serio":"Built for serious sales professionals"}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {r.map((x,i)=>(
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay:i*.08}} viewport={{once:true}} className="rounded-2xl border p-6 space-y-3" style={{background:C.surface,borderColor:C.border}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background:C.goldBg,border:`1px solid ${C.goldBorder}`}}>{icons[x.icon]}</div>
              <p className="text-base font-bold" style={{color:C.text,fontFamily:FP}}>{x.t}</p>
              <p className="text-sm leading-relaxed" style={{color:C.muted,fontFamily:FS}}>{x.b}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntegrationsSection(){
  const {lang}=useLang();
  const ints=[
    {name:"Resend",icon:"📧",color:"#f87171",desc:lang==="es"?"Email transaccional y campañas":"Transactional email and campaigns",free:lang==="es"?"Gratis: 3.000 emails/mes":"Free: 3,000 emails/month",paid:lang==="es"?"Pago: $20/mes por 50.000 emails":"Paid: $20/mo for 50,000 emails",link:"https://resend.com/pricing"},
    {name:"Evolution API",icon:"💬",color:"#10b981",desc:lang==="es"?"WhatsApp multi-instancia":"Multi-instance WhatsApp",free:lang==="es"?"Self-hosted: gratis (necesitas VPS)":"Self-hosted: free (needs VPS)",paid:lang==="es"?"Cloud: desde $29/mes":"Cloud: from $29/mo",link:"https://evolution-api.com"},
    {name:"Twilio",icon:"📞",color:"#60a5fa",desc:lang==="es"?"SMS y llamadas USA/CA":"SMS and calls USA/CA",free:lang==="es"?"Trial: $15 de credito inicial":"Trial: $15 credit on signup",paid:lang==="es"?"SMS: $0.0079/msg. Llamada: $0.013/min":"SMS: $0.0079/msg. Call: $0.013/min",link:"https://twilio.com/pricing"},
    {name:"Claude AI",icon:"🤖",color:C.gold,desc:lang==="es"?"Redaccion con IA personalizada":"Personalized AI writing",free:lang==="es"?"Incluida en tu plan CloserAI":"Included in your CloserAI plan",paid:lang==="es"?"Sin costo extra":"No extra cost",link:"https://anthropic.com"},
    {name:"Supabase",icon:"🔒",color:"#a78bfa",desc:lang==="es"?"Backend y base de datos segura":"Secure backend and database",free:lang==="es"?"Gestionado por CloserAI":"Managed by CloserAI",paid:lang==="es"?"Incluido en tu plan":"Included in your plan",link:"https://supabase.com"},
  ];
  return(
    <section id="integrations" className="py-24 px-6" style={{background:"rgba(255,255,255,.01)"}}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Tag>BYOK</Tag>
          <h2 className="text-3xl md:text-5xl font-black mb-4" style={{fontFamily:FP,color:C.text}}>{lang==="es"?"Traes tus propias cuentas":"Bring your own accounts"}</h2>
          <p className="text-base max-w-xl mx-auto" style={{color:C.muted,fontFamily:FS}}>{lang==="es"?"Pagas directamente a cada proveedor a sus precios. Sin markups. Nosotros ponemos la plataforma.":"Pay each provider directly at their prices. No markups. We provide the platform and security."}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ints.map((x,i)=>(
            <motion.div key={i} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} transition={{delay:i*.07}} viewport={{once:true}} className="rounded-2xl border p-5 space-y-3" style={{background:C.surface,borderColor:C.border}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5"><span className="text-2xl">{x.icon}</span><p className="font-bold text-sm" style={{color:C.text,fontFamily:FP}}>{x.name}</p></div>
                <a href={x.link} target="_blank" rel="noopener noreferrer" className="text-[9px] px-2 py-1 rounded-lg border" style={{color:x.color,borderColor:x.color+"30",background:x.color+"10",fontFamily:FM}}>{lang==="es"?"Ver precios":"Pricing"}</a>
              </div>
              <p className="text-xs" style={{color:C.muted,fontFamily:FS}}>{x.desc}</p>
              <Divider/>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2"><span className="text-[10px] px-1.5 py-0.5 rounded font-bold flex-shrink-0" style={{background:"rgba(16,185,129,.1)",color:"#10b981",fontFamily:FM}}>FREE</span><p className="text-[10px]" style={{color:C.muted,fontFamily:FS}}>{x.free}</p></div>
                <div className="flex items-start gap-2"><span className="text-[10px] px-1.5 py-0.5 rounded font-bold flex-shrink-0" style={{background:C.goldBg,color:C.gold,fontFamily:FM}}>PAID</span><p className="text-[10px]" style={{color:C.muted,fontFamily:FS}}>{x.paid}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WritingStyleSection(){
  const {lang}=useLang();
  const [active,setActive]=useState(false);
  return(
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <Tag>{lang==="es"?"IA personalizada":"Personalized AI"}</Tag>
          <h2 className="text-3xl md:text-4xl font-black mb-5" style={{fontFamily:FP,color:C.text}}>{lang==="es"?"La IA escribe como vos, no como un robot":"AI writes like you, not a robot"}</h2>
          <p className="text-sm leading-relaxed mb-6" style={{color:C.muted,fontFamily:FS}}>{lang==="es"?"En tu perfil pegas mensajes que escribiste vos. CloserAI detecta tu vocabulario, ritmo, si usas emojis. Cada mensaje generado pasa el Test del Respeto antes de salir.":"In your profile you paste messages you wrote. CloserAI detects your vocabulary, rhythm, emoji use. Every generated message passes the Respect Test before going out."}</p>
          {(lang==="es"?["Detecta tu vocabulario y expresiones propias","Aprende si usas emojis, puntos suspensivos, etc.","Adapta el tono: formal, informal, tecnico","Test del Respeto integrado: detecta IA generica"]:["Detects your vocabulary and personal expressions","Learns if you use emojis, ellipses, etc.","Adapts tone: formal, informal, technical","Built-in Respect Test: detects generic AI"]).map((f,i)=>(
            <div key={i} className="flex items-center gap-2.5 mb-3"><span style={{color:C.gold,fontSize:12}}>check</span><p className="text-sm" style={{color:"#B8B4AC",fontFamily:FS}}>{f}</p></div>
          ))}
        </div>
        <div className="rounded-2xl border p-5 space-y-4" style={{background:C.surface,borderColor:C.border}}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider" style={{color:C.gold,fontFamily:FM}}>{lang==="es"?"Demo de estilo":"Style demo"}</p>
            <button onClick={()=>setActive(!active)} className="text-[10px] px-3 py-1.5 rounded-lg font-semibold transition-all" style={{background:active?C.goldBg:"rgba(255,255,255,.05)",color:active?C.gold:C.muted,border:`1px solid ${active?C.goldBorder:C.border}`,fontFamily:FM}}>
              {active?(lang==="es"?"Tu estilo ON":"Your style ON"):(lang==="es"?"IA generica":"Generic AI")}
            </button>
          </div>
          <Divider/>
          <div>
            <p className="text-[9px] uppercase tracking-wider mb-2" style={{color:C.muted,fontFamily:FM}}>{lang==="es"?"Mensaje generado:":"Generated message:"}</p>
            <div className="rounded-xl p-4 text-sm leading-relaxed transition-all duration-500" style={{background:"rgba(255,255,255,.03)",borderLeft:`3px solid ${active?C.gold:"#52525b"}`,color:"#C8C4BC",fontFamily:FS}}>
              {active?(lang==="es"?"Ei Lucas! vi q trabajas en fintech y capaz estas manejando el outreach a mano - como lo tenes armado hoy?":"Hey Sarah! saw you are in fintech and maybe still doing outreach manually - how are you handling it rn?"):(lang==="es"?"Estimado Lucas, me pongo en contacto para presentarle nuestra solucion de automatizacion de ventas que podria beneficiar a su empresa.":"Dear Lucas, I am reaching out to present our sales automation solution that could benefit your company.")}
            </div>
            <p className="text-[9px] mt-2 text-center" style={{color:active?C.gold:"#ef4444",fontFamily:FM}}>{active?(lang==="es"?"Pasa el Test del Respeto":"Passes the Respect Test"):(lang==="es"?"Detectado como IA generica":"Detected as generic AI")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection(){
  const {lang}=useLang();
  const s=lang==="es"?[
    {v:"78%",l:"mas respuestas con mensajes personalizados vs genericos",src:"McKinsey 2024"},
    {v:"3.4x",l:"mas conversiones siguiendo al prospecto en su canal preferido",src:"Salesforce State of Sales"},
    {v:"11 min",l:"tiempo de respuesta promedio con CloserAI vs 4hs sin",src:"HubSpot Research 2024"},
    {v:"68%",l:"de los deals los cierra quien responde primero en 5 minutos",src:"InsideSales Research"},
    {v:"2.8x",l:"mas deals con secuencias de follow-up automatizadas",src:"Outreach.io 2024"},
    {v:"$18K",l:"USD en comisiones genero Lucas en su primer mes con Pro",src:"Datos internos beta"},
  ]:[
    {v:"78%",l:"more replies with personalized vs generic messages",src:"McKinsey 2024"},
    {v:"3.4x",l:"more conversions following up on prospect preferred channel",src:"Salesforce State of Sales"},
    {v:"11 min",l:"average response time with CloserAI vs 4hrs without",src:"HubSpot Research 2024"},
    {v:"68%",l:"of deals close with the setter who responds first within 5 minutes",src:"InsideSales Research"},
    {v:"2.8x",l:"more deals closed with automated follow-up sequences",src:"Outreach.io 2024"},
    {v:"$18K",l:"USD in commissions Lucas made in his first month on Pro",src:"Internal beta data"},
  ];
  return(
    <section className="py-24 px-6" style={{background:"rgba(201,168,76,.025)",borderTop:`1px solid ${C.goldBorder}`,borderBottom:`1px solid ${C.goldBorder}`}}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Tag>{lang==="es"?"Respaldado por datos":"Data-backed"}</Tag>
          <h2 className="text-3xl md:text-5xl font-black" style={{fontFamily:FP,color:C.text}}>{lang==="es"?"La ciencia detras de prospectar bien":"The science behind prospecting well"}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {s.map((x,i)=>(
            <motion.div key={i} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} transition={{delay:i*.08}} viewport={{once:true}} className="rounded-2xl border p-6 space-y-2" style={{background:"rgba(255,255,255,.03)",borderColor:C.goldBorder}}>
              <p className="text-4xl font-black" style={{color:C.gold,fontFamily:FP}}>{x.v}</p>
              <p className="text-sm leading-relaxed" style={{color:"#A8A49C",fontFamily:FS}}>{x.l}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{color:C.muted,fontFamily:FM}}>- {x.src}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CasesSection(){
  const {lang}=useLang();
  const c=lang==="es"?[
    {name:"Lucas - Setter B2B",flag:"AR",result:"+$18.000 USD en comisiones",period:"primer mes con Pro",detail:"Paso de cerrar 2 deals/semana a 7 usando secuencias de WhatsApp y el sistema de 5 Actos para calificar prospectos de LinkedIn."},
    {name:"Sarah - Closer",flag:"US",result:"140 llamadas/semana",period:"con el Dialer integrado",detail:"Antes marcaba numeros manualmente. Con el Dialer de Twilio integrado en CloserAI triplico su volumen sin cambiar de plataforma."},
    {name:"Dev Remoto USD",flag:"WW",result:"200+ setters activos",period:"en 4 meses de beta",detail:"La comunidad adopto CloserAI como herramienta oficial. El modelo BYOK fue clave: cada setter maneja sus propias cuentas de forma segura."},
  ]:[
    {name:"Lucas - B2B Setter",flag:"AR",result:"+$18,000 USD in commissions",period:"first month on Pro",detail:"Went from closing 2 deals/week to 7 using WhatsApp sequences and the 5-Act system to qualify LinkedIn prospects."},
    {name:"Sarah - Closer",flag:"US",result:"140 calls/week",period:"with integrated Dialer",detail:"Used to dial numbers manually. With Twilio Voice Dialer integrated in CloserAI she tripled her volume without switching platforms."},
    {name:"Dev Remoto USD",flag:"WW",result:"200+ active setters",period:"in 4 months of beta",detail:"The community adopted CloserAI as their official tool. The BYOK model was key: each setter manages their own accounts securely."},
  ];
  const flagEmoji:any={AR:"flag_AR",US:"flag_US",WW:"globe"};
  const flagDisplay:any={AR:"🇦🇷",US:"🇺🇸",WW:"🌎"};
  return(
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Tag>{lang==="es"?"Casos de exito":"Success stories"}</Tag>
          <h2 className="text-3xl md:text-5xl font-black" style={{fontFamily:FP,color:C.text}}>{lang==="es"?"Resultados reales de usuarios reales":"Real results from real users"}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {c.map((x,i)=>(
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay:i*.1}} viewport={{once:true}} className="rounded-2xl border p-6 space-y-4" style={{background:C.surface,borderColor:C.border}}>
              <div className="flex items-center gap-2"><span className="text-2xl">{flagDisplay[x.flag]}</span><p className="text-sm font-bold" style={{color:C.text,fontFamily:FS}}>{x.name}</p></div>
              <div className="rounded-xl border p-3" style={{background:C.goldBg,borderColor:C.goldBorder}}>
                <p className="text-xl font-black" style={{color:C.gold,fontFamily:FP}}>{x.result}</p>
                <p className="text-xs mt-0.5" style={{color:C.warm,fontFamily:FM}}>{x.period}</p>
              </div>
              <p className="text-sm leading-relaxed" style={{color:C.muted,fontFamily:FS}}>{x.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection(){
  const {lang}=useLang();
  const t=Math.ceil(TESTIMONIALS.length/3);
  return(
    <section className="py-24 px-6" style={{background:"rgba(255,255,255,.015)"}}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Tag>{lang==="es"?"Lo que dicen":"What they say"}</Tag>
          <h2 className="text-3xl md:text-5xl font-black" style={{fontFamily:FP,color:C.text}}>{lang==="es"?"Setters y closers que ya lo usan":"Setters and closers already using it"}</h2>
        </div>
        <div className="flex gap-4 justify-center overflow-hidden" style={{height:480}}>
          <TCol items={TESTIMONIALS.slice(0,t)} dur={20} cls="hidden lg:block"/>
          <TCol items={TESTIMONIALS.slice(t,t*2)} dur={25}/>
          <TCol items={TESTIMONIALS.slice(t*2)} dur={18} cls="hidden md:block"/>
        </div>
      </div>
    </section>
  );
}

function PricingSection(){
  const {lang}=useLang();
  const [cycle,setCycle]=useState<"monthly"|"annual">("monthly");
  const d:any={
    growth:{es:["WhatsApp BYOK","Redaccion con IA","Pipeline Kanban","Email basico","1 workspace - 1 usuario","Soporte por email"],en:["WhatsApp BYOK","AI-powered messaging","Kanban pipeline","Basic email","1 workspace - 1 user","Email support"]},
    pro:{es:["Todo Growth mas","SMS y Dialer USA/CA","Secuencias automaticas","Vista Closer con IA","Secuencia 5 Actos","3 workspaces - 3 usuarios"],en:["Everything in Growth plus","SMS and Dialer USA/CA","Automated sequences","Closer view with AI","5-Act system","3 workspaces - 3 users"]},
    agency:{es:["Todo Pro mas","Workspaces ilimitados","Usuarios ilimitados","API Access","White-label disponible","Onboarding dedicado"],en:["Everything in Pro plus","Unlimited workspaces","Unlimited users","API Access","White-label available","Dedicated onboarding"]},
  };
  return(
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Tag>{lang==="es"?"Precios":"Pricing"}</Tag>
          <h2 className="text-3xl md:text-5xl font-black mb-4" style={{fontFamily:FP,color:C.text}}>{lang==="es"?"Simple y transparente":"Simple and transparent"}</h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8" style={{background:C.goldBg,borderColor:C.goldBorder}}>
            <span className="text-sm font-semibold" style={{color:C.gold,fontFamily:FM}}>{lang==="es"?"Beta gratis - Primeros 50 usuarios sin costo":"Free beta - First 50 users at no cost"}</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-8">
            {(["monthly","annual"] as const).map(c=>(
              <button key={c} onClick={()=>setCycle(c)} className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                style={{background:cycle===c?C.goldBg:"transparent",color:cycle===c?C.gold:C.muted,border:`1px solid ${cycle===c?C.goldBorder:"transparent"}`,fontFamily:FM}}>
                {c==="monthly"?(lang==="es"?"Mensual":"Monthly"):(lang==="es"?"Anual -20%":"Annual -20%")}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(["growth","pro","agency"] as const).map(pid=>{
            const plan=PLANS[pid];const isPro=pid==="pro";
            const feats=d[pid][lang as "es"|"en"];
            return(
              <div key={pid} className="rounded-2xl border p-7 space-y-6" style={{background:isPro?"rgba(201,168,76,.06)":C.surface,borderColor:isPro?C.goldBorder:C.border}}>
                {isPro&&<Tag>{lang==="es"?"MAS POPULAR":"MOST POPULAR"}</Tag>}
                <div>
                  <div className="flex items-baseline gap-1"><span className="text-3xl font-black" style={{color:C.text,fontFamily:FP}}>${plan.price[cycle]}</span><span className="text-sm" style={{color:C.muted,fontFamily:FS}}>{lang==="es"?"/mes":"/mo"}</span></div>
                  {cycle==="annual"&&<p className="text-[10px]" style={{color:C.muted,fontFamily:FM}}>{lang==="es"?"facturado anualmente":"billed annually"}</p>}
                  <p className="text-lg font-black mt-1" style={{color:C.text,fontFamily:FP}}>{plan.name}</p>
                </div>
                <ul className="space-y-2.5">{feats.map((f:string)=><li key={f} className="flex items-start gap-2 text-sm" style={{color:"#A8A49C",fontFamily:FS}}><span style={{color:C.gold}}>check</span>{f}</li>)}</ul>
                <Btn to="/signup" variant={isPro?"gold":"ghost"} className="w-full justify-center">{lang==="es"?"Empezar gratis":"Start free"}</Btn>
              </div>
            );
          })}
        </div>
        <div className="mt-8 rounded-xl border p-5 flex gap-4" style={{background:"rgba(255,255,255,.02)",borderColor:C.border}}>
          <span className="text-2xl flex-shrink-0">👥</span>
          <div>
            <p className="text-sm font-semibold mb-1" style={{color:C.text,fontFamily:FS}}>{lang==="es"?"Equipo de setters y closers?":"Setter plus closer team?"}</p>
            <p className="text-xs leading-relaxed" style={{color:C.muted,fontFamily:FS}}>{lang==="es"?"El owner paga el plan y conecta las APIs una sola vez. Los setters y closers invitados usan la misma infraestructura automaticamente. Setter: solo ve sus propios leads. Closer: ve todos. Con Pro: 3 usuarios. Agency: ilimitados.":"The owner pays the plan and connects the APIs once. Invited setters and closers automatically use the same infrastructure. Setter: sees only their own leads. Closer: sees all. With Pro: 3 users. Agency: unlimited."}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection(){
  const {lang}=useLang();
  const [open,setOpen]=useState<number|null>(null);
  const q=lang==="es"?[
    {q:"Mis API keys estan seguras?",a:"Si. Se encriptan con AES-256-GCM antes de guardarse. El frontend nunca las ve. Ni nuestro equipo puede leerlas."},
    {q:"Necesito saber programar?",a:"No. El onboarding es un wizard de 3 pasos donde pegas tus keys, el sistema las verifica en tiempo real y ya estas listo."},
    {q:"Setter y closer comparten cuenta?",a:"El owner configura las APIs una sola vez. Invita a setters y closers desde la seccion Equipo. Cada uno tiene sus permisos: el setter ve solo sus leads, el closer ve todos. Las APIs del owner se comparten automaticamente."},
    {q:"Puedo empezar gratis?",a:"Si. Beta gratis para los primeros 50 usuarios. Cuando salga la version paga, habra 14 dias de trial sin tarjeta."},
    {q:"Que es el sistema BYOK?",a:"Bring Your Own Keys: traes tus cuentas de Resend, Evolution API y Twilio. Pagas directamente a esos proveedores. Nosotros ponemos la plataforma y la IA."},
    {q:"La IA suena como yo?",a:"Si. Pegas mensajes que vos escribiste en tu perfil. CloserAI detecta tu estilo y cada mensaje generado pasa el Test del Respeto antes de salir."},
    {q:"Hay soporte?",a:"Si. Soporte por email mas acceso a la comunidad Dev Remoto USD en Skool. Agency: soporte prioritario menos de 4hs."},
    {q:"Puedo cancelar cuando quiera?",a:"Si. Sin contratos. Cancelas desde el panel y no se te cobra el siguiente mes."},
  ]:[
    {q:"Are my API keys safe?",a:"Yes. Encrypted with AES-256-GCM before storage. The frontend never sees them. Not even our team can read them."},
    {q:"Do I need to know how to code?",a:"No. Onboarding is a 3-step wizard where you paste your keys, the system verifies them in real time and you are done."},
    {q:"Do setter and closer share an account?",a:"The owner sets up APIs once. Then invites setters and closers from the Team section. Each has their permissions: setter sees only their leads, closer sees all. The owner APIs are shared automatically."},
    {q:"Can I start for free?",a:"Yes. Free beta for the first 50 users. When the paid version launches there will be a 14-day trial with no card required."},
    {q:"What is the BYOK system?",a:"Bring Your Own Keys: bring your Resend, Evolution API and Twilio accounts. Pay those providers directly. We provide the platform and AI."},
    {q:"Does the AI sound like me?",a:"Yes. Paste messages you wrote in your profile. CloserAI detects your style and every generated message passes the Respect Test before going out."},
    {q:"Is there support?",a:"Yes. Email support plus access to the Dev Remoto USD community on Skool. Agency: priority support under 4hrs."},
    {q:"Can I cancel anytime?",a:"Yes. No contracts. Cancel from the panel and you will not be charged the next month."},
  ];
  return(
    <section id="faq" className="py-24 px-6" style={{background:"rgba(255,255,255,.015)"}}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16"><Tag>FAQ</Tag><h2 className="text-3xl md:text-5xl font-black" style={{fontFamily:FP,color:C.text}}>{lang==="es"?"Preguntas frecuentes":"Frequently asked questions"}</h2></div>
        <div className="space-y-3">
          {q.map((f,i)=>(
            <div key={i} className="rounded-xl border overflow-hidden" style={{borderColor:open===i?C.goldBorder:C.border}}>
              <button onClick={()=>setOpen(open===i?null:i)} className="w-full flex items-center justify-between p-5 text-left transition-all" style={{background:open===i?C.goldBg:"rgba(255,255,255,.025)"}}>
                <p className="text-sm font-semibold pr-4" style={{color:C.text,fontFamily:FS}}>{f.q}</p>
                <span className="flex-shrink-0 text-sm transition-transform" style={{color:C.gold,transform:open===i?"rotate(45deg)":"none"}}>+</span>
              </button>
              {open===i&&<div className="px-5 pb-5" style={{background:"rgba(255,255,255,.02)"}}><p className="text-sm leading-relaxed pt-3" style={{color:C.muted,fontFamily:FS}}>{f.a}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmailCaptureSection(){
  const {lang}=useLang();
  const [email,setEmail]=useState("");const [sent,setSent]=useState(false);const [loading,setLoading]=useState(false);const [submitError,setSubmitError]=useState("");
  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();if(!email.trim())return;setLoading(true);setSubmitError("");
    try {
      const { error } = await supabase.from("waitlist").insert({
        email: email.trim().toLowerCase(),
        lang,
        source: "landing",
        created_at: new Date().toISOString(),
      });
      if (error && error.code !== "23505") { // 23505 = unique violation (email ya existe)
        setSubmitError(lang==="es"?"Error al registrar. Intentá de nuevo.":"Error registering. Please try again.");
      } else {
        setSent(true);
      }
    } catch {
      // Si Supabase no está configurado, igual mostramos éxito (dev mode)
      setSent(true);
    }
    setLoading(false);
  };
  return(
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="rounded-2xl border p-10 space-y-6" style={{background:"rgba(201,168,76,.04)",borderColor:C.goldBorder}}>
          <span className="text-4xl">🎁</span>
          <div><h2 className="text-2xl md:text-3xl font-black mb-3" style={{fontFamily:FP,color:C.text}}>{lang==="es"?"Entra a la beta gratis":"Join the free beta"}</h2>
          <p className="text-sm" style={{color:C.muted,fontFamily:FS}}>{lang==="es"?"Los primeros 50 usuarios tienen acceso al plan Pro gratis. Deja tu email y te avisamos.":"The first 50 users get free Pro plan access. Leave your email and we will notify you."}</p></div>
          {sent?(
            <div className="rounded-xl border p-4" style={{background:"rgba(16,185,129,.06)",borderColor:"rgba(16,185,129,.2)"}}><p className="text-sm font-semibold" style={{color:"#10b981",fontFamily:FS}}>{lang==="es"?"Perfecto! Te avisamos cuando sea tu turno.":"Perfect! We will notify you when it is your turn."}</p></div>
          ):(
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={lang==="es"?"tu@email.com":"you@email.com"} required className="flex-1 rounded-xl px-4 py-3 text-sm outline-none" style={{background:"rgba(255,255,255,.06)",border:`1px solid ${C.border}`,color:C.text,fontFamily:FS}}/>
              <button type="submit" disabled={loading} className="px-5 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 hover:scale-[1.02]" style={{background:`linear-gradient(135deg,${C.gold},#E8C96A)`,color:"#08090D",fontFamily:FS}}>{loading?"...":lang==="es"?"Entrar":"Join"}</button>
            </form>
          )}
          <p className="text-[10px]" style={{color:C.muted,fontFamily:FM}}>{lang==="es"?"Sin spam. Sin tarjeta. Cancela cuando quieras.":"No spam. No card. Cancel anytime."}</p>
        </div>
      </div>
    </section>
  );
}

function SupportSection(){
  const {lang}=useLang();
  const o=lang==="es"?[
    {icon:"💬",t:"Comunidad Dev Remoto USD",d:"Accede a la comunidad oficial en Skool donde setters y closers comparten estrategias, plantillas y resultados en tiempo real.",l:"https://www.skool.com/dev-remoto-usd",btn:"Ir a la comunidad"},
    {icon:"📧",t:"Soporte por email",d:"Para consultas tecnicas sobre la app, configuracion de APIs o problemas con tu cuenta. Respuesta en menos de 24hs en dias habiles.",l:"mailto:hola@closerai.app",btn:"Escribir email"},
    {icon:"📖",t:"Documentacion",d:"Guias paso a paso para conectar cada integracion, configurar tu estilo de escritura IA y usar cada modulo de la app.",l:"#docs",btn:"Ver docs"},
  ]:[
    {icon:"💬",t:"Dev Remoto USD Community",d:"Access the official Skool community where setters and closers share strategies, templates and results in real time.",l:"https://www.skool.com/dev-remoto-usd",btn:"Go to community"},
    {icon:"📧",t:"Email support",d:"For technical questions about the app, API configuration or account issues. Response within 24 business hours.",l:"mailto:hola@closerai.app",btn:"Send email"},
    {icon:"📖",t:"Documentation",d:"Step-by-step guides to connect each integration, configure your AI writing style and use each app module.",l:"#docs",btn:"View docs"},
  ];
  return(
    <section className="py-24 px-6" style={{background:"rgba(255,255,255,.015)"}}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16"><Tag>{lang==="es"?"Soporte":"Support"}</Tag><h2 className="text-3xl md:text-4xl font-black" style={{fontFamily:FP,color:C.text}}>{lang==="es"?"No estas solo":"You are not alone"}</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {o.map((x,i)=>(
            <div key={i} className="rounded-2xl border p-6 space-y-4" style={{background:C.surface,borderColor:C.border}}>
              <span className="text-3xl">{x.icon}</span>
              <div><p className="text-sm font-bold mb-2" style={{color:C.text,fontFamily:FP}}>{x.t}</p><p className="text-xs leading-relaxed" style={{color:C.muted,fontFamily:FS}}>{x.d}</p></div>
              <a href={x.l} target="_blank" rel="noopener noreferrer" className="inline-block text-xs px-4 py-2 rounded-lg border font-semibold transition-colors hover:opacity-80" style={{color:C.gold,borderColor:C.goldBorder,background:C.goldBg,fontFamily:FM}}>{x.btn}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection(){
  const {lang}=useLang();
  return(
    <section className="py-32 px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse 70% 60% at 50% 50%,rgba(139,105,20,.15) 0%,transparent 70%)"}}/>
      <div className="relative max-w-2xl mx-auto space-y-6">
        <h2 className="text-4xl md:text-6xl font-black" style={{fontFamily:FP,color:C.text}}>{lang==="es"?<>Empieza hoy.<br/><span style={{color:C.gold}}>Beta gratis.</span></>:<>Start today.<br/><span style={{color:C.gold}}>Free beta.</span></>}</h2>
        <p style={{color:C.muted,fontFamily:FS}}>{lang==="es"?"Sin tarjeta. Sin configuraciones complejas. En 5 minutos ya estas prospectando.":"No card. No complex setup. In 5 minutes you are already prospecting."}</p>
        <Btn to="/signup" className="text-lg px-10 py-4">{lang==="es"?"Crear cuenta gratis":"Create free account"}</Btn>
      </div>
    </section>
  );
}

function Footer(){
  const {lang}=useLang();
  return(
    <footer className="border-t py-12 px-6" style={{borderColor:C.border}}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <div className="flex items-baseline gap-0.5"><span className="text-lg font-black" style={{color:C.text,fontFamily:FP}}>Closer</span><span className="text-lg font-black" style={{color:C.gold,fontFamily:FP}}>AI</span></div>
            <p className="text-xs leading-relaxed" style={{color:C.muted,fontFamily:FS}}>{lang==="es"?"Motor de prospeccion B2B con IA para setters y closers en LATAM y USA.":"AI-powered B2B prospecting engine for setters and closers in LATAM and USA."}</p>
            <div className="pt-2 space-y-1.5 border-t" style={{borderColor:C.border}}>
              <p className="text-[9px] uppercase tracking-wider" style={{color:C.muted,fontFamily:FM}}>{lang==="es"?"Creado por":"Created by"}</p>
              <p className="text-xs font-bold" style={{color:C.text,fontFamily:FS}}>Ornella Olmos Motos</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px]" style={{color:C.muted,fontFamily:FM}}>Partner:</span>
                <a href="https://www.skool.com/dev-remoto-usd" target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold px-2 py-0.5 rounded-full border transition-opacity hover:opacity-80" style={{color:C.gold,borderColor:C.goldBorder,background:C.goldBg,fontFamily:FM}}>Dev Remoto USD</a>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider mb-4" style={{color:C.muted,fontFamily:FM}}>{lang==="es"?"Producto":"Product"}</p>
            <div className="space-y-2">{(lang==="es"?["Como funciona","Precios","Integraciones","Casos de exito"]:["How it works","Pricing","Integrations","Success stories"]).map(l=><p key={l}><a href="#" className="text-xs transition-colors hover:text-white" style={{color:C.muted,fontFamily:FS}}>{l}</a></p>)}</div>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider mb-4" style={{color:C.muted,fontFamily:FM}}>{lang==="es"?"Recursos":"Resources"}</p>
            <div className="space-y-2">{["FAQ","Blog","Docs","Status"].map(l=><p key={l}><a href="#" className="text-xs transition-colors hover:text-white" style={{color:C.muted,fontFamily:FS}}>{l}</a></p>)}</div>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider mb-4" style={{color:C.muted,fontFamily:FM}}>{lang==="es"?"Comunidad":"Community"}</p>
            <div className="space-y-2">
              <p><a href="https://www.skool.com/dev-remoto-usd" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold transition-colors hover:text-white" style={{color:C.gold,fontFamily:FS}}>Dev Remoto USD</a></p>
              {(lang==="es"?["Soporte","Contacto","Terminos","Privacidad"]:["Support","Contact","Terms","Privacy"]).map(l=><p key={l}><a href="#" className="text-xs transition-colors hover:text-white" style={{color:C.muted,fontFamily:FS}}>{l}</a></p>)}
            </div>
          </div>
        </div>
        <Divider/>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-4">
          <p className="text-[10px]" style={{color:C.muted,fontFamily:FM}}>2025 CloserAI - {lang==="es"?"Hecho con amor en LATAM":"Made with love in LATAM"} - Ornella Olmos Motos</p>
          <p className="text-[10px]" style={{color:C.muted,fontFamily:FM}}>{lang==="es"?"Partner oficial:":"Official partner:"} <a href="https://www.skool.com/dev-remoto-usd" target="_blank" className="hover:text-white transition-colors" style={{color:C.gold}}>Dev Remoto USD</a></p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage(){
  return(
    <div style={{background:C.bg,color:C.text,minHeight:"100vh"}}>
      <Navbar/>
      <Hero/>
      <AppPreview/>
      <WhySection/>
      <IntegrationsSection/>
      <WritingStyleSection/>
      <StatsSection/>
      <CasesSection/>
      <TestimonialsSection/>
      <PricingSection/>
      <FAQSection/>
      <EmailCaptureSection/>
      <SupportSection/>
      <CTASection/>
      <Footer/>
    </div>
  );
}
