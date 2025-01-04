import { RollingForecastInputParams } from "../data-transfer-objects/dto";
import { producstToRun } from "../data/ProductsToRun";
import { FileService } from "../services/fileService";
import { CalcualteInventoryRollforwardUseCase } from "../use-cases/CalculateInventoryRollforwardUseCase";

const ModelMetaData = {
    "startDate": 20240112,
    "runDays": 31,
    "uid": "1735779044552",
    "id_description": "test-model2"
  }

 

const oldmodel:RollingForecastInputParams = FileService.readJSON('./data/json/model1.json');
const products = producstToRun.map(item=>({...item,ProductCode:String(item.ProductCode)}))

const inputs:RollingForecastInputParams = {
ModelMetaData:ModelMetaData,
ProductsForModelItem: products,
Receipts: oldmodel.Receipts,
DailyOpenOrders: oldmodel.DailyOpenOrders,
DailyDemandForecast: oldmodel.DailyDemandForecast,
DailyBlendRequirements: oldmodel.DailyBlendRequirements,
ScheduleItem: oldmodel.ScheduleItem,
UnitYieldItem: oldmodel.UnitYieldItem
}
FileService.writeJSON('./data/json/run-test-inputs.json',inputs)


 function test(inputs:RollingForecastInputParams){ 
try{
    const engine = new CalcualteInventoryRollforwardUseCase();
        const outputs = engine.execute(inputs);
   return outputs;  
    }
    catch(error){
        return console.error(error)
    }

 }


 const output = test(inputs);
 console.log(output);
