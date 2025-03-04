export interface ModelMetaData {
  startDate: number;
  runDays: number;
  uid: string;
  id_description: string;
}

export interface ProductsForModelItem {
  ProductCode: string;
  ProductDescription: string;
  TankCapacityGals: number;
  CurrentInventoryGals: number;
}

export interface ScheduleItem {
  Unit: string;
  Charge_ProductCode: string;
  Date: number;
  bbls: number;
}

export interface UnitYieldItem {
  Unit: string;
  Charge_ProductCode: string;
  Output_ProductCode: string;
  OutputPercent: number;
}

export interface UnitProductionOutItem {
  Unit: string;
  Charge_ProductCode: string;
  Output_ProductCode: string;
  Date: number;
  Output_Gals: number;
}

export interface ReceiptsItem {
  ProductCode: string;
  Date: number;
  Gals: number;
}

export interface DailyDemandForecastItem {
  ProductCode: string;
  Date: number;
  Gals: number;
}

export interface MonthlyDemandForecastItem {
  ProductCode: string;
  YYYYMM: number;
  Gals: number;
}

export interface DailyOpenOrderItem {
  ProductCode: string;
  Date: number;
  Gals: number;
}

export interface DailyBlendRequirementsItem 
  {[Product:string]:{[Date:string]:number}}


export interface ProductFormulationItem {
  Finished_ProductCode: string;
  Component_ProductCode: string;
  FormulaPercent: number;
}

export interface RollingForecastInputParams {
  ModelMetaData: ModelMetaData;
  ProductsForModelItem: ProductsForModelItem[];
  Receipts: ReceiptsItem[];
  DailyOpenOrders: DailyOpenOrderItem[];
  DailyDemandForecast: DailyDemandForecastItem[];
  ProductFormulation:ProductFormulationItem[];
  ScheduleItem:ScheduleItem[];
  UnitYieldItem:UnitYieldItem[];
}


export interface ProductionData {
  [Product: string]: {
    [Date: string]: number;
  };
}

export interface DailyProductionOutput {
  productionIn: ProductionData;
  productionOut: ProductionData;
}

export interface ProductDateDict{  
    [Product: string]: { 
      [Date: number]: OutputItems[] } 
}
export interface Model {
  Output: ProductDateDict
}
export type ModelOutputParams  =  RollingForecastInputParams & Model;


export interface OutputItems{
  OpenInventory:number;
  Receipts:number;
  ProductionIn:number;
  ProductionOut:number;
  OpenOrders:number;
  DemandForecast:number;
  BlendRequirements:number;
  EndingInventory:number;
}



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
