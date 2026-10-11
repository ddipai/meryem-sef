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
} from "lucide-react";

type Recipe = {
  id: string;
  name: string;
  en: string;
  ingredients: string[];
  category: number;
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
      "Mutfakta birlikte harikalar yaratacağız. Malzemelerini seç, sana uygun tarifi birlikte bulalım.",
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
    demo: "Önizleme · Örnek tarifler",
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
    demo: "Preview · Sample recipes",
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
    [menu, setMenu] = useState(false),
    [text, setText] = useState(""),
    [category, setCategory] = useState<number | null>(null),
    [level, setLevel] = useState<number | null>(null),
    [servings, setServings] = useState<number | null>(null),
    [recipe, setRecipe] = useState(recipes[0]),
    [score, setScore] = useState(0),
    [name, setName] = useState(""),
    [saved, setSaved] = useState<
      { id: string; name: string; recipe: string; servings: number }[]
    >([]),
    [notice, setNotice] = useState(""),
    [modal, setModal] = useState(false),
    [account, setAccount] = useState(false),
    [shares, setShares] = useState(0);

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
    const id = setTimeout(() => {
      const tokens = text
        .toLocaleLowerCase("tr")
        .split(/[,;\n]+/)
        .map((x) => aliases[x.trim()] || x.trim());
      const ranked = recipes
        .map((r) => ({
          r,
          score: Math.round(
            (r.ingredients.filter((i) => tokens.some((a) => a.includes(i)))
              .length /
              r.ingredients.length) *
              100,
          ),
        }))
        .sort(
          (a, b) =>
            b.score - a.score ||
            Number(b.r.category === category) -
              Number(a.r.category === category),
        );
      setRecipe(ranked[0].r);
      setScore(ranked[0].score);
      setStep(6);
    }, 1800);
    return () => clearTimeout(id);
  }, [step, text, category]);

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
        servings: servings || 2,
      },
      ...saved,
    ];
    setSaved(items);
    localStorage.setItem("meryem-recipes", JSON.stringify(items));
    setNotice(t.saved);
    setStep(8);
  }

  const ingredients = recipe.ingredients.map((i) =>
    lang === "en" ? Object.keys(aliases).find((k) => aliases[k] === i) || i : i,
  );

  const methods =
    lang === "tr"
      ? [
          "Malzemeleri yıka ve eşit büyüklükte doğra.",
          "Tavaya zeytinyağı ekle. Soğan ve sebzeleri orta ateşte sotele.",
          recipe.id === "chicken" ? "Tavuğu ekle ve tamamen pişene kadar yaklaşık 15 dakika pişir."
          : recipe.id === "quinoa" ? "Kinoayı bol suyla yıka, iki ölçü suyla 15 dakika pişir. Sebzelerle birleştir."
          : recipe.id === "soup" ? "Mercimek ve suyu ekle. Malzemeler yumuşayıncaya kadar yaklaşık 25 dakika pişir."
          : "Sebzeleri ve haşlanmış nohudu geniş bir salata kasesine al.",
          "Zeytinyağı, limon, tuz ve karabiberle tatlandır. Sıcak veya ılık servis et.",
        ]
      : [
          "Wash and chop the ingredients into even pieces.",
          "Heat olive oil in a pan. Sauté the onion and vegetables over medium heat.",
          recipe.id === "chicken" ? "Add the chicken and cook thoroughly for about 15 minutes."
          : recipe.id === "quinoa" ? "Rinse quinoa and cook in two parts water for 15 minutes. Combine with vegetables."
          : recipe.id === "soup" ? "Add lentils and water. Simmer for about 25 minutes until tender."
          : "Place the vegetables and cooked chickpeas in a large salad bowl.",
          "Season with olive oil, lemon, salt and pepper. Serve warm or fresh.",
        ];

  async function share() {
    const message = `${name || rname} (${servings || 2} ${t.people})\n\n${ingredients.join(", ")}\n\n${methods.map((x, i) => `${i + 1}. ${x}`).join("\n")}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: name || rname, text: message });
      } else {
        await navigator.clipboard.writeText(message);
        setNotice(t.copied);
      }
      setShares(shares + 1);
    } catch {
      setNotice(
        lang === "tr"
          ? "Paylaşım tamamlanmadı. Metni seçip kopyalayabilirsin."
          : "Sharing did not finish. Select and copy the text.",
      );
    }
  }

  const imageKey = step === 1 ? "ingredients" : step === 2 ? "category" : step === 3 ? "difficulty" : step === 4 ? "servings" : step === 7 ? "save" : step === 8 ? "recipe" : "welcome";

  const photo = (
    <div className={"photo " + (step === 8 ? "dish" : "")}>
      <img
        src={`/images/${imageKey}.png`}
        alt=""
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <div className="image-placeholder">
        <ChefHat size={44} strokeWidth={1} />
        <span>{step === 8 ? rname : "Meryem Şef"}</span>
      </div>
      {step > 0 && (
        <span className="photo-brand">
          <Image
            src="images/logo.svg"
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
                setRecipe(recipes.find((r) => r.id === s.recipe) || recipes[0]);
                setName(s.name);
                setServings(s.servings);
                setScore(0);
                setStep(8);
                setMenu(false);
              }}
            >
              <strong>{s.name}</strong>
              <span>
                {t.people} · {s.servings}
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
            src="images/logo.svg"
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
            {lang.toUpperCase()}<Image
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
                            src="/images/meryem-chef-login.png" className="chef"
                            alt=""
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                        <img
                            src="/images/login-yemek.png" className="dish"
                            alt=""
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                    </div>
                </div>
                <div className="login-card">
                    <p>{t.logintext}</p>
                    <button className="outline" onClick={() => { setAccount(true); setStep(0); }}>
                        {t.login}
                    </button>
                    <div className="divider">{lang === "tr" ? "YA DA" : "OR"}</div>
                    <button className="primary" onClick={() => { setAccount(false); setStep(0);}}>
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
              <div className="step-content">
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
                    <div className="spinner" />
                    <h1>{t.loading}</h1>
                    <p>{t.loadsub}</p>
                    <span>{text}</span>
                  </div>
                )}

                {step === 6 && (
                  <>
                    <h1>{t.result}</h1>
                    <p>{t.resultsub}</p>
                    <div className="result-meta">
                      <span>
                        <Utensils size={15} />
                        {servings} {t.people}
                      </span>
                      <span>{t.levels[level || 0]}</span>
                      <span>
                        {score}% {t.match}
                      </span>
                    </div>
                    {score < 35 && <p className="low-match">{t.low}</p>}
                    <article className="recipe">
                      <h2>{rname}</h2>
                      <div className="recipe-columns">
                        <section>
                          <h3>{t.ingredients}</h3>
                          <ul>
                            {ingredients.map((x, i) => (
                              <li key={x}>
                                {i === 0
                                  ? (servings || 2) * 100 + " g "
                                  : Math.max(
                                      1,
                                      Math.round((servings || 2) / 2),
                                    ) + " × "}
                                {x}
                              </li>
                            ))}
                            <li>
                              {lang === "tr"
                                ? "Zeytinyağı, limon, tuz ve karabiber"
                                : "Olive oil, lemon, salt and pepper"}
                            </li>
                          </ul>
                        </section>
                        <section>
                          <h3>{t.method}</h3>
                          <ol>
                            {methods.map((x) => (
                              <li key={x}>{x}</li>
                            ))}
                          </ol>
                        </section>
                      </div>
                    </article>
                    <div className="action-row">
                      <button
                        className="outline"
                        onClick={() => {
                          setRecipe(
                            recipes[
                              (recipes.indexOf(recipe) + 1) % recipes.length
                            ],
                          );
                          setScore(0);
                        }}
                      >
                        {t.alt}
                      </button>
                      <button
                        className="primary"
                        onClick={() => {
                          setName("");
                          setStep(7);
                        }}
                      >
                        <Bookmark size={16} />
                        {t.save}
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
                    <div className="success">
                      <Check size={16} />
                      {name || rname}
                    </div>
                    <h1>{t.sharetitle}</h1>
                    <p>{t.sharetext}</p>
                    <button
                      className="outline full"
                      onClick={() => setModal(true)}
                    >
                      <Share2 size={17} />
                      {t.share}
                    </button>
                    <button className="outline full" onClick={() => setStep(6)}>
                      {lang === "tr"
                        ? "Tarif detaylarını gör"
                        : "View recipe details"}
                    </button>
                    <button className="primary full" onClick={begin}>
                      {t.new}
                    </button>
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
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={t.share}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              aria-label={t.close}
              onClick={() => setModal(false)}
            >
              <X />
            </button>
            <h2>{name || rname}</h2>
            <p>
              {servings} {t.people}
            </p>
            <p>{ingredients.join(", ")}</p>
            <ol>
              {methods.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
            <button className="primary full" onClick={share}>
              <Copy size={16} />
              {t.share}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
