import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {barCodeRouter} from './routes';
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(barCodeRouter)
export default app;
