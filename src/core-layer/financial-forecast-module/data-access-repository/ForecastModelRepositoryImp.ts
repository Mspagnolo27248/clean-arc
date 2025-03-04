import { getFilenames } from "../../../shared-common/services/helper-functions/file-system-access";
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

     getListOfModels(): any[] {
         let models = [];
         models = getFilenames(this.basePath)

        return models
     }
}


