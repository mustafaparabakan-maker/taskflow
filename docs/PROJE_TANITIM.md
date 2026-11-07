# TaskFlow — Proje Tanıtım Dokümanı

## 1. Projenin Amacı

TaskFlow, bir yazılım şirketinin ekip içindeki görevleri, projeleri ve çalışanların sorumluluklarını takip edebilmesi için geliştirilmiş bir **REST API**'dir. Proje, Node.js ile Backend Programlama eğitiminin bitirme projesi olarak; Node.js, Express.js, routing, middleware ve CRUD konularını uygulamalı olarak göstermek amacıyla hazırlanmıştır.

## 2. Senaryo

Bir yazılım şirketinde birden fazla proje aynı anda yürütülmekte ve her projede farklı çalışanlara görevler verilmektedir. Yöneticiler hangi görevin kime atandığını, hangi durumda olduğunu ve ne kadar öncelikli olduğunu tek bir yerden görmek istemektedir.

TaskFlow bu ihtiyaca şu şekilde cevap verir:

- Yönetici yeni bir görev oluşturur ve bir çalışana atar.
- Çalışan görevin durumunu `pending` → `in-progress` → `completed` olarak günceller.
- Görevlere `low`, `medium`, `high` öncelik verilir.
- Artık gerekmeyen görevler sistemden silinir.
- Sisteme gelen tüm istekler kayıt altına alınır (loglanır).

## 3. Sistem Özeti

### Kullanılan Teknolojiler

| Teknoloji  | Kullanım Amacı |
|------------|----------------|
| Node.js    | Çalışma ortamı |
| Express.js | Sunucu, routing ve middleware |
| JSON dosyası | Veri saklama (`data/tasks.json`) |
| Postman    | API testleri |

### Veri Modeli — Görev (Task)

| Alan        | Tip    | Açıklama |
|-------------|--------|----------|
| id          | number | Benzersiz görev numarası |
| title       | string | Görev başlığı (zorunlu) |
| description | string | Görev açıklaması |
| status      | string | pending / in-progress / completed |
| priority    | string | low / medium / high |
| assignee    | string | Görevin atandığı çalışan |
| project     | string | Görevin bağlı olduğu proje |
| createdAt   | date   | Oluşturulma zamanı |
| updatedAt   | date   | Son güncelleme zamanı |

### API Tasarımı

| İşlem             | Method | Endpoint     |
|-------------------|--------|--------------|
| Görev Ekleme      | POST   | /tasks       |
| Görev Listeleme   | GET    | /tasks       |
| Görev Detayı      | GET    | /tasks/:id   |
| Görev Güncelleme  | PUT    | /tasks/:id   |
| Görev Silme       | DELETE | /tasks/:id   |

### Mimari

Proje katmanlı bir yapıda düzenlenmiştir:

```
İstek → Logger Middleware → express.json() → Router (/tasks) → Controller → Veri Katmanı (tasks.json)
                                                                    ↓
                                                               JSON Yanıt
```

- **Routes** — hangi URL'nin hangi fonksiyona gideceğini belirler.
- **Controllers** — iş mantığını (ekleme, listeleme, güncelleme, silme) içerir.
- **Data (taskStore)** — JSON dosyasına okuma/yazma yapar.
- **Middleware** — `logger` her isteği loglar; `errorHandler` 404 ve beklenmeyen hataları yakalar.

### Temel Middleware — Logger

Her API isteğinin method, endpoint, durum kodu, süre ve zaman damgası hem konsola hem `logs/requests.log` dosyasına yazılır:

```
[2026-11-07T10:00:00.000Z] GET /tasks 200 - 2ms
```

### HTTP Durum Kodları

| Kod | Anlamı |
|-----|--------|
| 200 | İşlem başarılı |
| 201 | Görev oluşturuldu |
| 400 | Eksik/hatalı veri (ör. title gönderilmedi) |
| 404 | Görev veya endpoint bulunamadı |
| 500 | Sunucu hatası |
