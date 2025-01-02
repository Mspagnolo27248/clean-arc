import { ForecastModelRepository } from "../data-access-repository/ForecastModelRespository";





export class OpenExistingModelUseCase {
  private dataAccessRepo;

    constructor(dataAccessRepo:ForecastModelRepository){
        this.dataAccessRepo = dataAccessRepo;
    }

    execute(filePath:string){
        return this.dataAccessRepo.importModel(filePath);          
    }

}