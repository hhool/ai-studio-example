import React, { useState, useEffect } from "react";
import { 
  Save, 
  Layout, 
  Trash2, 
  Plus, 
  ArrowRight,
  Monitor
} from "lucide-react";
import { getCMSSettings, saveCMSSettings, getCMSProducts, getCMSEvaluations, getCMSGuides } from "../../lib/cmsService";
import { CMSSettings, HomeSlot } from "../../types";

export default function SettingsManager({ lang }: { lang: "zh" | "en" }) {
  const [settings, setSettings] = useState<CMSSettings | null>(null);
  const [pool, setPool] = useState<{ id: string; name: string; type: string }[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [s, p, e, g] = await Promise.all([
      getCMSSettings(),
      getCMSProducts(),
      getCMSEvaluations(),
      getCMSGuides()
    ]);
    
    setSettings(s || {
      id: "global",
      hero: {
        zh: { title: "全球专业童车评测与选购决策平台", subtitle: "权威实测 | 科学选购 | 全球资讯" },
        en: { title: "Global Kids Mobility Evaluation & Decision Platform", subtitle: "Authority Review | Scientific Guide | Global Trends" }
      },
      homeSlots: []
    });

    const combinedPool = [
      ...p.map(x => ({ id: x.id, name: x.zh.name || x.en.name, type: "product" })),
      ...e.map(x => ({ id: x.id, name: x.zh.title || x.en.title, type: "review" })),
      ...g.map(x => ({ id: x.id, name: x.zh.title || x.en.title, type: "guide" }))
    ];
    setPool(combinedPool);
  };

  const handleSave = async () => {
    if (settings) {
      await saveCMSSettings(settings);
      alert("Store updated successfully.");
    }
  };

  const addSlot = () => {
    if (settings) {
      setSettings({
        ...settings,
        homeSlots: [...settings.homeSlots, { id: `slot_${Date.now()}`, type: "product", targetId: "" }]
      });
    }
  };

  const removeSlot = (id: string) => {
    if (settings) {
      setSettings({
        ...settings,
        homeSlots: settings.homeSlots.filter(s => s.id !== id)
      });
    }
  };

  const updateSlot = (id: string, updates: Partial<HomeSlot>) => {
    if (settings) {
      setSettings({
        ...settings,
        homeSlots: settings.homeSlots.map(s => s.id === id ? { ...s, ...updates } : s)
      });
    }
  };

  if (!settings) return null;

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{lang === "zh" ? "首页与全局配置" : "Home & Config"}</h2>
          <p className="text-slate-500 font-medium mt-1">Configure global visual identity and recommendation pools.</p>
        </div>
        <button onClick={handleSave} className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black shadow-2xl flex items-center gap-2 hover:bg-orange-500 transition-all">
          <Save className="w-5 h-5 text-orange-400" />
          Deploy Changes
        </button>
      </header>

      {/* Hero Section Config */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <Monitor className="w-6 h-6 text-slate-900" />
          <h3 className="font-black text-lg uppercase tracking-tight">Main Hero Configuration</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
            <h4 className="text-[10px] font-black text-orange-500 uppercase">Chinese (ZH) Hero</h4>
            <Field label="Hero Slogan" value={settings.hero.zh.title} onChange={(v: string) => setSettings({...settings, hero: {...settings.hero, zh: {...settings.hero.zh, title: v}}})} />
            <Field label="Hero Sub-slogan" value={settings.hero.zh.subtitle} onChange={(v: string) => setSettings({...settings, hero: {...settings.hero, zh: {...settings.hero.zh, subtitle: v}}})} />
          </div>
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
            <h4 className="text-[10px] font-black text-blue-500 uppercase">English (EN) Hero</h4>
            <Field label="Hero Slogan" value={settings.hero.en.title} onChange={(v: string) => setSettings({...settings, hero: {...settings.hero, en: {...settings.hero.en, title: v}}})} />
            <Field label="Hero Sub-slogan" value={settings.hero.en.subtitle} onChange={(v: string) => setSettings({...settings, hero: {...settings.hero, en: {...settings.hero.en, subtitle: v}}})} />
          </div>
        </div>
      </section>

      {/* Slots Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layout className="w-6 h-6 text-slate-900" />
            <h3 className="font-black text-lg uppercase tracking-tight">Home Recommend Slots (Annual Rankings)</h3>
          </div>
          <button onClick={addSlot} className="flex items-center gap-2 px-6 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-900 hover:bg-slate-200 transition-colors">
            <Plus className="w-4 h-4" /> Add Recommend Slot
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {settings.homeSlots.map((slot, index) => (
            <div key={slot.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-8 group">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black">
                {index + 1}
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-6">
                 <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase">Slot Type</label>
                    <select 
                      className="w-full bg-slate-50 p-3 rounded-xl font-bold text-xs border border-transparent focus:bg-white focus:border-slate-900 transition-all"
                      value={slot.type}
                      onChange={(e) => updateSlot(slot.id, { type: e.target.value as any })}
                    >
                      <option value="product">Product Card</option>
                      <option value="review">Review Report</option>
                      <option value="guide">Buying Guide</option>
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase">Linked Object ID</label>
                    <select 
                      className="w-full bg-slate-50 p-3 rounded-xl font-bold text-xs border border-transparent focus:bg-white focus:border-slate-900 transition-all"
                      value={slot.targetId}
                      onChange={(e) => updateSlot(slot.id, { targetId: e.target.value })}
                    >
                      <option value="">-- UNLINKED --</option>
                      {pool.filter(p => p.type === slot.type).map(p => (
                        <option key={p.id} value={p.id}>{p.name} (ID#{p.id})</option>
                      ))}
                    </select>
                 </div>
              </div>

              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity pr-4">
                  <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 flex items-center gap-2">
                    Visual Mapping <ArrowRight className="w-3 h-3" />
                  </div>
                  <button onClick={() => removeSlot(slot.id)} className="p-3 bg-red-50 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
              </div>
            </div>
          ))}

          {settings.homeSlots.length === 0 && (
            <div className="bg-slate-50/50 p-20 rounded-[40px] border border-dashed border-slate-200 text-center">
               <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No slots configured. Home rankings will appear empty.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <input className="w-full bg-slate-50 border border-slate-100 py-4 px-6 rounded-2xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white transition-all" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
