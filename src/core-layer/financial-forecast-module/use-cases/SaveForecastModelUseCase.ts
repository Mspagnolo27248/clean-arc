import { ForecastModelRepository } from "../data-access-repository/ForecastModelRespository";
import { Model, ModelOutputParams, RollingForecastInputParams } from "../data-transfer-objects/dto";





export class SaveForecastModelUseCase {
  private dataAccessRepo;

    constructor(dataAccessRepo:ForecastModelRepository){
        this.dataAccessRepo = dataAccessRepo;
    }

    execute(filePath:string,model:RollingForecastInputParams){
        this.dataAccessRepo.saveModel(filePath,model);          
    }

}