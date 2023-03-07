import app from './src/app/app.js';

const PORT = process.env.API_PORT || 8080;

app.listen(PORT);