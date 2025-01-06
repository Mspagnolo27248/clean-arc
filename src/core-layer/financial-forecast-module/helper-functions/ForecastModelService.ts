import {
  DailyProductionOutput,
  OutputItems,
  ProductDateDict,
  ProductionData,
} from "../data-transfer-objects/dto";

import {
  ForecastModelInputs,
  ProductDateKeys,
  ProductFormulationsObject,
  UnitProductDateKeys,
  UnitYieldObject,
} from "../tests/RunNestedModelTest";

import { DateUtils } from "./helper-functions";

export class ForecastModelService {
  private ForecastModelInputs:ForecastModelInputs;
  private runDates: number[];
  private productionIn: ProductionData;
  private productionOut: ProductionData;
  private blendRequirements: ProductDateKeys;
  private report:OutputItems= {};

  constructor(params: ForecastModelInputs) {
    this.ForecastModelInputs = params;
    this.runDates = this.generateDateRange(
      params.ModelMetaData.startDate,
      params.ModelMetaData.runDays
    );

    const production = this.generateProductionValues(
      params.ScheduleItem,
      params.UnitYieldItem
    );
    this.productionIn = production.productionIn;
    this.productionOut = production.productionOut;

    this.blendRequirements = this.generateBlendRequirements(
      params.ProductFormulation,
      params.DailyDemandForecast,
      params.DailyOpenOrders
    );
  }


  generateProductionValues(   
    schedule: UnitProductDateKeys,
    unitYields: UnitYieldObject
  ): DailyProductionOutput {
    const BBL_PER_GAL = 42;
    const productionIn: ProductionData = {};
    const productionOut: ProductionData = {};

    for (const unit in schedule) {
      for (const charge in schedule[unit]) {
        for (const day in schedule[unit][charge]) {
          const chargeQty = schedule[unit][charge][day];

          //Production Out
          if (!productionOut[charge]) {
            productionOut[charge] = {}
          }
          productionOut[charge][day] = 
          (productionOut[charge][day] || 0) + chargeQty * BBL_PER_GAL;
         

          //Production In
          const outputProducts = unitYields[unit][charge];        
          outputProducts.forEach(
            (component) => {
              const outputProductCode = component.Output_ProductCode;
              const outputQty = component.OutputPercent * chargeQty * BBL_PER_GAL;
              if (!productionIn[outputProductCode]) {
                productionIn[outputProductCode] = { }
              }
              productionIn[outputProductCode][day] = outputQty;
            });
        }
      }
    }

    return { productionIn, productionOut };
  }

  generateBlendRequirements(
    formulations: ProductFormulationsObject,
    dailyDemand: ProductDateKeys,
    openOrders: ProductDateKeys
  ): ProductDateKeys {
    const ComponentDateReq: ProductDateKeys = {};

    function addComponentReqs(demand: ProductDateKeys) {
      for (const product in demand) {
        for (const day in demand[product]) {
          formulations[product].forEach((component) => {
            if (!ComponentDateReq[component.ComponentCode][day]) {
              ComponentDateReq[component.ComponentCode][day] = 0;
            }
            ComponentDateReq[component.ComponentCode][day] +=
              component.FormulaPercent * demand[product][day];
          });
        }
      }
    }
    addComponentReqs(dailyDemand);
    addComponentReqs(openOrders);
    return ComponentDateReq as ProductDateKeys;
  }

  calculateEndingInventory(
    openInventory: number,
    receipts: number,
    productionIn: number,
    demandForecast: number,
    openOrders: number,
    blendRequirements: number,
    productionOut: number
  ): number {
    return (
      openInventory +
      receipts +
      productionIn -
      demandForecast -
      openOrders -
      blendRequirements -
      productionOut
    );
  }

  run(): void {
    const outputs:OutputItems = {};  
    const products = this.ForecastModelInputs.ProductsForModelItem;
    const receiptsDict = this.ForecastModelInputs.Receipts;
    products.forEach((product) => {
      const productData: { [Date: string]: OutputItems[] } = {};
      let previousEndInventory: number | null = null;
      this.runDates.forEach((date) => {
        const openInventory =previousEndInventory ?? product?.CurrentInventoryGals ?? 0;
        const receipts = receiptsDict[`${productCode}`]?[`${date}`] || 0;
        const productionIn = this.ProductionIn[`${productCode}`]?.[`${date}`] || 0;
        const productionOut = this.ProductionOut[`${productCode}`]?.[`${date}`] || 0;
        const demandForecast =  this.DailyDemandForecast.get(`${productCode}|${date}`)?.Gals || 0;
        const openOrders = this.DailyOpenOrders.get(`${productCode}|${date}`)?.Gals || 0;
        const blendRequirements =this.BlendRequirements[`${productCode}`]?.[`${date}`] || 0;
        const endingInventory = this.calculateEndingInventory(
          openInventory,receipts,productionIn,productionOut,demandForecast,openOrders,blendRequirements          
        );
      })
 

    this.report = outputs
  }}

// output():ForecastModelOutputParams{
//   return{
//     ...this.ForecastModelInputs,
//     ...
//   }
// }

  private generateDateRange(startDate: number, runDays: number): number[] {
    return DateUtils.createDateRangeFromIntegerDate(startDate, runDays);
  }
}

type OutputItems = {[Product:string]:{[Date: string]: OutputItems[]}} 
type ForecastModelOutputParams = ForecastModelInputs & OutputItems