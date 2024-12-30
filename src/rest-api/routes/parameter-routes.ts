import  { Router, Request, Response, NextFunction } from "express";
import { ParameterController } from "../controllers/parameter-controller";




const parameterRoutes = Router();

parameterRoutes.post("/json/save",ParameterController.saveJson);

parameterRoutes.post("/json/load",ParameterController.loadJson); 


export default parameterRoutes;