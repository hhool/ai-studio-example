import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Scale, 
  CheckCircle2, 
  X, 
  Plus, 
  Maximize2, 
  ThumbsUp, 
  Bookmark, 
  BookOpen, 
  Info,
  DollarSign
} from "lucide-react";
import { Product, ProductCategory } from "../types";
import { translateProduct, translateCategory } from "../lib/translate";

interface ProductsSectionProps {
  productsData: Product[];
  onSelectProduct: (p: Product) => void;
  compareList: Product[];
  setCompareList: (list: Product[]) => void;
  savedProducts: Product[];
  setSavedProducts: (list: Product[]) => void;
  childProfile: any;
  userEmail: string;
  lang?: "zh" | "en";
}

export default function ProductsSection({
  productsData,
  onSelectProduct,
  compareList,
  setCompareList,
  savedProducts,
  setSavedProducts,
  childProfile,
  userEmail,
  lang = "zh"
}: ProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("overallScore");
  const [showCompareDrawer, setShowCompareDrawer] = useState<boolean>(false);

  // Dynamic filter label helper
  const getCategoryLabel = (cat: ProductCategory) => {
    return translateCategory(cat, lang);
  };

  const categories = lang === "en" ? [
    { id: "all", label: "📁 All Database" },
    { id: "balance", label: "🚲 Balance Bikes" },
    { id: "bicycle", label: "🚴 Pedal Bikes" },
    { id: "scooter", label: "🛹 Kick Scooters" },
    { id: "stroller", label: "👶 Baby Strollers" },
    { id: "electric_car", label: "⚡ Kids Electric Cars" },
    { id: "tricycle", label: "🧸 Tricycles" },
    { id: "safety_seat", label: "🛡️ Safety Seats" },
    { id: "cross_border", label: "✈️ Cross-Border Custom" },
    { id: "industrial_belt", label: "🏭 Industrial Brands" }
  ] : [
    { id: "all", label: "📁 全部类目数据库" },
    { id: "balance", label: "🚲 儿童平衡车" },
    { id: "bicycle", label: "🚴 儿童自行车" },
    { id: "scooter", label: "🛹 儿童滑板车" },
    { id: "stroller", label: "👶 婴儿推车" },
    { id: "electric_car", label: "⚡ 儿童电动车" },
    { id: "tricycle", label: "🧸 儿童三轮车" },
    { id: "safety_seat", label: "🛡️ 安全座椅" },
    { id: "cross_border", label: "✈️ 跨境专属款" },
    { id: "industrial_belt", label: "🏭 产业带品牌" }
  ];

  // Filtering and sorting math
  const filteredProducts = useMemo(() => {
    return productsData
      .map(p => translateProduct(p, lang))
      .filter((p) => {
        const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
        const matchesSearch = searchQuery.trim() === "" ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tireType.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "overallScore") return b.overallScore - a.overallScore;
        if (sortBy === "weightAsc") return a.weight - b.weight;
        if (sortBy === "priceDesc") return b.price - a.price;
        if (sortBy === "priceAsc") return a.price - b.price;
        return 0;
      });
  }, [selectedCategory, searchQuery, sortBy, productsData, lang]);

  // Compare toggles (allows up to 3 items!)
  const handleToggleCompare = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const exists = compareList.find(p => p.id === product.id);
    let newList: Product[] = [];
    if (exists) {
      newList = compareList.filter(p => p.id !== product.id);
    } else if (compareList.length >= 3) {
      if (lang === "en") {
        alert("Comparison Limit: For ideal display width, side-by-side matrices are capped at 3 models. Previous designs have been cycle replaced.");
      } else {
        alert("【对比上限提醒】为保证在移动和电脑端都能有极佳的阅读空间，横评对比最多支持 3 款同台哦！已自动替换较先加入的车款。");
      }
      newList = [compareList[1], compareList[2], product];
    } else {
      newList = [...compareList, product];
    }
    setCompareList(newList);
    setShowCompareDrawer(true);
  };

  // Saved / Bookmark toggles
  const handleToggleSave = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userEmail) {
      if (lang === "en") {
        alert("Saved List is a free premium feature. Please click 'Register / Log in' at the top to secure an account!");
      } else {
        alert("【会员注册提醒】保存方案为专属免费特权。请点顶部‘注册登录’注册一个哈希受保护邮箱，即可秒速锁解锁特权！");
      }
      return;
    }

    const alreadySaved = savedProducts.some(s => s.id === product.id);
    if (alreadySaved) {
      setSavedProducts(savedProducts.filter(s => s.id !== product.id));
      if (lang === "en") {
        alert(`Successfully removed [${product.name}] from your saved list.`);
      } else {
        alert(`已成功将 [${product.name}] 从您的会员个人库中移除。`);
      }
    } else {
      setSavedProducts([...savedProducts, product]);
      if (lang === "en") {
        alert(`Successfully saved [${product.name}]! You can download high-res PDF datasheets dynamically inside user panel.`);
      } else {
        alert(`已成功将 [${product.name}] 妥加储存在您的会员数据库中！您可以前往“会员中心”一键下载 PDF 高清报告。`);
      }
    }
  };

  return (
    <div id="product_library" className="space-y-8">
      
      {/* Upper description */}
      <section className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
          <BookOpen className="w-6 h-6 text-amber-500" />
          {lang === "en" ? "Comprehensive Product Metrics Database" : "全品类精密实体数据库 (Database)"}
        </h2>
        <p className="text-xs text-slate-400">
          {lang === "en" 
            ? "Rigid metrology laboratory testing results of global models and magnesium alloy foundries." 
            : "包含主流大牌及中国新派极轻压铸镁合金产业带红利国货。每款均上物理台车经过实际测定。"}
        </p>
      </section>

      {/* Control panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4 text-left">
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "en" ? "Search name, alloy / carbon materials, tire grip types..." : "搜产品名 (Woom/闪电/迪卡侬等)、材料特性 (镁合金/碳钢)、胎阻..."}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="overallScore">{lang === "en" ? "🏆 Platform Overall Score" : "🏆 平台工效大分优先"}</option>
            <option value="weightAsc">{lang === "en" ? "⚖️ Lightest Net Weight" : "⚖️ 自重最轻优先"}</option>
            <option value="priceDesc">{lang === "en" ? "💰 Price: High to Low" : "💰 市场售价最高"}</option>
            <option value="priceAsc">{lang === "en" ? "💎 Price: Low to High" : "💎 亲民平价优先"}</option>
          </select>
        </div>

        {/* Categories tags list */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                selectedCategory === c.id
                  ? "bg-amber-500 text-slate-950 border-amber-400 animate-pulse"
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

      </div>

      {/* Side-by-Side Comparison Drawer/Box (Up to 3 items) */}
      {showCompareDrawer && compareList.length > 0 && (
        <div className="bg-slate-900 border border-amber-500/20 rounded-3xl p-6 shadow-2xl space-y-6 text-left animate-fade-in relative max-w-5xl mx-auto">
          
          <button 
            onClick={() => setShowCompareDrawer(false)}
            className="absolute right-4 top-4 p-1.5 bg-slate-950 text-slate-400 hover:text-white rounded-lg border border-slate-800 hover:border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              {lang === "en" ? `⚖️ Horizontal Biomechanical Comparison (${compareList.length}/3)` : `⚖️ 实验室中立横向参数大对比 (${compareList.length}/3 款同台)`}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="py-2.5 text-slate-500 font-bold text-left w-1/4">
                    {lang === "en" ? "Physical Metrics" : "物理指标"}
                  </th>
                  {compareList.map((p) => {
                    const disp = translateProduct(p, lang);
                    return (
                      <th key={disp.id} className="py-2.5 px-4 text-white font-extrabold text-left bg-slate-950/40 border-l border-slate-800/80">
                        <div className="flex justify-between items-start gap-2">
                          <span className="truncate max-w-[130px] inline-block">{disp.name}</span>
                          <button 
                            onClick={(e) => handleToggleCompare(p, e)} 
                            className="text-red-400 hover:text-red-300 p-0.5 rounded hover:bg-red-950/20"
                          >
                            ✕
                          </button>
                        </div>
                      </th>
                    );
                  })}
                  {/* Empty headers to keep width unified */}
                  {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                    <th key={idx} className="py-2.5 px-4 text-slate-600 font-medium text-center border-l border-slate-800/80 italic">
                      {lang === "en" ? "+ Add comparison" : "+ 待添加对比车款"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {/* 1. Brand */}
                <tr>
                  <td className="py-2 text-slate-500 font-bold">{lang === "en" ? "Brand" : "品牌与原产港口"}</td>
                  {compareList.map(p => {
                    const disp = translateProduct(p, lang);
                    return <td key={disp.id} className="py-2 px-4 border-l border-slate-800/60 font-semibold">{disp.brand}</td>;
                  })}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={i} className="py-2 px-4 border-l border-slate-800/60 text-slate-700">-</td>)}
                </tr>
                {/* 2. Weight */}
                <tr>
                  <td className="py-2 text-slate-500 font-bold">{lang === "en" ? "Weight Scale" : "车辆实测净重量"}</td>
                  {compareList.map(p => {
                    const disp = translateProduct(p, lang);
                    const isOver = disp.weight > childProfile.weight * 0.3 && (disp.category === "bicycle" || disp.category === "balance");
                    return (
                      <td key={disp.id} className="py-2 px-4 border-l border-slate-800/60 font-mono font-black">
                        <span className={isOver ? "text-amber-500" : "text-green-400"}>{disp.weight} kg</span>
                        {isOver && (
                          <span className="text-[9px] text-amber-500/60 block font-sans">
                            {lang === "en" ? "Too heavy! (Exceeds 30% limit)" : "超出宝宝30%车重比线!"}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={i} className="py-2 px-4 border-l border-slate-800/60 text-slate-700">-</td>)}
                </tr>
                {/* 3. Materials */}
                <tr>
                  <td className="py-2 text-slate-500 font-bold">{lang === "en" ? "Materials & Overcoats" : "车架主体及车漆工艺"}</td>
                  {compareList.map(p => {
                    const disp = translateProduct(p, lang);
                    return <td key={disp.id} className="py-2 px-4 border-l border-slate-800/60">{disp.material}</td>;
                  })}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={i} className="py-2 px-4 border-l border-slate-800/60 text-slate-700">-</td>)}
                </tr>
                {/* 4. Overall Score */}
                <tr>
                  <td className="py-2 text-slate-500 font-bold">{lang === "en" ? "Product Overall Score" : "物理安全工效大分"}</td>
                  {compareList.map(p => {
                    const disp = translateProduct(p, lang);
                    return <td key={disp.id} className="py-2 px-4 border-l border-slate-800/60 font-mono text-amber-400 font-black">{disp.overallScore} / 10</td>;
                  })}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={i} className="py-2 px-4 border-l border-slate-800/60 text-slate-700">-</td>)}
                </tr>
                {/* 5. Brake style */}
                <tr>
                  <td className="py-2 text-slate-500 font-bold">{lang === "en" ? "Braking System Setup" : "制动器形式(手刹)"}</td>
                  {compareList.map(p => {
                    const disp = translateProduct(p, lang);
                    return <td key={disp.id} className="py-2 px-4 border-l border-slate-800/60 text-[11px] leading-relaxed">{disp.brakeType}</td>;
                  })}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={i} className="py-2 px-4 border-l border-slate-800/60 text-slate-700">-</td>)}
                </tr>
                {/* 6. Tire style */}
                <tr>
                  <td className="py-2 text-slate-500 font-bold">{lang === "en" ? "Friction & Road Grip" : "外胎摩擦力与避震抓地"}</td>
                  {compareList.map(p => {
                    const disp = translateProduct(p, lang);
                    return <td key={disp.id} className="py-2 px-4 border-l border-slate-800/60 text-[11px] leading-relaxed">{disp.tireType}</td>;
                  })}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={i} className="py-2 px-4 border-l border-slate-800/60 text-slate-700">-</td>)}
                </tr>
                {/* 7. Reference Price */}
                <tr>
                  <td className="py-2 text-slate-500 font-bold">{lang === "en" ? "Estimated Price" : "参考公开市价"}</td>
                  {compareList.map(p => {
                    const disp = translateProduct(p, lang);
                    return <td key={disp.id} className="py-2 px-4 border-l border-slate-800/60 font-mono text-amber-500 font-extrabold">{lang === "en" ? "$" : "￥"}{disp.price}</td>;
                  })}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={i} className="py-2 px-4 border-l border-slate-800/60 text-slate-700">-</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid listing */}
      {filteredProducts.length === 0 ? (
        <div className="p-16 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500">
            {lang === "en" ? "No matches found in full digital database." : "在库数据库中暂时没有与该检索条件匹配的车款"}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const diProduct = translateProduct(p, lang);
            const isWeightOver = (diProduct.category === "bicycle" || diProduct.category === "balance")
              ? diProduct.weight > childProfile.weight * 0.3
              : false;

            const isAlreadySaved = savedProducts.some(s => s.id === diProduct.id);
            const isAlreadyCompared = compareList.some(c => c.id === diProduct.id);

            return (
              <div
                key={diProduct.id}
                onClick={() => onSelectProduct(p)}
                className="bg-slate-900 border border-slate-800/80 hover:border-amber-500/20 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:shadow-xl transition group text-left cursor-pointer relative animate-fade-in"
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="bg-slate-950 text-amber-500 px-2 py-0.5 rounded border border-slate-850 font-bold uppercase shrink-0">
                      {getCategoryLabel(diProduct.category)}
                    </span>
                    <span className="text-slate-500 font-mono truncate max-w-[100px]">{diProduct.brand.split(" ")[0]}</span>
                  </div>

                  <h3 className="font-extrabold text-white text-sm sm:text-base leading-snug group-hover:text-amber-400 transition-colors">
                    {diProduct.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                    <div className="space-y-0.5">
                      <span className="text-slate-600 block text-[9px] font-bold">
                        {lang === "en" ? "Measured Weight" : "自重实测"}
                      </span>
                      <strong className={isWeightOver ? "text-amber-500 font-extrabold" : "text-green-400 font-bold"}>
                        {diProduct.weight} kg
                      </strong>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-600 block text-[9px] font-bold">
                        {lang === "en" ? "Reference Price" : "参考公开价"}
                      </span>
                      <strong className="text-amber-500 font-mono font-black">
                        {lang === "en" ? "$" : "￥"}{diProduct.price}
                      </strong>
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed italic">
                    “{diProduct.editorVerdict}”
                  </p>
                </div>

                {/* Card actions footprint */}
                <div className="flex justify-between items-center gap-1.5 pt-3.5 border-t border-slate-850 text-[10px] text-slate-400">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleToggleCompare(p, e)}
                      className={`px-2.5 py-1.5 rounded-lg border font-bold transition flex items-center gap-1 ${
                        isAlreadyCompared 
                          ? "bg-amber-500/15 border-amber-500/45 text-amber-400"
                          : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Scale className="w-3 h-3" />
                      {isAlreadyCompared 
                        ? (lang === "en" ? "In Compare" : "已在对比")
                        : (lang === "en" ? "Compare" : "横评对比")}
                    </button>
                    <button
                      onClick={(e) => handleToggleSave(p, e)}
                      className={`px-2.5 py-1.5 rounded-lg border font-bold transition flex items-center gap-1 ${
                        isAlreadySaved
                          ? "bg-amber-500/15 border-amber-500/45 text-amber-400"
                          : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Bookmark className="w-3 h-3 fill-current" />
                      {isAlreadySaved 
                        ? (lang === "en" ? "Saved" : "已存个人库")
                        : (lang === "en" ? "Save Model" : "存个人库")}
                    </button>
                  </div>
                  <span className="text-amber-500 hover:underline font-bold group-hover:translate-x-0.5 transition-all">
                    {lang === "en" ? "Analyze Details →" : "极细研析 →"}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
