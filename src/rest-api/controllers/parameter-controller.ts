
import { NextFunction, Request, Response } from "express";
import { OutputService } from "../../core-layer/financial-forecast-module/services/outputService";
import { InputService } from "../../core-layer/financial-forecast-module/services/inputService";
import { FileService } from "../../core-layer/financial-forecast-module/services/fileService";


export class ParameterController {

 static async saveJson(req: Request, res: Response){
    const payload = req.body;
    try{
        await OutputService.saveOutput('./data/json/test',payload)
    }
    catch(error){
        return res.status(500).json({ message: "Error" });
    }
    
    return res.status(400).json({ message: "success" });
 }


 static async loadJson(req: Request, res: Response){

    try{
         const data = await  FileService.readJSON('./data/json/test')
        return res.status(400).json(data);
    }
    catch(error){
        return res.status(500).json({ message: "Error" });
    }
    
   
 }



}