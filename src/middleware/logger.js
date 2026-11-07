const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'requests.log');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Logger Middleware
 * Her API isteğinin method, endpoint, durum kodu, süre ve zaman damgasını
 * hem konsola hem de logs/requests.log dosyasına yazar.
 */
function logger(req, res, next) {
  const start = Date.now();

  // Yanıt gönderildiğinde durum kodu ve süre de bilinir
  res.on('finish', () => {
    const timestamp = new Date().toISOString();
    const duration = Date.now() - start;
    const line = `[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    console.log(line);
    fs.appendFile(LOG_FILE, line + '\n', (err) => {
      if (err) console.error('Log dosyasına yazılamadı:', err.message);
    });
  });

  next();
}

module.exports = logger;
