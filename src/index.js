import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fetchNumbers } from './services/numberService.js';
import { NumberStore } from './utils/numberStore.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT) || 9876;
const WINDOW_SIZE = 10;

if (!process.env.ACCESS_TOKEN) {
  console.error('ERROR: ACCESS_TOKEN not configured in .env file');
  process.exit(1);
}

const numberStore = new NumberStore(WINDOW_SIZE);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  const validTypes = ['p', 'f', 'e', 'r'];

  if (!validTypes.includes(numberid)) {
    return res.status(400).json({ error: 'Invalid number type. Use p, f, e, or r.' });
  }

  try {
    const windowPrevState = [...numberStore.getNumbers()];
    const numbers = await fetchNumbers(numberid);
    numbers.forEach(num => numberStore.addNumber(num));
    const currentNumbers = numberStore.getNumbers();
    const avg = currentNumbers.length > 0 
      ? (currentNumbers.reduce((sum, num) => sum + num, 0) / currentNumbers.length).toFixed(2)
      : 0;

    res.json({
      windowPrevState,
      windowCurrState: currentNumbers,
      numbers,
      avg: parseFloat(avg)
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

const startServer = (port) => {
  try {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}`);
        startServer(port + 1);
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer(PORT);