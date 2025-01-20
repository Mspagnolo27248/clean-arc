import {RollingForecastInputParams } from "../data-transfer-objects/dto";

export abstract class ForecastModelRepository {
     protected basePath: string;
 
     constructor(basePath: string) {
         this.basePath = basePath;
     }
 
     abstract saveModel(fileName: string, modelJson: RollingForecastInputParams): void;
     abstract importModel(fileName: string): RollingForecastInputParams;
     abstract getListOfModels():any[]
 }


 
 