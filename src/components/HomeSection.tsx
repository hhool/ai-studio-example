import { 
  Baby, 
  Award,
  ShieldCheck, 
  ChevronRight, 
  TrendingDown, 
  Scale, 
  Wrench, 
  Bookmark, 
  Star,
  Sparkles,
  Zap,
  Globe,
  Bell,
  ArrowRight
} from "lucide-react";
import { Product } from "../types";
import { translations, translateProduct } from "../lib/translate";

interface HomeSectionProps {
  productsData: Product[];
  onSelectProduct: (p: Product) => void;
  setActiveTab: (tab: any) => void;
  childProfile: any;
  setChildProfile: (p: any) => void;
  lang?: "zh" | "en";
}

export default function HomeSection({
  productsData,
  onSelectProduct,
  setActiveTab,
  childProfile,
  setChildProfile,
  lang = "zh"
}: HomeSectionProps) {
  
  const t = translations[lang];

  // Outstanding Hot Selected products (highly evaluated)
  const hotEvaluations = productsData.filter(p => p.overallScore >= 9.5).slice(0, 3);
  
  // Popular list for Quick Previews
  const popularProducts = productsData.slice(4, 9);

  return (
    <div id="home_layout" className="space-y-12">
      
      {/* 1. Slogan Hero Banner Area */}
      <section className="relative rounded-3xl bg-slate-900 overflow-hidden border border-slate-800 shadow-2xl p-8 sm:p-12 text-left max-w-5xl mx-auto">
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-center">
          <div className="lg:col-span-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.sloganBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
              {t.sloganHeading1} <br />
              <span className="text-amber-500">{t.sloganHeading2}</span> {t.sloganHeading3}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              {t.sloganDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 text-xs">
              <button 
                onClick={() => setActiveTab("guides")}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl transition flex items-center justify-center gap-1 active:scale-95 shadow-lg shadow-amber-500/10"
              >
                {t.btnWizard}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setActiveTab("products")}
                className="px-6 py-3 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-xl font-bold transition flex items-center justify-center gap-1.5"
              >
                {t.btnDatabase}
              </button>
            </div>
          </div>
          
          {/* Right column: Quick stat check box */}
          <div className="lg:col-span-4 bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.radarTitle}</span>
            </div>
            <div className="space-y-3 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>{t.radarWeight}</span>
                <strong className="text-green-400">±5g</strong>
              </div>
              <div className="flex justify-between">
                <span>{t.radarShock}</span>
                <strong className="text-green-400">100k cycles</strong>
              </div>
              <div className="flex justify-between">
                <span>{t.radarTraction}</span>
                <strong className="text-green-400">45 PSI</strong>
              </div>
              <div className="flex justify-between border-t border-slate-900 pt-3 text-slate-500">
                <span>{t.radarTested}</span>
                <strong className="text-amber-500">{t.radarTestedVal}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Real-time recall warning bar ticker to fit GDPR Section 4.2 */}
      <section className="bg-slate-900/60 border border-red-500/10 rounded-2xl p-4 flex items-center justify-between text-xs gap-4 max-w-5xl mx-auto text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-400/10 flex items-center justify-center text-red-500 shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-red-400 block font-bold">{t.recallTitle}</strong>
            <span className="text-slate-400 text-[10px]">{t.recallDesc}</span>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab("news")} 
          className="text-[10px] text-amber-500 hover:underline hover:text-amber-400 font-bold shrink-0"
        >
          {t.recallBtn}
        </button>
      </section>

      {/* 3. Global Annual Rankings (PRD Section 4.4.4): 2026 年度童车物理勋章榜 */}
      <section className="space-y-6 max-w-5xl mx-auto text-left">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            {t.goldRankings}
          </h3>
          <p className="text-xs text-slate-500">{t.goldRankingsDesc}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productsData.slice(0, 3).map((p, index) => {
            const diProduct = translateProduct(p, lang);
            return (
              <div 
                key={diProduct.id} 
                onClick={() => onSelectProduct(p)}
                className="bg-slate-900 border border-slate-800/80 hover:border-amber-400/20 rounded-2xl p-5 flex flex-col justify-between space-y-4 cursor-pointer hover:shadow-lg transition group relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 bg-amber-500 text-slate-950 font-mono text-[10px] font-black px-2 py-0.5 rounded-bl">
                  RANK #0{index + 1}
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] bg-slate-950 text-amber-500 p-1.5 rounded uppercase font-bold">{diProduct.brand}</span>
                  <h4 className="text-sm font-black text-white mt-1 group-hover:text-amber-400 transition-colors">{diProduct.name}</h4>
                  <p className="text-slate-400 text-[11px] line-clamp-3 leading-relaxed italic">“{diProduct.editorVerdict}”</p>
                </div>

                <div className="flex justify-between items-center text-[10px] pt-3.5 border-t border-slate-850">
                  <span className="text-slate-500">{t.safetyScoreLabel} <strong className="text-amber-500 font-mono font-bold">{diProduct.safetyScore}</strong></span>
                  <span className="text-amber-500 font-bold group-hover:underline">{t.viewDetails}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Hot Featured Evaluations section (PRD Section 4.4 - 评测中心精选成果) */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-w-5xl mx-auto text-left">
        <div className="flex justify-between items-center flex-wrap gap-2 pb-4 border-b border-slate-800/50">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              {t.promoTitle}
            </h3>
            <p className="text-xs text-slate-500">{t.promoDesc}</p>
          </div>
          <button 
            onClick={() => setActiveTab("evaluations")}
            className="text-xs text-amber-500 hover:underline hover:text-amber-400 font-bold flex items-center gap-1"
          >
            {t.moreReports}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
            <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-black uppercase">
              {lang === "en" ? "Lab Insight" : "实测甄别亮点"}
            </span>
            <h4 className="font-bold text-white text-sm sm:text-base">{t.promoItem1Title}</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t.promoItem1Desc}
            </p>
            <button onClick={() => setActiveTab("news")} className="text-[10px] text-amber-500 hover:underline font-bold">
              {t.seeFullReport}
            </button>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
            <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-black uppercase">
              {lang === "en" ? "Hazard Alert" : "避坑警示亮点"}
            </span>
            <h4 className="font-bold text-white text-sm sm:text-base">{t.promoItem2Title}</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t.promoItem2Desc}
            </p>
            <button onClick={() => setActiveTab("guides")} className="text-[10px] text-amber-500 hover:underline font-bold">
              {t.seeFlawsReport}
            </button>
          </div>
        </div>
      </section>

      {/* 5. Full site tool shortcut banners (PRD Section 4.1.7) */}
      <section className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-6 shadow-xl text-slate-950 text-left max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black uppercase tracking-wide">
              {lang === "en" ? "💡 Is Your Child's Bike Sized Correctly?" : "💡 您的宝宝车型规格买对了吗？"}
            </h3>
            <p className="text-xs text-slate-900 leading-relaxed font-medium">
              {lang === "en" 
                ? "Enter your child's measurements. The calculator will automatically calculate the golden rim diameter, and critical weight limitations."
                : "输入宝宝身高，系统根据脚掌踩地阻尼、大腿五通宽度自动测定最适配轮径及最高的危险车身自重限制，立刻打开智能安全算力箱！"}
            </p>
          </div>
          <button 
            onClick={() => setActiveTab("guides")}
            className="px-6 py-3 bg-slate-950 text-white font-black text-xs uppercase hover:bg-slate-850 rounded-xl transition shrink-0 active:scale-95"
          >
            {t.getMatchedSpecs}
          </button>
        </div>
      </section>

    </div>
  );
}
