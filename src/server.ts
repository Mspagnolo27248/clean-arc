// src/index.js
import express from "express";
import  dotenv from "dotenv";
import cors from 'cors';
import { swaggerSpec } from './swaggerConfig'
import swaggerUi from 'swagger-ui-express';
import router from "./rest-api/routes/router";
import { registerDependencies } from "./dependancy-registar/wire-di";



dotenv.config();
const app= express();

registerDependencies();
const port = process.env.PORT || 8001;
app.use(cors());
app.use('/api-docs', //http://localhost:8001/api-docs/
swaggerUi.serve, swaggerUi.setup(swaggerSpec,{explorer:true}));
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Middleware to parse JSON request bodies globally

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use('/', router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});