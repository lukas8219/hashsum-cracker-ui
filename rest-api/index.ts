import app from './src/app/app.js';
import server from './websocket/websocket.js';

const PORT = process.env.API_PORT || 8005;

const resultApp = app.listen(PORT);
server(resultApp);