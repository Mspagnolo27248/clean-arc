import  { Router, Request, Response, NextFunction } from "express";
import { ForecastModelController } from "../controllers/forecast-model-controller";





const forecastModelRoutes = Router();

forecastModelRoutes.post("/save/:id?",ForecastModelController.saveModel);

forecastModelRoutes.post("/load/:id",ForecastModelController.loadModel); 

forecastModelRoutes.post("/run",ForecastModelController.runModel); 


export default forecastModelRoutes;