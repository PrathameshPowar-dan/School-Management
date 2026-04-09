import 'dotenv/config';
import express from 'express';
import schoolRoutes from './routes/schoolRoutes.js';

const app = express();

app.use(express.json());

// Routes
app.use('/', schoolRoutes);

// Health Check Endpoint
app.use("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});