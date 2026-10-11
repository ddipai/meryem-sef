"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Menu,
  X,
  ChevronLeft,
  Check,
  ArrowUp,
  Bookmark,
  Share2,
  ChefHat,
  Utensils,
  Copy,
  Download,
  Mail,
  MessageCircle,
} from "lucide-react";

import { ensureRecipeImage } from "../lib/recipe-image-storage";
import type { GeneratedRecipe } from "../lib/recipe-engine";

function Linkedin({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM2 9h4v13H2zm7 0h4v2c1-2 3-3 5-2 3 1 4 3 4 6v7h-4v-7c0-2-1-3-2-3-2 0-3 1-3 3v7H9z" />
    </svg>
  );
}
function Facebook({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14 22v-9h3l.5-4H14V7c0-1 .4-2 2-2h2V1.5c-.5-.1-2-.5-3-.5-3 0-5 2-5 5v3H7v4h3v9z" />
    </svg>
  );
}
function Instagram({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function Youtube({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Marka hesaplarının adreslerini buradan güncelleyebilirsin.
const socialLinks = {
  facebook: "",
  instagram: "https://www.instagram.com/bizimmutfak/",
  youtube: "",
};

type Recipe = {
  id: string;
  name: string;
  en: string;
  ingredients: string[];
  category: number;
  ingredientsEn?: string[];
  instructions?: string[];
  instructionsEn?: string[];
  minutes?: number;
  source?: "adapted" | "generated";
  baseRecipeId?: string | null;
  matchScore?: number;
  imageUrl?: string | null;
  imageTicket?: string | null;
  difficulty?: number;
  userIngredients?: string;
};

const recipes: Recipe[] = [
  {
    id: "chicken",
    name: "Sebzeli Tavuk Sote",
    en: "Chicken & Vegetable Sauté",
    ingredients: ["tavuk", "biber", "soğan", "domates"],
    category: 2,
  },
  {
    id: "quinoa",
    name: "Közlenmiş Sebzeli Kinoa",
    en: "Roasted Vegetable Quinoa",
    ingredients: ["kinoa", "biber", "patlıcan", "havuç"],
    category: 1,
  },
  {
    id: "salad",
    name: "Sonbahar Salatası",
    en: "Autumn Salad",
    ingredients: ["marul", "domates", "havuç", "nohut"],
    category: 1,
  },
  {
    id: "soup",
    name: "Mercimekli Sebze Çorbası",
    en: "Lentil & Vegetable Soup",
    ingredients: ["mercimek", "soğan", "havuç", "patates"],
    category: 0,
  },
];

const aliases: Record<string, string> = {
  chicken: "tavuk",
  pepper: "biber",
  onion: "soğan",
  tomato: "domates",
  quinoa: "kinoa",
  eggplant: "patlıcan",
  carrot: "havuç",
  lettuce: "marul",
  chickpeas: "nohut",
  lentils: "mercimek",
  potato: "patates",
};

const copy = {
  tr: {
    start: "Başla",
    next: "İleri",
    back: "Geri",
    mine: "Tariflerim",
    empty: "Henüz bir tarif kaydetmedin.",
    hello: "Merhaba! Ben Bizim Mutfak’ın şefi Meryem.",
    intro:
      "Mutfakta birlikte hareket ederek yaratıcı tarifler oluşturabilir, tamamlayıcı lezzetleri keşfedebilir, eldeki malzemelere uygun yemeği bulabiliriz.",
    ready: "HAZIRSAN, LEZZET YOLCULUĞUMUZA BAŞLAYALIM MI?",
    questions: [
      "Evinde hangi malzemeler var?",
      "Ne tür bir tarif arıyorsun?",
      "Zorluk seviyesi ne olsun?",
      "Sofran kaç kişilik?",
    ],
    desc: [
      "Buzdolabı veya kilerindeki malzemeleri gir.",
      "Yemek kategorisini seç.",
      "Zorluk tercihini belirt.",
      "Porsiyon seçimini yap.",
    ],
    cats: ["Başlangıç", "Meze", "Ana yemek", "Ara sıcak", "Tatlı"],
    levels: ["Pratik", "Orta", "Usta işi"],
    people: "kişilik",
    loading: "Maharetlerimi senin için kullanıyorum…",
    loadsub: "Malzemelerini gözden geçiriyorum.",
    result: "Hepsi tamam! İşte tarifin:",
    resultsub: "Malzemelerini ve yapılışını adım adım aktarıyorum.",
    ingredients: "MALZEMELER",
    method: "YAPILIŞI",
    alt: "Alternatif Tarif Gör",
    save: "Tarifi Kaydet",
    name: "Tarifini nasıl adlandırmak istersin?",
    namesub: "Tarifine özel bir isim ver ve arşivine kaydet.",
    suggest: "Tarif adı için öneri al",
    finish: "Kaydı Tamamla",
    share: "Tarifi Paylaş",
    sharetitle: "Kiminle paylaşmak istersin?",
    sharetext: "Bu lezzeti sevdiklerinle paylaş.",
    copied: "Tarif kopyalandı",
    new: "Yeni Tarif Oluştur",
    guest: "Giriş Yapmadan Devam Et",
    login: "Demo hesabıyla devam et",
    welcome: "Meryem Şef’in Mutfağına Hoş Geldin.",
    logintext:
      "Tariflerini kaydetmek ve kişisel arşivini oluşturmak için giriş yap.",
    demo: "Önizleme · AI tarifleri",
    match: "Malzeme uyumu",
    low: "Uygun eşleşme bulunamadı. AI tarif üretimi backend aşamasında bağlanacak. Aşağıdaki örnek tarifi inceleyebilirsin.",
    saved: "Tarif bu cihazda kaydedildi.",
    close: "Kapat",
    placeholder: "Örneğin tavuk, biber, soğan, domates",
    nameph: "Örneğin akşam sofrası",
    registered: "Kayıtlı Tarif",
    month: "Bu Oturum",
    shared: "Paylaşılan",
  },
  en: {
    start: "Start",
    next: "Next",
    back: "Back",
    mine: "My Recipes",
    empty: "No saved recipes yet.",
    hello: "Hello! I’m Meryem, your Bizim Mutfak chef.",
    intro:
      "Let’s make something delicious together. Choose your ingredients and find a recipe that fits.",
    ready: "READY TO START OUR FLAVOUR JOURNEY?",
    questions: [
      "What ingredients do you have?",
      "What would you like to cook?",
      "How challenging should it be?",
      "How many are at your table?",
    ],
    desc: [
      "Enter the ingredients in your fridge or pantry.",
      "Choose a meal category.",
      "Select your preferred difficulty.",
      "Choose the number of servings.",
    ],
    cats: ["Starter", "Meze", "Main course", "Warm appetizer", "Dessert"],
    levels: ["Easy", "Medium", "Advanced"],
    people: "servings",
    loading: "Working my kitchen magic for you…",
    loadsub: "Looking through your ingredients.",
    result: "All ready! Here’s your recipe:",
    resultsub: "Your ingredients and step-by-step instructions.",
    ingredients: "INGREDIENTS",
    method: "METHOD",
    alt: "See Alternative",
    save: "Save Recipe",
    name: "What would you like to name it?",
    namesub: "Give your recipe a name and save it to your collection.",
    suggest: "Suggest a recipe name",
    finish: "Finish Saving",
    share: "Share Recipe",
    sharetitle: "Who will you share it with?",
    sharetext: "Share this dish with someone you love.",
    copied: "Recipe copied",
    new: "Create a New Recipe",
    guest: "Continue as Guest",
    login: "Continue with Demo Account",
    welcome: "Welcome to Meryem’s Kitchen.",
    logintext:
      "Sign in to save your recipes and build your personal collection.",
    demo: "Preview · AI recipes",
    match: "Ingredient match",
    low: "No suitable match found. AI generation will be connected in the backend phase. You can explore the sample recipe below.",
    saved: "Recipe saved on this device.",
    close: "Close",
    placeholder: "For example chicken, pepper, onion, tomato",
    nameph: "For example evening feast",
    registered: "Saved Recipes",
    month: "This Session",
    shared: "Shared",
  },
};

export default function Home() {
  const [lang, setLang] = useState<"tr" | "en">("tr"),
    [step, setStep] = useState(-1),
    [savedRecipeView, setSavedRecipeView] = useState(false),
    [menu, setMenu] = useState(false),
    [text, setText] = useState(""),
    [category, setCategory] = useState<number | null>(null),
    [level, setLevel] = useState<number | null>(null),
    [servings, setServings] = useState<number | null>(null),
    [recipe, setRecipe] = useState(recipes[0]),
    [score, setScore] = useState(0),
    [name, setName] = useState(""),
    [saved, setSaved] = useState<
      {
        id: string;
        name: string;
        recipe: string;
        servings: number;
        snapshot?: Recipe;
      }[]
    >([]),
    [notice, setNotice] = useState(""),
    [modal, setModal] = useState(false),
    [shareMode, setShareMode] = useState<"friend" | "social">("social"),
    [account, setAccount] = useState(false),
    [shares, setShares] = useState(0);

  const [aiError, setAiError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [exclude, setExclude] = useState<string[]>([]);
  const [previousTitle, setPreviousTitle] = useState("");

  const [generatedImage, setGeneratedImage] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const [imageError, setImageError] = useState("");
  const [imageAttempt, setImageAttempt] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [failedImageSource, setFailedImageSource] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!modal) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>(".recipe-share-modal");
    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), a[href], input, textarea",
        ) ?? [],
      );
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModal(false);
      if (event.key === "Tab") {
        const elements = focusable(),
          first = elements[0],
          last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [modal]);

  useEffect(() => {
    if ((step !== 6 && step !== 8) || recipe.source !== "generated") {
      setImageLoading(false);
      setImageError("");
      return;
    }
    let cancelled = false;
    setImageError("");
    if (!recipe.imageTicket) {
      setImageError(
        lang === "tr"
          ? "Bu eski tarifte görsel üretim bilgisi yok. Yeni bir tarif oluştur."
          : "This older recipe has no image generation information. Create a new recipe.",
      );
      return;
    }
    setImageLoading(true);
    ensureRecipeImage(recipe.id, recipe.imageTicket)
      .then((url) => {
        if (!cancelled) {
          setGeneratedImage({ id: recipe.id, url });
          setImageLoading(false);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setImageError(
            error instanceof Error ? error.message : "Görsel üretilemedi.",
          );
          setImageLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [step, recipe.id, recipe.source, recipe.imageTicket, imageAttempt]);

  const t = copy[lang],
    rname = lang === "tr" ? recipe.name : recipe.en;

  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem("meryem-recipes") || "[]"));
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(id);
  }, [notice]);

  useEffect(() => {
    if (step !== 5) return;
    const controller = new AbortController();
    setAiError("");
    // Delay lets React StrictMode cancel its first effect before a paid request starts.
    const timer = setTimeout(async () => {
      try {
        const response = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            ingredients: text,
            category,
            level,
            servings,
            lang,
            exclude,
            previousTitle,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          console.warn("Tarif isteği reddedildi", {
            status: response.status,
            code: data.code,
            details: data.details,
          });
          throw new Error(data.error || "AI yanıtı alınamadı.");
        }
        const generated: GeneratedRecipe = data.recipe;
        setRecipe({
          ...generated,
          difficulty: level ?? 0,
          userIngredients: text,
        });
        setScore(generated.matchScore);
        setStep(6);
      } catch (error) {
        if (!controller.signal.aborted)
          setAiError(
            error instanceof Error
              ? error.message
              : "AI bağlantısı kurulamadı.",
          );
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    step,
    text,
    category,
    level,
    servings,
    lang,
    attempt,
    exclude,
    previousTitle,
  ]);

  useEffect(() => {
    const ctx = (document as any).modelContext;
    if (!ctx?.registerTool) return;
    const c = new AbortController();
    try {
      Promise.resolve(
        ctx.registerTool(
          {
            name: "start_recipe_questionnaire",
            description:
              "Open the ingredient step of the recipe questionnaire.",
            inputSchema: {
              type: "object",
              properties: {},
              additionalProperties: false,
            },
            execute: () => {
              setStep(1);
              return { step: "ingredients" };
            },
          },
          { signal: c.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => c.abort();
  }, []);

  function begin() {
    setSavedRecipeView(false);
    setExclude([]);
    setPreviousTitle("");
    setAiError("");
    setText("");
    setCategory(null);
    setLevel(null);
    setServings(null);
    setName("");
    setStep(1);
    setMenu(false);
  }

  function save() {
    if (!name.trim()) return;
    const items = [
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        recipe: recipe.id,
        snapshot: recipe,
        servings: servings || 2,
      },
      ...saved,
    ];
    try {
      localStorage.setItem("meryem-recipes", JSON.stringify(items));
    } catch {
      setNotice(
        lang === "tr"
          ? "Tarif kaydedilemedi. Tarayıcı depolama alanını kontrol et."
          : "Could not save. Check your browser storage.",
      );
      return;
    }
    setSaved(items);
    setNotice(t.saved);
    setStep(8);
  }

  const ingredients = recipe.instructions
    ? lang === "en"
      ? recipe.ingredientsEn || recipe.ingredients
      : recipe.ingredients
    : recipe.ingredients.map((i) =>
        lang === "en"
          ? Object.keys(aliases).find((k) => aliases[k] === i) || i
          : i,
      );

  const methods = recipe.instructions
    ? lang === "en"
      ? recipe.instructionsEn || recipe.instructions
      : recipe.instructions
    : lang === "tr"
      ? [
          "Malzemeleri yıka ve eşit büyüklükte doğra.",
          "Tavaya zeytinyağı ekle. Soğan ve sebzeleri orta ateşte sotele.",
          recipe.id === "chicken"
            ? "Tavuğu ekle ve tamamen pişene kadar yaklaşık 15 dakika pişir."
            : recipe.id === "quinoa"
              ? "Kinoayı bol suyla yıka, iki ölçü suyla 15 dakika pişir. Sebzelerle birleştir."
              : recipe.id === "soup"
                ? "Mercimek ve suyu ekle. Malzemeler yumuşayıncaya kadar yaklaşık 25 dakika pişir."
                : "Sebzeleri ve haşlanmış nohudu geniş bir salata kasesine al.",
          "Zeytinyağı, limon, tuz ve karabiberle tatlandır. Sıcak veya ılık servis et.",
        ]
      : [
          "Wash and chop the ingredients into even pieces.",
          "Heat olive oil in a pan. Sauté the onion and vegetables over medium heat.",
          recipe.id === "chicken"
            ? "Add the chicken and cook thoroughly for about 15 minutes."
            : recipe.id === "quinoa"
              ? "Rinse quinoa and cook in two parts water for 15 minutes. Combine with vegetables."
              : recipe.id === "soup"
                ? "Add lentils and water. Simmer for about 25 minutes until tender."
                : "Place the vegetables and cooked chickpeas in a large salad bowl.",
          "Season with olive oil, lemon, salt and pepper. Serve warm or fresh.",
        ];

  const shareMessage = `${name || rname} (${servings || 2} ${t.people})\n\n${ingredients.join(", ")}\n\n${methods.map((x, i) => `${i + 1}. ${x}`).join("\n")}`;

  async function copyRecipe() {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setNotice(t.copied);
    } catch {
      setModal(true);
      setNotice(
        lang === "tr"
          ? "Metni aşağıdaki alandan seçip kopyalayabilirsin."
          : "Select and copy the text below.",
      );
    }
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: name || rname, text: shareMessage });
      } else {
        await copyRecipe();
        setNotice(t.copied);
      }
      setShares((count) => count + 1);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setModal(true);
      setNotice(
        lang === "tr"
          ? "Paylaşım tamamlanmadı. Metni seçip kopyalayabilirsin."
          : "Sharing did not finish. Select and copy the text.",
      );
    }
  }

  const imageKey =
    step === 1
      ? "ingredients"
      : step === 2
        ? "category"
        : step === 3
          ? "difficulty"
          : step === 4
            ? "servings"
            : step === 7
              ? "save"
              : step === 8
                ? "recipe"
                : "welcome";

  const recipeImage =
    recipe.imageUrl ||
    (generatedImage?.id === recipe.id ? generatedImage.url : null);
  const isRecipeScreen = step === 6 || step === 8;
  const photoSource = isRecipeScreen ? recipeImage : `/images/${imageKey}.png`;
  async function downloadShareCard() {
    if (!recipeImage || failedImageSource === recipeImage) return;
    try {
      await document.fonts.ready;
      const load = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      const food = await load(recipeImage);
      const [chef, logo] = await Promise.all([
        load("/images/meryem-chef-login.png").catch(() => null),
        load("/images/logo.svg").catch(() => null),
      ]);
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      const scale = Math.max(1080 / food.width, 1080 / food.height);
      ctx.drawImage(
        food,
        (1080 - food.width * scale) / 2,
        (1080 - food.height * scale) / 2,
        food.width * scale,
        food.height * scale,
      );
      ctx.fillStyle = "#c51629";
      ctx.fillRect(0, 65, 1080, 110);
      ctx.beginPath();
      ctx.moveTo(0, 870);
      ctx.lineTo(520, 1080);
      ctx.lineTo(0, 1080);
      ctx.fill();
      if (chef) {
        const h = 380,
          w = (h * chef.width) / chef.height;
        ctx.drawImage(chef, 42, 1010 - h, w, h);
      }
      if (logo) {
        const w = 140,
          h = (w * logo.height) / logo.width;
        ctx.drawImage(logo, 900, 1015 - h, w, h);
      }
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      let size = 58;
      const title = name || rname;
      do {
        ctx.font = `bold ${size--}px SoftRock, sans-serif`;
      } while (ctx.measureText(title).width > 960 && size > 24);
      ctx.fillText(title, 540, 142, 960);
      ctx.textAlign = "left";
      ctx.font = "bold 52px SoftRock, sans-serif";
      ctx.fillText("Meryem Şef", 30, 1045);
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Export failed"))),
          "image/png",
        ),
      );
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `meryem-sef-${recipe.id}.png`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setNotice(
        lang === "tr"
          ? "Görsel indirilemedi. Görsel dosyasını ve erişim izinlerini kontrol et."
          : "Could not download the image. Check the image file and its access permissions.",
      );
    }
  }

  const photo = (
    <div className={"photo " + (isRecipeScreen ? "dish" : "")}>
      {photoSource && failedImageSource !== photoSource && (
        <img
          key={photoSource}
          src={photoSource}
          alt={isRecipeScreen ? rname : ""}
          onError={() => setFailedImageSource(photoSource)}
        />
      )}
      <div className="image-placeholder">
        <ChefHat size={44} strokeWidth={1} />
        <span>{isRecipeScreen ? rname : "Meryem Şef"}</span>
        {isRecipeScreen && (
          <small
            style={{ fontFamily: "Inter, Arial, sans-serif", fontSize: 14 }}
          >
            {imageLoading
              ? lang === "tr"
                ? "Tarif görseli hazırlanıyor…"
                : "Preparing recipe image…"
              : !photoSource || failedImageSource === photoSource
                ? lang === "tr"
                  ? "Tarif görseli henüz hazır değil"
                  : "Recipe image is not available yet"
                : ""}
          </small>
        )}
      </div>
      {step > 0 && (
        <span className="photo-brand">
          <Image
            src="/images/logo.svg"
            alt="Meryem Şef"
            width={108}
            height={71}
            priority
          />
        </span>
      )}
    </div>
  );

  const sidebar = (
    <>
      <div className="sidebar-title">
        <h2>{t.mine}</h2>
        <p>
          {saved.length} {t.registered.toLowerCase()}
        </p>
      </div>
      <div className="saved-list">
        {saved.length === 0 ? (
          <p className="empty">{t.empty}</p>
        ) : (
          saved.map((s) => (
            <button
              className="saved-card"
              key={s.id}
              onClick={() => {
                const restored =
                  s.snapshot ||
                  recipes.find((r) => r.id === s.recipe) ||
                  recipes[0];
                setRecipe(restored);
                setCategory(restored.category);
                setLevel(restored.difficulty ?? 0);
                setText(
                  restored.userIngredients || restored.ingredients.join(", "),
                );
                setExclude([]);
                setPreviousTitle("");
                setName(s.name);
                setServings(s.servings);
                setScore(restored.matchScore || 0);
                setSavedRecipeView(true);
                setStep(6);
                setMenu(false);
              }}
            >
              <strong>{s.name}</strong>
              <span>
                {t.cats[s.snapshot?.category ?? 2]} ·{" "}
                {t.levels[s.snapshot?.difficulty ?? 0]} · {s.servings}{" "}
                {t.people}
              </span>
            </button>
          ))
        )}
      </div>
      <button className="sidebar-new" onClick={begin}>
        + {t.new}
      </button>
      <div className="profile">
        <span className="avatar">{account ? "A" : "M"}</span>
        <span>
          {account ? "Ayşe · Demo" : lang === "tr" ? "Misafir" : "Guest"}
        </span>
        <button
          onClick={() => {
            setStep(-1);
            setMenu(false);
          }}
        >
          {lang === "tr" ? "Çıkış" : "Exit"}
        </button>
      </div>
    </>
  );

  return (
    <main>
      <header>
        <button className="brand" onClick={() => setStep(0)}>
          <Image
            src="/images/logo.svg"
            alt="Meryem Şef"
            width={108}
            height={71}
            priority
          />
        </button>
        <div className="header-actions">
          <span className="demo">{t.demo}</span>
          <button
            className="language"
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
          >
            {lang.toUpperCase()}
            <Image
              src="icons/down.svg"
              alt=""
              width={10}
              height={10}
              priority
            />
          </button>
          <button
            className="menu-toggle"
            aria-label={t.mine}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {menu && (
        <div className="drawer-backdrop" onClick={() => setMenu(false)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </aside>
        </div>
      )}

      {step === -1 ? (
        <section className="login-wrapper">
          <div className="login">
            <div className="login-banner">
              <h1>{t.welcome}</h1>
              <div className="login-photo">
                <img
                  src="/images/meryem-chef-login.png"
                  className="chef"
                  alt=""
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <img
                  src="/images/login-yemek.png"
                  className="dish"
                  alt=""
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            </div>
            <div className="login-card">
              <p>{t.logintext}</p>
              <button
                className="outline"
                onClick={() => {
                  setAccount(true);
                  setStep(0);
                }}
              >
                {t.login}
              </button>
              <div className="divider">{lang === "tr" ? "YA DA" : "OR"}</div>
              <button
                className="primary"
                onClick={() => {
                  setAccount(false);
                  setStep(0);
                }}
              >
                {t.guest}
              </button>
              <small>
                {lang === "tr"
                  ? "Sunum için demo giriş. Gerçek üyelik sonraki aşamada."
                  : "Demo sign-in for this preview. Account integration comes next."}
              </small>
            </div>
          </div>
        </section>
      ) : (
        <div className={"workspace " + (step === 0 ? "home" : "wizard")}>
          {step === 0 && <aside className="desktop-sidebar">{sidebar}</aside>}
          {photo}
          <section className="content">
            {step === 0 ? (
              <>
                <div className="stats">
                  {[
                    [saved.length, t.registered],
                    [saved.length, t.month],
                    [shares, t.shared],
                  ].map(([n, l]) => (
                    <div key={l}>
                      <b>{n}</b>
                      <span>{l}</span>
                    </div>
                  ))}
                </div>
                <div className="welcome">
                  <h1>
                    {account
                      ? lang === "tr"
                        ? "Tekrar hoş geldin, Ayşe Hanım!"
                        : "Welcome back, Ayşe!"
                      : t.hello}
                  </h1>
                  {!account && <p>{t.intro}</p>}
                  <h2>{t.ready}</h2>
                  <button className="primary pill" onClick={begin}>
                    {t.start}
                  </button>
                </div>
              </>
            ) : (
              <div
                className={`step-content${step === 8 ? " share-screen" : ""}`}
              >
                {step < 5 && (
                  <div className="step-meta">
                    <button onClick={() => setStep(step - 1)}>
                      <ChevronLeft size={16} />
                      {t.back}
                    </button>
                    <span>0{step} / 04</span>
                  </div>
                )}

                {step >= 1 && step <= 4 && (
                  <>
                    <h1>{t.questions[step - 1]}</h1>
                    <p>{t.desc[step - 1]}</p>
                    {step === 1 ? (
                      <>
                        <textarea
                          aria-label={t.questions[0]}
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder={t.placeholder}
                        />
                        <button
                          className="outline next"
                          disabled={!text.trim()}
                          onClick={() => setStep(2)}
                        >
                          {t.next}
                        </button>
                      </>
                    ) : (
                      <div className="choices">
                        {(step === 2
                          ? t.cats
                          : step === 3
                            ? t.levels
                            : [1, 2, 4, 6].map((n) => `${n} ${t.people}`)
                        ).map((label, i) => (
                          <button
                            className={
                              (step === 2
                                ? category
                                : step === 3
                                  ? level
                                  : servings) ===
                              (step === 4 ? [1, 2, 4, 6][i] : i)
                                ? "selected"
                                : ""
                            }
                            key={label}
                            onClick={() => {
                              if (step === 2) setCategory(i);
                              if (step === 3) setLevel(i);
                              if (step === 4) setServings([1, 2, 4, 6][i]);
                              setStep(step + 1);
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {step === 5 && (
                  <div className="loading" role="status">
                    {!aiError && <div className="spinner" />}
                    <h1>
                      {aiError
                        ? lang === "tr"
                          ? "Tarif hazırlanamadı"
                          : "Could not prepare recipe"
                        : t.loading}
                    </h1>
                    <p role={aiError ? "alert" : undefined}>
                      {aiError || t.loadsub}
                    </p>
                    {aiError && (
                      <div className="action-row">
                        <button
                          className="primary"
                          onClick={() => setAttempt((n) => n + 1)}
                        >
                          {lang === "tr" ? "Tekrar dene" : "Retry"}
                        </button>
                        <button className="outline" onClick={() => setStep(1)}>
                          {t.back}
                        </button>
                      </div>
                    )}
                    <span>{text}</span>
                  </div>
                )}

                {step === 6 && (
                  <>
                    <h1>{t.result}</h1>
                    <p>{t.resultsub}</p>
                    {recipe.source === "generated" && imageLoading && (
                      <p role="status">
                        {lang === "tr"
                          ? "Tarifine özel görsel hazırlanıyor…"
                          : "Preparing an image for your recipe…"}
                      </p>
                    )}
                    {recipe.source === "generated" && imageError && (
                      <div role="alert">
                        <p>{imageError}</p>
                        <button
                          className="outline full"
                          onClick={() => setImageAttempt((n) => n + 1)}
                        >
                          {lang === "tr"
                            ? "Görseli tekrar dene"
                            : "Retry image"}
                        </button>
                      </div>
                    )}
                    {recipe.imageUrl &&
                      failedImageSource === recipe.imageUrl && (
                        <p role="status">
                          {lang === "tr"
                            ? "Bu tarifin görsel dosyası bulunamadı: "
                            : "Missing recipe image file: "}
                          {recipe.imageUrl}
                        </p>
                      )}

                    <div className="result-meta">
                      <span>
                        <Utensils size={15} />
                        {servings} {t.people}
                      </span>
                      <span>{t.levels[level || 0]}</span>
                      {recipe.minutes && (
                        <span>
                          {recipe.minutes}{" "}
                          {lang === "tr" ? "dakika" : "minutes"}
                        </span>
                      )}
                      {/*<span>
                        {score}% {t.match} 
                      </span>*/}
                      <span>{t.cats[recipe.category]}</span>
                    </div>
                    {/*recipe.source && (
                      <p className="low-match">
                        {recipe.source === "adapted"
                          ? lang === "tr"
                            ? "Tarif havuzumuzdan AI ile uyarlandı."
                            : "Adapted from our recipe collection with AI."
                          : lang === "tr"
                            ? "Uygun eşleşme olmadığı için AI yeni bir tarif oluşturdu."
                            : "AI created a new recipe because no suitable match was found."}
                      </p>
                    )*/}
                    <article className="recipe">
                      <h2>{rname}</h2>
                      <div className="recipe-columns">
                        <section>
                          <h3>{t.ingredients}</h3>
                          <ul>
                            {ingredients.map((x, i) => (
                              <li key={`ingredient-${i}`}>
                                {recipe.instructions
                                  ? ""
                                  : i === 0
                                    ? (servings || 2) * 100 + " g "
                                    : Math.max(
                                        1,
                                        Math.round((servings || 2) / 2),
                                      ) + " × "}
                                {x}
                              </li>
                            ))}
                            {!recipe.instructions && (
                              <li>
                                {lang === "tr"
                                  ? "Zeytinyağı, limon, tuz ve karabiber"
                                  : "Olive oil, lemon, salt and pepper"}
                              </li>
                            )}
                          </ul>
                        </section>
                        <section>
                          <h3>{t.method}</h3>
                          <ol>
                            {methods.map((x, i) => (
                              <li key={`method-${i}`}>{x}</li>
                            ))}
                          </ol>
                        </section>
                      </div>
                    </article>
                    <div className="action-row">
                      <button
                        className="outline"
                        onClick={() => {
                          setExclude((items) =>
                            recipe.baseRecipeId
                              ? [...items, recipe.baseRecipeId].slice(-20)
                              : items,
                          );
                          setSavedRecipeView(false);
                          setName("");
                          setPreviousTitle(recipe.name);
                          setStep(5);
                        }}
                      >
                        {t.alt}
                      </button>
                      <button
                        className="primary"
                        onClick={() => {
                          if (savedRecipeView) {
                            setStep(8);
                          } else {
                            setName("");
                            setStep(7);
                          }
                        }}
                      >
                        {savedRecipeView ? (
                          <Share2 size={16} />
                        ) : (
                          <Bookmark size={16} />
                        )}
                        {savedRecipeView
                          ? lang === "tr"
                            ? "Paylaş"
                            : "Share"
                          : t.save}
                      </button>
                    </div>
                  </>
                )}

                {step === 7 && (
                  <>
                    <h1>{t.name}</h1>
                    <p>{t.namesub}</p>
                    <form
                      className="name-input"
                      onSubmit={(e) => {
                        e.preventDefault();
                        save();
                      }}
                    >
                      <input
                        maxLength={80}
                        aria-label={t.name}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.nameph}
                      />
                      <button
                        className="primary"
                        disabled={!name.trim()}
                        aria-label={t.finish}
                      >
                        <ArrowUp />
                      </button>
                    </form>
                    <button
                      className="text-button"
                      onClick={() => setName(rname)}
                    >
                      {t.suggest}
                    </button>
                    <button
                      className="outline full"
                      disabled={!name.trim()}
                      onClick={save}
                    >
                      {t.finish}
                    </button>
                  </>
                )}

                {step === 8 && (
                  <>
                    {recipe.source === "generated" && imageLoading && (
                      <p role="status">
                        {lang === "tr"
                          ? "Tarifine özel görsel hazırlanıyor…"
                          : "Preparing an image for your recipe…"}
                      </p>
                    )}
                    {recipe.source === "generated" && imageError && (
                      <div role="alert">
                        <p>{imageError}</p>
                        <button
                          className="outline full"
                          onClick={() => setImageAttempt((n) => n + 1)}
                        >
                          {lang === "tr"
                            ? "Görseli tekrar dene"
                            : "Retry image"}
                        </button>
                      </div>
                    )}
                    {recipe.imageUrl &&
                      failedImageSource === recipe.imageUrl && (
                        <p role="status">
                          {lang === "tr"
                            ? "Bu tarifin görsel dosyası bulunamadı: "
                            : "Missing recipe image file: "}
                          {recipe.imageUrl}
                        </p>
                      )}
                    <h1>
                      {lang === "tr"
                        ? "Kiminle paylaşmak istersin?"
                        : "Who would you like to share it with?"}
                    </h1>
                    <p className="share-intro">
                      {lang === "tr"
                        ? "İster sosyal medyada paylaş, ister arkadaşlarına gönder."
                        : "Share on social media or send it to your friends."}
                    </p>
                    <div className="share-actions">
                      <button
                        className="share-action"
                        onClick={() => {
                          setShareMode("friend");
                          setModal(true);
                        }}
                      >
                        {lang === "tr"
                          ? "Arkadaşına Gönder"
                          : "Send to a Friend"}
                      </button>
                      <button
                        className="share-action share-action-filled"
                        onClick={() => {
                          setShareMode("social");
                          setModal(true);
                        }}
                      >
                        {lang === "tr"
                          ? "Sosyal Medyada Yayımla"
                          : "Post on Social Media"}
                      </button>
                    </div>
                    <div className="share-follow">
                      <p>
                        {lang === "tr"
                          ? "En özel lezzetlerden haberdar olmak için Bizim Mutfak’ı takip et."
                          : "Follow Bizim Mutfak to discover our special recipes."}
                      </p>
                      <div
                        className="share-socials"
                        aria-label={
                          lang === "tr"
                            ? "Sosyal medya hesapları"
                            : "Social media accounts"
                        }
                      >
                        {(
                          [
                            {
                              key: "facebook",
                              label: "Facebook",
                              Icon: Facebook,
                            },
                            {
                              key: "instagram",
                              label: "Instagram",
                              Icon: Instagram,
                            },
                            { key: "youtube", label: "YouTube", Icon: Youtube },
                          ] as const
                        ).map(({ key, label, Icon }) =>
                          socialLinks[key] ? (
                            <a
                              key={key}
                              href={socialLinks[key]}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={label}
                            >
                              <Icon size={20} />
                            </a>
                          ) : (
                            <button
                              key={key}
                              aria-label={label}
                              onClick={() =>
                                setNotice(
                                  lang === "tr"
                                    ? `${label} hesap bağlantısı henüz eklenmedi.`
                                    : `${label} account link has not been added yet.`,
                                )
                              }
                            >
                              <Icon size={20} />
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                    <div className="share-return">
                      <p>
                        {lang === "tr"
                          ? "Farklı bir tarif mi arıyorsun?"
                          : "Looking for a different recipe?"}
                      </p>
                      <button onClick={() => setStep(0)}>
                        <ChevronLeft size={21} />
                        {lang === "tr"
                          ? "MERYEM ŞEF’E DÖN"
                          : "BACK TO CHEF MERYEM"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            {step >= 1 && step <= 4 && (
              <div className="progress" aria-label={`${step}/4`}>
                {[1, 2, 3, 4].map((n) => (
                  <span key={n} className={step === n ? "active" : ""} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <section
            className={`modal recipe-share-modal ${shareMode}`}
            role="dialog"
            aria-modal="true"
            aria-label={
              shareMode === "friend"
                ? lang === "tr"
                  ? "Arkadaşına Gönder"
                  : "Send to a Friend"
                : lang === "tr"
                  ? "Sosyal Medyada Yayımla"
                  : "Post on Social Media"
            }
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              aria-label={t.close}
              onClick={() => setModal(false)}
            >
              <X />
            </button>
            <h2>
              {shareMode === "friend"
                ? lang === "tr"
                  ? "Arkadaşına Gönder"
                  : "Send to a Friend"
                : lang === "tr"
                  ? "Sosyal Medyada Yayımla"
                  : "Post on Social Media"}
            </h2>
            {shareMode === "friend" && (
              <p className="popup-description">
                {lang === "tr"
                  ? "Bu tarifi sevdiklerine birebir ulaştır."
                  : "Send this recipe directly to your loved ones."}
              </p>
            )}
            {shareMode === "social" && (
              <div className="popup-social-bar">
                <a
                  aria-label="X"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <X size={16} />
                </a>
                <button
                  aria-label="Facebook"
                  onClick={() => {
                    void copyRecipe();
                  }}
                >
                  <Facebook size={16} />
                </button>
                <button
                  aria-label="Instagram"
                  onClick={() => {
                    void copyRecipe();
                  }}
                >
                  <Instagram size={16} />
                </button>
                <button
                  aria-label="LinkedIn"
                  onClick={() => {
                    void copyRecipe();
                  }}
                >
                  <Linkedin size={16} />
                </button>
                <button
                  className="popup-download"
                  onClick={downloadShareCard}
                  disabled={!recipeImage || failedImageSource === recipeImage}
                >
                  <Download size={14} />
                  {lang === "tr" ? "Görüntüyü İndir" : "Download Image"}
                </button>
              </div>
            )}
            <div className="recipe-share-card">
              {recipeImage && failedImageSource !== recipeImage ? (
                <img
                  className="share-card-food"
                  src={recipeImage}
                  alt={name || rname}
                  onError={() => setFailedImageSource(recipeImage)}
                />
              ) : (
                <div className="share-card-placeholder">
                  {imageLoading
                    ? lang === "tr"
                      ? "Görsel hazırlanıyor…"
                      : "Preparing image…"
                    : lang === "tr"
                      ? "Tarif görseli henüz hazır değil"
                      : "Recipe image is not ready yet"}
                </div>
              )}
              <div className="share-card-title">{name || rname}</div>
              <div className="share-card-ribbon" />
              <img
                className="share-card-chef"
                src="/images/meryem-chef-login.png"
                alt=""
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />
              <strong className="share-card-signature">Meryem Şef</strong>
              <img
                className="share-card-logo"
                src="/images/logo.svg"
                alt="Bizim Mutfak"
              />
            </div>
            {shareMode === "friend" && (
              <>
                <p className="popup-label">
                  {lang === "tr" ? "Hangi uygulamayla?" : "Which app?"}
                </p>
                <div className="popup-friend-actions">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={18} />
                    <span>WhatsApp</span>
                  </a>
                  <button onClick={share}>
                    <Share2 size={18} />
                    <span>{lang === "tr" ? "Mesaj" : "Message"}</span>
                  </button>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(name || rname)}&body=${encodeURIComponent(shareMessage)}`}
                  >
                    <Mail size={18} />
                    <span>{lang === "tr" ? "E-posta" : "Email"}</span>
                  </a>
                </div>
                <label className="popup-label" htmlFor="popup-recipe-text">
                  {lang === "tr"
                    ? "Tarif metnini kopyala"
                    : "Copy the recipe text"}
                </label>
                <div className="popup-copy-row">
                  <input
                    id="popup-recipe-text"
                    readOnly
                    value={shareMessage}
                    onFocus={(event) => event.currentTarget.select()}
                  />
                  <button onClick={copyRecipe}>
                    <Copy size={14} />
                    {lang === "tr" ? "Kopyala" : "Copy"}
                  </button>
                </div>
              </>
            )}
            {shareMode === "social" && (
              <p className="popup-help">
                {lang === "tr"
                  ? "X ile paylaş veya tarif metnini kopyalayıp indirdiğin görselle hesabında yayımla."
                  : "Share on X, or copy the recipe text and post it with the downloaded image."}
              </p>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
