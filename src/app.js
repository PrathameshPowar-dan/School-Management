import 'dotenv/config';
import express from 'express';
import schoolRoutes from './routes/schoolRoutes.js';

const app = express();

app.use(express.json());

// Routes
app.use('/', schoolRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});