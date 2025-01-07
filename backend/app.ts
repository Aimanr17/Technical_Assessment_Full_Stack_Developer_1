import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import itemRoute from "./routes/item.route";

const app: Express = express();
const port = process.env.PORT || 3001;

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  next();
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(itemRoute)


app.listen(port, () => {
  console.log(`Surfing on port`, port);
});

export default app;