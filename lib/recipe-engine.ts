export type CatalogRecipe = {
  id: string;
  name: string;
  category: number;
  difficulty: number;
  ingredients: string[];
  instructions: string[];
  en?: string;
  ingredientLines?: string[];
  ingredientsEn?: string[];
  instructionsEn?: string[];
  baseServings?: number | null;
  yieldLabel?: string;
  imageUrl?: string;
};
export type GeneratedRecipe = {
  id: string;
  name: string;
  en: string;
  category: number;
  ingredients: string[];
  ingredientsEn: string[];
  instructions: string[];
  instructionsEn: string[];
  minutes: number;
  source: "adapted" | "generated";
  baseRecipeId: string | null;
  matchScore: number;
  servings: number;
  imageUrl?: string | null;
  imageTicket?: string | null;
};
const aliases: Record<string, string> = {
  chicken: "tavuk",
  pepper: "biber",
  onion: "sogan",
  tomato: "domates",
  quinoa: "kinoa",
  eggplant: "patlican",
  carrot: "havuc",
  lettuce: "marul",
  chickpeas: "nohut",
  lentils: "mercimek",
  potato: "patates",
  apple: "elma",
  yogurt: "yogurt",
  milk: "sut",
  flour: "un",
  egg: "yumurta",
  sugar: "seker",
  "ladyfinger biscuits": "kedi dili",
  ladyfingers: "kedi dili",
  "vanilla pudding": "vanilyali puding",
  "chocolate pudding": "cikolatali puding",
  "labneh cheese": "labne",
  labneh: "labne",
  coffee: "kahve",
  cocoa: "kakao",
  bulgur: "bulgur",
  semolina: "irmik",
  purslane: "semizotu",
  "tomato paste": "domates salcasi",
  garlic: "sarimsak",
  mushrooms: "mantar",
  spinach: "ispanak",
  "ground beef": "dana kiyma",
};
export function normalize(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
export function parseIngredients(text: string) {
  return [
    ...new Set(
      text
        .split(/[,;\n]+/)
        .map(normalize)
        .map((x) => aliases[x] || x)
        .filter(Boolean),
    ),
  ];
}
export function rankRecipes(
  catalog: CatalogRecipe[],
  input: string[],
  category: number,
  level: number,
  exclude: string[],
) {
  return catalog
    .filter(
      (r) =>
        r.category === category &&
        r.difficulty <= level &&
        !exclude.includes(r.id),
    )
    .map((r) => ({
      recipe: r,
      score: Math.round(
        (100 *
          r.ingredients.filter((i) => {
            const key = normalize(i);
            return input.some(
              (x) => x === key || ` ${x} `.includes(` ${key} `),
            );
          }).length) /
          r.ingredients.length,
      ),
    }))
    .sort((a, b) => b.score - a.score);
}
export function isGeneratedRecipe(
  value: unknown,
): value is Omit<
  GeneratedRecipe,
  | "id"
  | "source"
  | "baseRecipeId"
  | "matchScore"
  | "servings"
  | "category"
  | "imageUrl"
  | "imageTicket"
> {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  const list = (x: unknown) =>
    Array.isArray(x) &&
    x.length > 0 &&
    x.length <= 30 &&
    x.every(
      (s) => typeof s === "string" && s.trim().length > 0 && s.length <= 1200,
    );
  return (
    typeof v.name === "string" &&
    v.name.length > 0 &&
    v.name.length <= 120 &&
    typeof v.en === "string" &&
    v.en.length > 0 &&
    v.en.length <= 120 &&
    list(v.ingredients) &&
    list(v.ingredientsEn) &&
    list(v.instructions) &&
    list(v.instructionsEn) &&
    Array.isArray(v.ingredients) &&
    Array.isArray(v.ingredientsEn) &&
    v.ingredients.length === v.ingredientsEn.length &&
    typeof v.minutes === "number" &&
    Number.isInteger(v.minutes) &&
    v.minutes > 0 &&
    v.minutes <= 600
  );
}
