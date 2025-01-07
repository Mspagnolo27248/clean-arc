import { ProductsForModelItem, ScheduleItem, UnitYieldItem } from "../data-transfer-objects/dto";
import { ModelMetaData } from "../data-transfer-objects/dto";
import { ForecastModelService } from "../helper-functions/ForecastModelService";
import { FileService } from "../services/fileService";

export interface ProductDateKeys {
    [ProductCode:string]:{
        [Date:string]:
        number;
    };
};

export interface UnitProductDateKeys {
    [Unit:string]:{
         [ProductCode:string]:{
            [Date:string]:number
         }
        }
    };

export type UnitYieldObject = {
    [Unit: string]: {
    [Charge_ProductCode: string]:{Output_ProductCode: string,OutputPercent: number}[];     
    }
    };

export type ProductFormulationsObject = {
    [ProductCode: string]: { ComponentCode: string, FormulaPercent: number }[];
    };

export interface ForecastModelInputs {
    ModelMetaData: ModelMetaData;
    ProductsForModelItem: ProductsForModelItem[],
    Receipts:ProductDateKeys,
    DailyOpenOrders:ProductDateKeys,
    DailyDemandForecast:ProductDateKeys,
    ProductFormulation:ProductFormulationsObject,
    ScheduleItem:UnitProductDateKeys,
    UnitYieldItem:UnitYieldObject;
}

const inputs:ForecastModelInputs = FileService.readJSON('./data/json/nested/model1v2.json');



const model = new ForecastModelService(inputs);

model.run()
const output = model.output();
FileService.writeJSON('./data/json/nested/output.json',output)
console.log(output)