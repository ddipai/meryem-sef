# Meryem Şef — Frontend Prototipi

Next.js App Router + React + TypeScript. Windows, macOS ve Linux üzerinde çalışır.

## 1. Kurulum

Node.js 22 LTS veya daha yeni bir LTS sürümünü kurun. ZIP'i çıkarıp `meryem-chef` klasörünü VS Code ile açın. Terminali bu klasörde açın:

```bash
npm install
npm run dev
```

Tarayıcıda http://localhost:3000 adresini açın. Terminali açık tutun; kapatmak için Ctrl+C. Kod değişiklikleri otomatik yansır. Bu prototip için API anahtarı veya `.env` dosyası gerekmez.

## 2. Görseller

Kendi görsellerinizi `public/images/` klasörüne aşağıdaki isimlerle ekleyin. Kodda yollar hazırdır; görsel bulunmadığında boş görsel alanı görünür.

| Dosya | Ekran |
| --- | --- |
| login.webp | Giriş; şeffaf arka planlı şef görseli önerilir |
| welcome.webp | Karşılama ve tarif sonucu şef görseli |
| ingredients.webp | Malzemeler |
| category.webp | Kategori |
| difficulty.webp | Zorluk |
| servings.webp | Porsiyon |
| save.webp | Tarif isimlendirme |
| recipe.webp | Kaydedilen tarif / paylaşım yemek görseli |

WEBP dosyası kullanın veya `app/page.tsx` içindeki `.webp` uzantılarını kendi formatınıza göre değiştirin. Desktop'ta dikey, mobilde yatay kırpma uygulanır; gerekirse `app/globals.css` içindeki `.photo img` kuralına `object-position` ekleyin. Marka şu anda yazı olarak gösterilir; kendi logonuzu ekleyerek `.brand` ve `.photo-brand` alanlarını değiştirebilirsiniz.

## 3. Fontlar

Lisansına sahip olduğunuz fontları şu dosya adlarıyla ekleyin:

- `public/fonts/Inter.woff2`
- `public/fonts/SoftRock.woff2`

`app/globals.css` içindeki `@font-face` tanımları hazırdır. Dosyalar eklenene kadar sistem fontları kullanılır. OTF/TTF kullanacaksanız hem dosya uzantısını hem `format()` değerini değiştirin.

## 4. Kod düzeni

- `app/page.tsx`: ekranlar, TR/EN metinler, örnek tarifler, anket ve kayıt akışı.
- `app/globals.css`: masaüstü ve mobil stil kuralları.
- `app/layout.tsx`: sayfa başlığı ve metadata.
- `public/`: görseller, fontlar, favicon.

Örnek tarif puanlaması malzeme adlarının eşleşme oranını kullanır. Kategori ve zorluk alanları üretim düzeyinde bir kural motoruna bağlı değildir. AI, gerçek üyelik, tarif veritabanı ve admin paneli henüz bağlı değildir. Giriş demo olarak çalışır; kayıtlar `localStorage` içinde sadece kullanılan cihaz ve tarayıcıda tutulur. Alternatif tarifler örnek havuzdan döner. Paylaşım cihaz destekliyorsa paylaş menüsünü açar, desteklemiyorsa tarif metnini panoya kopyalar.

## 5. Kontroller

```bash
npm run typecheck
npm run build
npm start
```

`npm start`, başarılı bir `npm run build` sonrasında üretim sürümünü açar. Geliştirme için `npm run dev` yeterlidir.

## 6. GitHub'a yükleme

Git kurulu olmalı. GitHub'da boş bir repository oluşturun; README, lisans veya gitignore eklemeyin. Proje terminalinde:

```bash
git init
git add .
git commit -m "Initial frontend prototype"
git branch -M main
git remote add origin https://github.com/KULLANICI/REPO.git
git push -u origin main
```

`KULLANICI/REPO` kısmını kendi repository adresinizle değiştirin. Daha sonraki güncellemeler:

```bash
git add .
git commit -m "Update frontend"
git push
```

`.gitignore`, `node_modules`, `.next` ve `.env` dosyalarını dışarıda tutar. Görselleri ve fontları yalnızca dağıtım lisansları izin veriyorsa repository'ye koyun.

## 7. Birlikte devam etmek

GitHub'a yükledikten sonra repository bağlantısını paylaşın. Bilgisayarınızın dosyalarına doğrudan erişimim yok; sonraki çalışmalarda repository veya yüklediğiniz proje dosyaları üzerinden değişiklik hazırlayabiliriz. Yerel bilgisayarınızda çalışan Codex kullanıyorsanız bu klasörü açıp aynı proje üzerinde devam edebilirsiniz.
