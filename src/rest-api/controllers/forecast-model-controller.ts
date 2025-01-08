
import { NextFunction, Request, Response } from "express";
import { SaveForecastModelUseCase } from "../../core-layer/financial-forecast-module/use-cases/SaveForecastModelUseCase";
import { ForecastModelRepositoryImp } from "../../core-layer/financial-forecast-module/data-access-repository/ForecastModelRepositoryImp";
import { OpenExistingModelUseCase } from "../../core-layer/financial-forecast-module/use-cases/OpenExistingModelUseCase";
import { RollingForecastInputParams } from "../../core-layer/financial-forecast-module/data-transfer-objects/dto";
import { CalcualteInventoryRollforwardUseCase } from "../../core-layer/financial-forecast-module/use-cases/CalculateInventoryRollforwardUseCase";
import { ForecastModelInputs } from "../../core-layer/financial-forecast-module/tests/RunNestedModelTest";



export class ForecastModelController {

 static async saveModel(req: Request, res: Response){   
    const id = req.params.id
    const uuid = id ? id : `${Date.now()}`;
    const payload = req.body as RollingForecastInputParams;
    payload.ModelMetaData.uid = uuid;
    try{
        const ForecastModelRepository = new ForecastModelRepositoryImp('./data/json');
        const saveForecastModelUseCase = new SaveForecastModelUseCase(ForecastModelRepository);
        if (!payload || typeof payload !== 'object') {
            throw new Error('Error with payload and query params')    
        } 
        saveForecastModelUseCase.execute(`${uuid}.json`,payload)
        return res.status(200).json({ message: "success",id:uuid });
    }
    catch(error){
        return res.status(500).json({ message: "Error" });
    }   
   
 }


 static async loadModel(req: Request, res: Response){
    const filePath = req.params.id;
    try{
        const ForecastModelRepository = new ForecastModelRepositoryImp('./data/json');
        const openExistingModelUseCase = new OpenExistingModelUseCase(ForecastModelRepository);
        if (!filePath || typeof filePath !== 'string') {
            throw new Error('Error with query params')
          
        } 
        const model = openExistingModelUseCase.execute(`${filePath}.json`)
        if(!model) throw new Error(`No Model exists for  ${filePath}`)
        return res.status(200).json(model);          
         
    }
    catch(error){
        return res.status(500).json({ message: "Error" });
    }  
   
 }

 static async runModel(req: Request, res: Response){
    const model = req.body as ForecastModelInputs;
  

    try{
        const engine = new CalcualteInventoryRollforwardUseCase();
        const outputs = engine.execute(model);
   return res.status(200).json(outputs);  
    }
    catch(error){
        return res.status(500).json({ message: "Error" });
    }

 }



}