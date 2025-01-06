import { ProductFormulationItem, RollingForecastInputParams, UnitYieldItem } from "../data-transfer-objects/dto";
import { FileService } from "../services/fileService";
import { createNestedObject } from "./helper-functions";




const oldmodel:RollingForecastInputParams = FileService.readJSON('./data/json/run-test-inputs.json');




interface ProductDateKeys {
    [ProductCode:string]:{
        [Date:string]:number;
    };
};

interface UnitProductDateKeys {
    [Unit:string]:{
         [ProductCode:string]:{
            [Date:string]:number
         }
        }
    };

const Receipts:ProductDateKeys = createNestedObject(oldmodel.Receipts,["ProductCode","Date"],"Gals");
const DailyOpenOrders:ProductDateKeys = createNestedObject(oldmodel.DailyOpenOrders,["ProductCode","Date"],"Gals");
const DailyDemandForecast:ProductDateKeys =  createNestedObject(oldmodel.DailyDemandForecast,["ProductCode","Date"],"Gals");
const ScheduleItem:UnitProductDateKeys = createNestedObject(oldmodel.ScheduleItem,["Unit","Charge_ProductCode","Date"],"bbls");
const ProductFormulation = convertFormulationsToObject(oldmodel.ProductFormulation);
const UnitYieldItem = convertUnitYieldToObject(oldmodel.UnitYieldItem);
const modelAsObjects = {
    ModelMetaData:  oldmodel.ModelMetaData,
    ProductsForModelItem: oldmodel.ProductsForModelItem,
    Receipts:Receipts,
    DailyOpenOrders:DailyOpenOrders,
    DailyDemandForecast:DailyDemandForecast,
    ProductFormulation:ProductFormulation,
    ScheduleItem:ScheduleItem,
    UnitYieldItem:UnitYieldItem
}

FileService.writeJSON('./nestedObjecyModel',modelAsObjects)



type ProductFormulationsObject = {
    [ProductCode: string]: { ComponentCode: string, FormulaPercent: number }[];
  };

function convertFormulationsToObject(formulations: ProductFormulationItem[]): ProductFormulationsObject {
    const formulationsObject = {} as ProductFormulationsObject;
  
    formulations.forEach((formulation) => {
      const { Finished_ProductCode, Component_ProductCode, FormulaPercent } = formulation;
  
      // If the Finished_ProductCode doesn't exist in the object, initialize it with an empty array
      if (!formulationsObject[Finished_ProductCode]) {
        formulationsObject[Finished_ProductCode] = [];
      }
  
      // Push the current component into the corresponding Finished_ProductCode
      formulationsObject[Finished_ProductCode].push({
        ComponentCode: Component_ProductCode,
        FormulaPercent: FormulaPercent,
      });
    });
  
    return formulationsObject;
  }



  type UnitYieldObject = {
    [Unit: string]: {
    [Charge_ProductCode: string]:{Output_ProductCode: string,OutputPercent: number}[];     
    }
  };


  function convertUnitYieldToObject(unitYieldItems: UnitYieldItem[]): UnitYieldObject {
    const yieldObject:UnitYieldObject = {};
  
    unitYieldItems.forEach(item => {
      const { Unit,Charge_ProductCode, Output_ProductCode, OutputPercent } = item;  
  
      if (!yieldObject[Unit]) {
        yieldObject[Unit] = {}     
        };

        if (!yieldObject[Unit][Charge_ProductCode]) {
            yieldObject[Unit][Charge_ProductCode] = []     
            };   
  

      yieldObject[Unit][Charge_ProductCode].push({Output_ProductCode,OutputPercent});

    });
  
    return yieldObject;
  }
  