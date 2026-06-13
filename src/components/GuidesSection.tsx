import React, { useState, useMemo } from "react";
import { 
  BookOpen, 
  Search, 
  ArrowLeft, 
  Briefcase, 
  Calendar, 
  Clock, 
  Wrench, 
  Calculator, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Play
} from "lucide-react";
import { GuideArticle, guideArticles } from "../data/guidesData";
import { Product } from "../types";
import { translateProduct, translateGuideArticle } from "../lib/translate";

interface GuidesSectionProps {
  productsData: Product[];
  onSelectProduct: (p: Product) => void;
  // Let's pass childProfile setters to keep stats synchronized
  childProfile: {
    age: number;
    height: number;
    inseam: number;
    weight: number;
  };
  setChildProfile: (p: any) => void;
  lang?: "zh" | "en";
}

export default function GuidesSection({
  productsData,
  onSelectProduct,
  childProfile,
  setChildProfile,
  lang = "zh"
}: GuidesSectionProps) {
  const [selectedGuideState, setSelectedGuideState] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("").toLowerCase();

  // Match Wizard interactive states
  const [wizardAge, setWizardAge] = useState<number>(childProfile.age || 4);
  const [wizardHeight, setWizardHeight] = useState<number>(childProfile.height || 102);
  const [wizardInseam, setWizardInseam] = useState<number>(childProfile.inseam || 38);
  const [wizardWeight, setWizardWeight] = useState<number>(childProfile.weight || 16);
  const [wizardBudget, setWizardBudget] = useState<number>(3000);
  const [wizardScenario, setWizardScenario] = useState<string>("all");
  const [showWizardResults, setShowWizardResults] = useState<boolean>(false);

  // Guide Article filters
  const filteredGuides = useMemo(() => {
    return guideArticles
      .map(art => translateGuideArticle(art, lang))
      .filter((art) => {
        const matchesCat = selectedCategory === "all" || art.category === selectedCategory;
        const matchesSearch = searchQuery.trim() === "" ||
          art.title.toLowerCase().includes(searchQuery) ||
          art.summary.toLowerCase().includes(searchQuery) ||
          art.content.toLowerCase().includes(searchQuery);
        return matchesCat && matchesSearch;
      });
  }, [selectedCategory, searchQuery, lang]);

  // Match Wizard calculation formula
  const matchRecommendations = useMemo(() => {
    // 1. Recommended Wheel Sizes based on leg inseam
    let recWheel = lang === "en" ? "12 in." : "12寸";
    if (wizardInseam < 34) {
      recWheel = lang === "en" ? "12 in. (or Balance Bike)" : "12寸 (或滑步平衡车)";
    } else if (wizardInseam >= 34 && wizardInseam <= 40) {
      recWheel = lang === "en" ? "12 in. / 14 in." : "12寸 / 14寸";
    } else if (wizardInseam >= 41 && wizardInseam <= 48) {
      recWheel = lang === "en" ? "14 in. / 16 in." : "14寸 / 16寸";
    } else if (wizardInseam >= 49 && wizardInseam <= 56) {
      recWheel = lang === "en" ? "16 in. / 20 in." : "16寸 / 20寸";
    } else {
      recWheel = lang === "en" ? "20 in. or wider gears" : "20寸 或更大寸段车";
    }

    // 2. Safe Max Car Weights
    const perfectWeightLimit = parseFloat((wizardWeight * 0.3).toFixed(1));
    const dangerWeightLimit = parseFloat((wizardWeight * 0.4).toFixed(1));

    // 3. Recommended category
    let recCat = "balance";
    if (wizardAge < 2.5) {
      recCat = "balance";
    } else if (wizardAge >= 2.5 && wizardAge <= 5) {
      recCat = "bicycle";
    } else {
      recCat = "bicycle";
    }

    // 4. Products matching math
    const matches = productsData.filter((p) => {
      // Must be below budget
      const withinBudget = p.price <= wizardBudget;
      
      // Categorization/wheel size fits generally
      let isWheelSizeMatch = true;
      if (p.wheelSize !== "无") {
        const sizeNum = parseInt(p.wheelSize);
        if (!isNaN(sizeNum)) {
          if (wizardInseam < 34) {
            isWheelSizeMatch = sizeNum <= 12;
          } else if (wizardInseam >= 34 && wizardInseam <= 40) {
            isWheelSizeMatch = sizeNum === 12 || sizeNum === 14;
          } else if (wizardInseam >= 41 && wizardInseam <= 48) {
            isWheelSizeMatch = sizeNum === 14 || sizeNum === 16;
          } else if (wizardInseam >= 49 && wizardInseam <= 56) {
            isWheelSizeMatch = sizeNum === 16 || sizeNum === 20;
          } else {
            isWheelSizeMatch = sizeNum >= 20;
          }
        }
      }
      
      // Specific Scenario matches
      let isScenarioMatch = true;
      if (wizardScenario === "tight") {
        isScenarioMatch = p.weight <= perfectWeightLimit || p.category === "scooter" || p.category === "balance";
      } else if (wizardScenario === "rough") {
        isScenarioMatch = p.tireType.includes("充气") || p.tireType.includes("越野") || p.tireType.includes("橡胶");
      }

      // Heavy/weight safety check
      const isWeightSafe = p.weight <= dangerWeightLimit || p.category === "stroller" || p.category === "safety_seat";

      return withinBudget && isWeightSafe && isWheelSizeMatch && isScenarioMatch;
    });

    return {
      recWheel,
      perfectWeightLimit,
      dangerWeightLimit,
      matches,
      recCat
    };
  }, [wizardAge, wizardHeight, wizardInseam, wizardWeight, wizardBudget, wizardScenario, productsData, lang]);

  // Synchronize wizard values back to main core childProfile
  const handleApplyWizardToProfile = () => {
    setChildProfile({
      age: wizardAge,
      height: wizardHeight,
      inseam: wizardInseam,
      weight: wizardWeight
    });
    if (lang === "en") {
      alert("Child parameters successfully synchronized with site-wide decision cores! All physical indicators and weight limit warning icons have refreshed.");
    } else {
      alert("宝宝身体力学参数已成功同步到核心系统！平台内所有的称重死线验证及警示标志已自适应更新。");
    }
  };

  const categories = lang === "en" ? [
    { id: "all", label: "📁 All Guides" },
    { id: "beginner", label: "🔰 For Beginners" },
    { id: "risk", label: "☠️ Sizing Pitfalls" },
    { id: "export", label: "⚖️ Standard Audits" },
    { id: "maintenance", label: "🔧 Maintenance" },
    { id: "scenario", label: "🏞️ Scenario Sizing" }
  ] : [
    { id: "all", label: "📁 全部指南目录" },
    { id: "beginner", label: "🔰 选车新手册" },
    { id: "risk", label: "☠️ 车款避坑死线" },
    { id: "export", label: "⚖️ 跨境合规认证" },
    { id: "maintenance", label: "🔧 车辆保养知识" },
    { id: "scenario", label: "🏞️ 场景化量身置" }
  ];

  return (
    <div id="guides_container" className="space-y-12">
      
      {/* ========================================================
          Part 1: 智能选购匹配工效算力工具 (Interactive Match Wizard)
          ======================================================== */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/10 rounded-3xl p-6 sm:p-8 shadow-xl text-left">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/60 pb-6 mb-6">
          <div className="space-y-1.5 text-left">
            <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black rounded-lg uppercase tracking-wider block w-max">
              {lang === "en" ? "WIZARD · SMART ERGONOMICS" : "WIZARD · 工效智能匹配"}
            </span>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-500" />
              {lang === "en" ? "Interactive Child Mobility Sizing Wizard" : "童车参数匹配智敏算力箱"}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === "en" 
                ? "Enter baby physical attributes to dynamically calculate biomechanical wheel dimensions, posture requirements, and weight thresholds." 
                : "输入您家宝宝的真实身体特征值，我们将自动计算符合医学规范的安全轮径与最高车重死线"}
            </p>
          </div>
          <button 
            type="button" 
            onClick={() => setShowWizardResults(!showWizardResults)}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-600 transition flex items-center gap-1.5"
          >
            {showWizardResults 
              ? (lang === "en" ? "⚙️ Back to Adjustable Sliders" : "⚙️ 返回调整参数")
              : (lang === "en" ? "⚡ Compute Advice & Sift Inventory" : "⚡ 立即计算推荐 & 筛选在库产品")}
          </button>
        </div>

        {showWizardResults ? (
          // Matches results display viewport
          <div className="space-y-6 animate-fade-in text-left">
            
            {/* Safety math indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 text-lg font-black shrink-0">
                  {matchRecommendations.recWheel.split(" ")[0]}
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">
                    {lang === "en" ? "Recommended Wheel Size" : "安全推荐轮径"}
                  </span>
                  <strong className="text-white text-xs">{matchRecommendations.recWheel}</strong>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 text-lg font-black shrink-0">
                  {matchRecommendations.perfectWeightLimit}kg
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">
                    {lang === "en" ? "Golden Max Vehicle Weight (30%)" : "宝宝黄金车重上限 (30%)"}
                  </span>
                  <strong className="text-white text-xs">
                    {lang === "en" ? "Under this limit ensures absolute control" : "低于此自重，骑行最畅快安全"}
                  </strong>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-400/10 flex items-center justify-center text-red-400 text-lg font-black shrink-0">
                  {matchRecommendations.dangerWeightLimit}kg
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">
                    {lang === "en" ? "Rigid Biomechanical Stop (40%)" : "物理承载倾轧极限 (40%)"}
                  </span>
                  <strong className="text-white text-xs">
                    {lang === "en" ? "Heavier frames risk joint overload" : "高于此重量易转弯失控砸伤骨体"}
                  </strong>
                </div>
              </div>

            </div>

            {/* Simulated logic matching results list */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">
                  {lang === "en" 
                    ? `📋 Rigid Safety Recs Filtered (${matchRecommendations.matches.length} matches)` 
                    : `📋 为您严格筛选出的安全车型 (在库推荐数: ${matchRecommendations.matches.length})`}
                </h4>
                <button 
                  onClick={handleApplyWizardToProfile} 
                  className="text-[10px] text-amber-500 hover:underline hover:text-amber-400 font-bold"
                >
                  {lang === "en" ? "Sync and Apply to Full Site →" : "同步并应用于全站 →"}
                </button>
              </div>

              {matchRecommendations.matches.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-850">
                  <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <span className="text-xs text-slate-300 inline-block">
                    {lang === "en" ? "Apologies, no models currently match all physical limits." : "很抱歉，在库车型中暂时没有完全匹配您当下限制的产品。"}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {lang === "en" 
                      ? "You may increase budget bounds or scale accepted frame tare allowances." 
                      : "您可以试着增加预算（当前：￥3000）或调增可接受车自重后重新检视。"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {matchRecommendations.matches.map((p) => {
                    const dispProduct = translateProduct(p, lang);
                    const isPerfectWeight = p.weight <= matchRecommendations.perfectWeightLimit;
                    return (
                      <div key={dispProduct.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 hover:border-slate-800 flex flex-col justify-between space-y-3 transition group">
                        <div>
                          <div className="flex justify-between items-start text-[9px]">
                            <span className="bg-slate-900 border border-slate-850 text-amber-500 p-1 rounded font-bold uppercase leading-none">{dispProduct.brand}</span>
                            <span className="text-slate-500 font-mono">ID: {dispProduct.id}</span>
                          </div>
                          
                          <h4 className="text-xs sm:text-sm font-black text-white mt-1.5 truncate group-hover:text-amber-400 transition-colors">{dispProduct.name}</h4>
                          <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-relaxed italic">“{dispProduct.editorVerdict}”</p>
                        </div>

                        {/* Metric block inside wizard matches */}
                        <div className="border-t border-slate-900/80 pt-2.5 text-[10px] text-slate-400 space-y-1">
                          <div className="flex justify-between">
                            <span>{lang === "en" ? "Measured Weight:" : "车身净重："}</span>
                            <strong className={isPerfectWeight ? "text-green-400" : "text-amber-500"}>{dispProduct.weight} kg</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>{lang === "en" ? "Reference Price:" : "参考市价："}</span>
                            <strong className="text-amber-500 font-mono">{lang === "en" ? "$" : "￥"}{dispProduct.price}</strong>
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectProduct(p)}
                          className="w-full py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold text-[10px] uppercase rounded border border-slate-850 hover:border-slate-800 transition-all"
                        >
                          {lang === "en" ? "Analyze Report Details →" : "深入研析这份检测书 →"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick click back to form */}
            <div className="pt-2 text-center">
              <button 
                onClick={() => setShowWizardResults(false)}
                className="text-xs font-bold text-slate-500 hover:text-white underline transition"
              >
                {lang === "en" ? "← Back to revise parameters and sliders" : "← 返回重新微调宝宝岁数、跨高及我的购买预算偏好"}
              </button>
            </div>

          </div>
        ) : (
          // Input Fields Form View
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-300 text-left">
            
            {/* Input 1: Age */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
              <label className="text-slate-400 font-bold flex items-center justify-between">
                <span>{lang === "en" ? "1. Age Limit" : "1. 宝宝周岁 (Age)"}</span>
                <span className="font-mono text-amber-500">{wizardAge} {lang === "en" ? "yrs" : "岁"}</span>
              </label>
              <input
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={wizardAge}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setWizardAge(val);
                }}
                className="w-full accent-amber-500 bg-slate-900"
              />
              <span className="text-[10px] text-slate-500 block">
                {lang === "en" ? "Determines bone density and wheel scaling" : "用于判定骨盆发育及适配轮型"}
              </span>
            </div>

            {/* Input 2: Height */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
              <label className="text-slate-400 font-bold flex items-center justify-between">
                <span>{lang === "en" ? "2. Total Height" : "2. 宝宝净身高 (Height)"}</span>
                <span className="font-mono text-amber-500">{wizardHeight} cm</span>
              </label>
              <input
                type="range"
                min="70"
                max="160"
                step="1"
                value={wizardHeight}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setWizardHeight(val);
                  setWizardInseam(Math.floor(val * 0.38)); // Default estimation
                }}
                className="w-full accent-amber-500 bg-slate-900"
              />
              <span className="text-[10px] text-slate-500 block">
                {lang === "en" ? "Sets height reach tolerances" : "基础身高比例测定限制"}
              </span>
            </div>

            {/* Input 3: Inseam/Leg heights */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
              <label className="text-slate-400 font-bold flex items-center justify-between">
                <span>{lang === "en" ? "3. Crotch-Inseam" : "3. 脱鞋腿内侧跨高"}</span>
                <span className="font-mono text-amber-400 font-black">{wizardInseam} cm</span>
              </label>
              <input
                type="range"
                min="20"
                max="75"
                step="1"
                value={wizardInseam}
                onChange={(e) => setWizardInseam(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-900"
              />
              <span className="text-[10px] text-slate-500 block">
                {lang === "en" ? "Guarantees foot-plant safety margin" : "底座座椅支撑重心线检测要害"}
              </span>
            </div>

            {/* Input 4: Weight */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
              <label className="text-slate-400 font-bold flex items-center justify-between">
                <span>{lang === "en" ? "4. Child Weight" : "4. 宝宝重 (Weight)"}</span>
                <span className="font-mono text-red-400 font-black">{wizardWeight} kg</span>
              </label>
              <input
                type="range"
                min="5"
                max="65"
                step="0.5"
                value={wizardWeight}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setWizardWeight(val);
                }}
                className="w-full accent-amber-500 bg-slate-900"
              />
              <span className="text-[10px] text-slate-500 block">
                {lang === "en" ? "Calculates the strict 30% weight limit" : "力学重心核验，防沉重钢铁侧摔"}
              </span>
            </div>

            {/* Input 5: Budget */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 sm:col-span-2">
              <label className="text-slate-400 font-bold flex items-center justify-between">
                <span>{lang === "en" ? "5. Max Purchase Budget" : "5. 我的买车预算"}</span>
                <span className="font-mono text-green-400 font-black">
                  {lang === "en" ? `$ ${wizardBudget}` : `￥ ${wizardBudget}`}
                </span>
              </label>
              <input
                type="range"
                min="100"
                max="8000"
                step="50"
                value={wizardBudget}
                onChange={(e) => setWizardBudget(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-900"
              />
              <span className="text-[10px] text-slate-500 block">
                {lang === "en" ? "Filter in-stock configurations" : "一键排除超荷高估溢价车型"}
              </span>
            </div>

            {/* Input 6: Scenario Choice */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 sm:col-span-2">
              <label className="text-slate-400 font-bold block text-left">
                {lang === "en" ? "6. Physical Travel Road constraints" : "6. 主要出行道路场景特征"}
              </label>
              <select
                value={wizardScenario}
                onChange={(e) => setWizardScenario(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 rounded p-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">{lang === "en" ? "🌐 Standard Pavement / Mall Slabs" : "🌐 全部道路 (多场景覆盖)"}</option>
                <option value="tight">{lang === "en" ? "🚇 Urban Subways / Tiny Apartments (Requires lightweight)" : "🚇 城市地铁高密通勤 (偏重超轻轻便款)"}</option>
                <option value="rough">{lang === "en" ? "🏞️ Rough Muddy Tracks & Wet Slopes (Pneumatic tires rule)" : "🏞️ 硬核户外泥沙颠地 (偏向气减震防爆轮)"}</option>
              </select>
              <span className="text-[10px] text-slate-500 block">
                {lang === "en" ? "Aligns tyre tread and weight tolerances" : "根据场景自动调配适格阻尼度"}
              </span>
            </div>

          </div>
        )}

      </section>

      {/* ========================================================
          Part 2: 专家选车科普指南库 (Expert Guides Directory Library)
          ======================================================== */}
      <section className="space-y-6">
        {selectedGuideState ? (() => {
          const guide = translateGuideArticle(selectedGuideState, lang);
          return (
            // Read detail mode view container
            <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl relative animate-fade-in text-left">
              <button
                onClick={() => setSelectedGuideState(null)}
                className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 font-bold uppercase pb-4 border-b border-slate-800/80 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                {lang === "en" ? "Back to Guides List" : "返回安全指南库"}
              </button>

              <div className="space-y-4">
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black rounded-lg uppercase">
                  {guide.categoryLabel}
                </span>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
                  {guide.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                    {guide.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    {guide.publishDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {guide.readTime}
                  </span>
                </div>
              </div>

              {/* Summary card description box */}
              <div className="bg-slate-950 p-4 rounded-xl border-l-4 border-amber-500 text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                <strong>{lang === "en" ? "Brief Summary: " : "概要："}</strong> {guide.summary}
              </div>

              {/* Split paragraph parsing markdown code */}
              <div className="whitespace-pre-wrap text-slate-300 text-xs sm:text-sm leading-8 space-y-6 border-t border-slate-800/80 pt-6">
                {guide.content.split("\n\n").map((para: string, ip: number) => {
                  if (para.startsWith("### ")) {
                    return <h3 key={ip} className="text-lg font-bold text-white mt-6 mb-2">{para.replace("### ", "")}</h3>;
                  }
                  if (para.startsWith("#### ")) {
                    return <h4 key={ip} className="text-base font-bold text-amber-400 mt-4 mb-2">{para.replace("#### ", "")}</h4>;
                  }
                  if (para.startsWith("* ") || para.startsWith("- ")) {
                    return (
                      <ul key={ip} className="list-disc list-inside space-y-1 text-slate-400 pl-2">
                        {para.split("\n").map((li, il) => (
                          <li key={il}>{li.replace(/^(\* |- )/, "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={ip} className="text-slate-300 leading-relaxed text-justify">{para}</p>;
                })}
              </div>

              <div className="pt-6 border-t border-slate-800/80 flex justify-between">
                <button
                  onClick={() => setSelectedGuideState(null)}
                  className="px-4 py-2 bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 text-xs rounded-xl font-bold transition"
                >
                  {lang === "en" ? "Back to Guides" : "关闭阅读返回"}
                </button>
              </div>

            </div>
          );
        })() : (
          // Grid directory card view listing
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-2xl font-black text-white flex items-center justify-center gap-2">
                <BookOpen className="w-6 h-6 text-amber-500" />
                {lang === "en" ? "Ergonomic科普 & Sizing Bible" : "研究所安全考量与科普常识库"}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === "en" 
                  ? "Bypass marketing clichés. Get pure biomechanical calculations, ASTM F963 rules, and posture standards."
                  : "拒绝任何母婴带货噱头。我们只用物理公式、阻燃测试数据以及国家与国际合规红线，解算最无创的挑选逻辑。"}
              </p>
            </div>

            {/* Sifting tabs and filters */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 text-left">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-600 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === "en" ? "Search safety keywords, Q-Factor, ISO rules, ASTM limits..." : "检索核心安全术语、Q-factor、避震材质..."}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Directories tabs tags list */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-left">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      selectedCategory === c.id
                        ? "bg-amber-500 text-slate-950 border-amber-400"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Render guides list */}
            {filteredGuides.length === 0 ? (
              <div className="p-16 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-xs text-slate-500">
                  {lang === "en" ? "No guide articles match your search parameters." : "没有搜索到对应条件的安全科普指南书"}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left animate-fade-in">
                {filteredGuides.map((guide) => (
                  <div
                    key={guide.id}
                    onClick={() => setSelectedGuideState(guide)}
                    className="bg-slate-900 border border-slate-800 hover:border-amber-500/20 rounded-2xl p-5 flex flex-col justify-between space-y-4 cursor-pointer hover:shadow-lg transition group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="bg-slate-950 text-amber-500 px-2 py-0.5 rounded border border-slate-850 font-bold uppercase">
                          {guide.categoryLabel}
                        </span>
                        <span className="text-slate-500 font-mono font-bold">{guide.publishDate}</span>
                      </div>

                      <h4 className="font-extrabold text-white text-sm sm:text-base leading-snug group-hover:text-amber-400 transition-colors">
                        {guide.title}
                      </h4>
                      <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                        {guide.summary}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-850/80">
                      <span>{lang === "en" ? "Expert: " : "著者: "} {guide.author.split("-")[0]}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-0.5 font-mono">
                          <Clock className="w-3 h-3 text-amber-500" />
                          {guide.readTime}
                        </span>
                        <span className="text-amber-500 hover:underline font-bold">
                          {lang === "en" ? "Dive In →" : "严谨研读 →"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

    </div>
  );
}
