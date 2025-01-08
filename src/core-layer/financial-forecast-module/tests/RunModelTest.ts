// import { RollingForecastInputParams } from "../data-transfer-objects/dto";
// import { FileService } from "../services/fileService";
// import { CalcualteInventoryRollforwardUseCase } from "../use-cases/CalculateInventoryRollforwardUseCase";

 
// //Load Prior Model from filesystem
// const oldmodel:RollingForecastInputParams = FileService.readJSON('./data/json/run-test-inputs.json');

// //Remove any un-needed inputs from old model
// const inputs:RollingForecastInputParams= {
// ModelMetaData:oldmodel.ModelMetaData,
// ProductsForModelItem: oldmodel.ProductsForModelItem,
// Receipts: oldmodel.Receipts,
// DailyOpenOrders: oldmodel.DailyOpenOrders,
// DailyDemandForecast: oldmodel.DailyDemandForecast,
// ProductFormulation: oldmodel.ProductFormulation,
// ScheduleItem: oldmodel.ScheduleItem,
// UnitYieldItem: oldmodel.UnitYieldItem
// }




//  function test(inputs: RollingForecastInputParams) {
//    try {
//      const engine = new CalcualteInventoryRollforwardUseCase();
//      const outputs = engine.execute(inputs);
//      return outputs;
//    } catch (error) {
//      return console.error(error);
//    }
//  }


//  const output = test(inputs);
//  FileService.writeJSON('./data/json/outputs/run-test-inputs.json',output)
//  console.log(output);
