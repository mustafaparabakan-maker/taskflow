// Tanımlı olmayan bir endpoint'e gelen istekler için
function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Endpoint bulunamadı: ${req.method} ${req.originalUrl}`
  });
}

// Beklenmeyen hataları yakalar (ör. bozuk JSON gövdesi)
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Geçersiz JSON formatı' });
  }

  console.error(err);
  res.status(500).json({ success: false, message: 'Sunucu hatası' });
}

module.exports = { notFound, errorHandler };
