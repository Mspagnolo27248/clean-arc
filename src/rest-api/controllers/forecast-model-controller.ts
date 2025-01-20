
import { NextFunction, Request, Response } from "express";
import { ForecastModelInputs, RollingForecastInputParams } from "../../core-layer/financial-forecast-module/data-transfer-objects/dto";
import { CalcualteInventoryRollforwardUseCase } from "../../core-layer/financial-forecast-module/use-cases/CalculateInventoryRollforwardUseCase";
import { container } from "../../dependancy-registar/wire-di";



export class ForecastModelController {

 static async saveModel(req: Request, res: Response){   
    const id = req.params.id
    const uuid = id ? id : `${Date.now()}`;
    const payload = req.body as RollingForecastInputParams;
    payload.ModelMetaData.uid = uuid;
    try{
        const saveForecastModelUseCase = container.resolve("SaveForecastModelUseCase");
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
        const openExistingModelUseCase = container.resolve("OpenExistingModelUseCase");
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


 static async getModelNames(req: Request, res: Response){
   const  repo = container.resolve("ForecastModelRepository")
   
   const models =  repo.getListOfModels();
   const results = models.map(item=>item.split('.')[0])

   try{

return res.status(200).json(results) 
}
catch(error){
    return res.status(500).json({ message: "Error" });
}
 }


}