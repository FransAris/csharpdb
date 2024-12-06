// Add these headers to allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');  // In production, replace * with your frontend domain
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
}); 