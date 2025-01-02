import { ModelOutputParams } from "../data-transfer-objects/dto";
import { FileService } from "../services/fileService";
import { ForecastModelRepository } from "./ForecastModelRespository";

export  class ForecastModelRepositoryImp extends ForecastModelRepository {
  

    constructor(basePath: string) {
        super(basePath);
    }

     saveModel(fileName: string, modelJson: ModelOutputParams){
         FileService.writeJSON(`${this.basePath}/${fileName}`,modelJson)

     };
     importModel(fileName: string): ModelOutputParams{
        return FileService.readJSON(`${this.basePath}/${fileName}`)
     };
}


