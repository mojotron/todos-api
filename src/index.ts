import express from 'express';
import 'dotenv/config';
import connectDB from './config/connect';
import routes from './routes/index';
import { notFound, errorHandler } from './middlewares/errorMiddlewares';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:8000',
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type'],
  }),
);
app.use(cookieParser());

app.use(routes);
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`server running at port ${PORT}`));
  } catch (error) {
    if (error instanceof Error && process.env.NODE_ENV === 'development') {
      console.log(error.stack);
    } else {
      console.log(error);
      process.exit(1);
    }
  }
};

startServer();
