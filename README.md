# TaskFlow — Görev ve Proje Yönetim Sistemi API

Node.js ve Express.js ile geliştirilmiş, görevlerin oluşturulmasını, listelenmesini, güncellenmesini ve silinmesini sağlayan bir REST API.

## Gereksinimler

- [Node.js](https://nodejs.org/) 18 veya üzeri
- npm (Node.js ile birlikte gelir)
- Test için [Postman](https://www.postman.com/)

## Kurulum

```bash
# 1. Repoyu indirin
git clone https://github.com/mustafaparabakan-maker/taskflow.git
cd taskflow

# 2. Bağımlılıkları kurun
npm install

# 3. Sunucuyu başlatın
npm start
```

Sunucu varsayılan olarak `http://localhost:3000` adresinde çalışır. Farklı bir port için:

```bash
PORT=4000 npm start          # macOS / Linux
set PORT=4000 && npm start   # Windows (cmd)
```

Geliştirme sırasında dosya değiştikçe otomatik yeniden başlatma için `npm run dev` kullanılabilir.

## Klasör Yapısı

```
taskflow/
├── data/
│   └── tasks.json             # Görevlerin saklandığı JSON dosyası
├── docs/
│   ├── PROJE_TANITIM.md       # Proje tanıtım dokümanı
│   └── screenshots/           # Postman test ekran görüntüleri
├── logs/
│   └── requests.log           # Logger middleware çıktısı (otomatik oluşur)
├── postman/
│   └── TaskFlow.postman_collection.json
├── src/
│   ├── controllers/
│   │   └── taskController.js  # CRUD iş mantığı
│   ├── data/
│   │   └── taskStore.js       # JSON dosyası okuma/yazma
│   ├── middleware/
│   │   ├── logger.js          # İstek loglama middleware'i
│   │   └── errorHandler.js    # 404 ve hata yakalayıcı
│   ├── routes/
│   │   └── taskRoutes.js      # /tasks endpoint tanımları
│   ├── app.js                 # Express uygulaması
│   └── server.js              # Sunucuyu başlatan giriş noktası
├── package.json
└── README.md
```

## Endpoint'ler

| Method | Endpoint      | Açıklama            | Başarılı Yanıt |
|--------|---------------|---------------------|----------------|
| GET    | `/tasks`      | Tüm görevleri listeler | 200 |
| GET    | `/tasks/:id`  | Görev detayı        | 200 / 404 |
| POST   | `/tasks`      | Yeni görev ekler    | 201 / 400 |
| PUT    | `/tasks/:id`  | Görevi günceller    | 200 / 400 / 404 |
| DELETE | `/tasks/:id`  | Görevi siler        | 200 / 404 |

### Görev Modeli

| Alan        | Tip    | Açıklama |
|-------------|--------|----------|
| id          | number | Otomatik verilir |
| title       | string | **Zorunlu** |
| description | string | İsteğe bağlı |
| status      | string | `pending` · `in-progress` · `completed` (varsayılan: `pending`) |
| priority    | string | `low` · `medium` · `high` (varsayılan: `medium`) |
| assignee    | string | Görevin atandığı çalışan |
| project     | string | Görevin ait olduğu proje |
| createdAt   | string | Oluşturulma zamanı (otomatik) |
| updatedAt   | string | Son güncelleme zamanı (otomatik) |

### Örnek İstek — Görev Ekleme

```http
POST /tasks
Content-Type: application/json

{
  "title": "Login sayfası API'si",
  "description": "Kullanıcı girişi için endpoint yazılacak",
  "priority": "high",
  "assignee": "musa",
  "project": "TaskFlow"
}
```

Yanıt (`201 Created`):

```json
{
  "success": true,
  "message": "Görev oluşturuldu",
  "data": {
    "id": 3,
    "title": "Login sayfası API'si",
    "description": "Kullanıcı girişi için endpoint yazılacak",
    "status": "pending",
    "priority": "high",
    "assignee": "musa",
    "project": "TaskFlow",
    "createdAt": "2026-11-07T10:00:00.000Z",
    "updatedAt": "2026-11-07T10:00:00.000Z"
  }
}
```

## Logger Middleware

Her istek konsola ve `logs/requests.log` dosyasına şu formatta yazılır:

```
[2026-11-07T10:00:00.000Z] POST /tasks 201 - 3ms
```

## Postman ile Test

1. Postman'de **Import** → `postman/TaskFlow.postman_collection.json` dosyasını seçin.
2. Sunucunun çalıştığından emin olun (`npm start`).
3. Koleksiyondaki istekleri sırayla çalıştırın (Ekle → Listele → Detay → Güncelle → Sil).
4. Ekran görüntüleri `docs/screenshots/` klasöründedir.
