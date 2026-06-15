import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Extract config
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

import { productsData } from "../src/data/modelsData";

function translateMaterialToEn(mat: string): string {
  const map: Record<string, string> = {
    "航天级6061铝合金": "Aerospace-grade 6061 Aluminum",
    "高端镁合金": "Premium Magnesium Alloy",
    "超轻碳纤维": "Ultralight Carbon Fiber",
    "高碳钢": "High Carbon Steel",
    "A1高级加厚铝合金车架": "A1 Premium Double-Butted Aluminum Frame",
    "高密度工程抗磨塑料外壳/钢管内梁": "HDPE Wear-resistant Body & Steel Crossbeams",
    "热塑树脂/防折钢质内嵌中枢": "Casted Thermoplastic Resin with Steel Core",
    "加固型玻璃纤维合成高弹板 + 阳极氧化合金杆": "Reinforced Fiberglass Seat Deck & Anodized T-Bar",
    "阳极氧化航空铝合金底盘": "Anodized Aerospace Aluminum Chassis"
  };
  return map[mat] || mat;
}

// Very basic English translation fallback for seed
export async function seedProducts() {
  console.log("Seeding products...");
  
  for (const p of productsData) {
    const pDoc = doc(db, "products", p.id);
    
    // We create a CMSProduct structure
    const pZh = {
      name: p.name,
      description: p.editorVerdict || "",
      brandText: p.brand,
      specsText: "",
      pros: p.pros || [],
      cons: p.cons || [],
      editorVerdict: p.editorVerdict || ""
    };
    
    // Quick english translation simulation for seeding
    const pEn = {
      name: p.name, // Usually we want english name, but for this seed script we use what's there
      description: p.editorVerdict || "",
      brandText: p.brand,
      specsText: "",
      pros: p.pros || [],
      cons: p.cons || [],
      editorVerdict: p.editorVerdict || ""
    };
    
    const cmsProd = {
      ...p,
      status: "published",
      zh: pZh,
      en: pEn,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(pDoc, cmsProd);
    console.log("Seeded:", p.id);
  }
  
  console.log("Seeding complete!");
  process.exit(0);
}

seedProducts().catch(console.error);
