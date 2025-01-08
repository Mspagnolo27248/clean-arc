
import { ModelOutputParams, Model, RollingForecastInputParams } from "../data-transfer-objects/dto";
import { ForecastModelOutputParams, ForecastModelService } from "../helper-functions/ForecastModelService";
import { RollingForecastService } from "../helper-functions/RollingForecastService";
import { ForecastModelInputs } from "../tests/RunNestedModelTest";





export class CalcualteInventoryRollforwardUseCase {
    constructor(){ 
    }

    execute(params:ForecastModelInputs):ForecastModelOutputParams{
        try{
            const model = new ForecastModelService(params);
            model.run()
            return model.output()
        } catch(error){        
            throw new Error("Error Generating model")
        }
   
        
    }

}


// export class CalcualteInventoryRollforwardUseCase {
//     constructor(){ 
//     }

//     execute(params:RollingForecastInputParams):ModelOutputParams{
//         try{
//             const model = new RollingForecastService(params);
//             return model.outputModel();
//         } catch(error){        
//             throw new Error("Error Generating model")
//         }
   
        
//     }

// }