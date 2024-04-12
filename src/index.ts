import express, { json } from "express";
import { globalErrorHandler } from "./middlewares/handlers/GlobalErrorHandler";
import testRouter from "./api/TestRouter";

console.log('ENV:' + process.env.NODE_ENV);

const app = express();
const port = process.env.PORT || 3000;

// JSON Parser Middleware
app.use(json());

// Routers Middleware
app.use('/test', testRouter);

// Error Hadler Middleware
app.use(globalErrorHandler);

app.listen(port, () => {
    console.log('Server listening on port: ' + port);
})