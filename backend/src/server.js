const app = require('./app');

const PORT = 8888;

app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
