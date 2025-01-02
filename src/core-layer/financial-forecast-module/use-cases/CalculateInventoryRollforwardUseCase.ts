
import { ModelOutputParams, Model, RollingForecastInputParams } from "../data-transfer-objects/dto";
import { RollingForecastService } from "../helper-functions/RollingForecastService";





export class CalcualteInventoryRollforwardUseCase {
    constructor(){ 
    }

    execute(params:RollingForecastInputParams):ModelOutputParams{
        try{
            const model = new RollingForecastService(params);
            return model.outputModel();
        } catch(error){        
            throw new Error("Error Generating model")
        }
   
        
    }

}