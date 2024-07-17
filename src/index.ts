import express from 'express';
import 'dotenv/config';
import connectDB from './config/connect';

const PORT = process.env.PORT;
const app = express();

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
