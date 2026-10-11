// IndexedDB stores image data separately so large photos do not fill localStorage.
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("meryem-recipe-images", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("images");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function getRecipeImage(id: string): Promise<string | null> {
  const db = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("images", "readonly");
      const req = tx.objectStore("images").get(id);
      req.onsuccess = () =>
        resolve(typeof req.result === "string" ? req.result : null);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}
export async function storeRecipeImage(
  id: string,
  data: string,
): Promise<void> {
  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("images", "readwrite");
      tx.objectStore("images").put(data, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}
const inFlight = new Map<string, Promise<string>>();
export function ensureRecipeImage(id: string, ticket: string): Promise<string> {
  const current = inFlight.get(id);
  if (current) return current;
  const promise = (async () => {
    let cached: string | null = null;
    try {
      cached = await getRecipeImage(id);
    } catch {}
    if (cached) return cached;
    const response = await fetch("/api/recipes/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Görsel üretilemedi.");
    if (
      typeof result.imageUrl !== "string" ||
      !result.imageUrl.startsWith("data:image/webp;base64,")
    )
      throw new Error("Görsel yanıtı geçersiz.");
    try {
      await storeRecipeImage(id, result.imageUrl);
    } catch {
      throw new Error(
        "Görsel üretildi ancak bu cihazda saklanamadı. Tarayıcı depolama alanını kontrol et.",
      );
    }
    return result.imageUrl;
  })();
  inFlight.set(id, promise);
  void promise.finally(() => inFlight.delete(id)).catch(() => {});
  return promise;
}
