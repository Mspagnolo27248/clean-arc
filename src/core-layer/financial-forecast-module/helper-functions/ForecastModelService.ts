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
  private RollForwardOutput:RollForwardOutput= {};

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
        if(!formulations[product]) continue;

        for (const day in demand[product]) {  
          const demandQty = demand[product][day];

          formulations[product].forEach((component) => {
            const {ComponentCode,FormulaPercent} = component;
            
            if (!ComponentDateReq[ComponentCode]) {
              ComponentDateReq[ComponentCode]={}
            }
            ComponentDateReq[ComponentCode][day] =
            ((ComponentDateReq[ComponentCode][day]||0) +
            (FormulaPercent * demandQty));
          });
        }
      }
    }
    addComponentReqs(dailyDemand);
    addComponentReqs(openOrders);
    return ComponentDateReq as ProductDateKeys;
  }

  private calculateEndingInventory(
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
    const outputs:RollForwardOutput = {};  
    const {ProductsForModelItem,Receipts,DailyDemandForecast,DailyOpenOrders} = this.ForecastModelInputs;
   
    ProductsForModelItem.forEach((product) => {
      const {ProductCode,CurrentInventoryGals}  = product;
      const outputByDay: { [date: string]: OutputItems[] } = {};
      let previousEndInventory: number | null = null;

      this.runDates.forEach((date) => {
        const openInventory =previousEndInventory ?? CurrentInventoryGals ?? 0;
        const receipt = Receipts[`${ProductCode}`]?.[`${date}`] || 0;
        const productionIn = this.productionIn[`${ProductCode}`]?.[`${date}`] || 0;
        const productionOut = this.productionOut[`${ProductCode}`]?.[`${date}`] || 0;
        const demandForecast =  DailyDemandForecast[`${ProductCode}`]?.[`${date}`] || 0;
        const openOrders = DailyOpenOrders[`${ProductCode}`]?.[`${date}`] || 0;
        const blendRequirements =this.blendRequirements[`${ProductCode}`]?.[`${date}`] || 0;
       
        const endingInventory = this.calculateEndingInventory(
          openInventory,receipt,productionIn,productionOut,demandForecast,openOrders,blendRequirements          
        );
        outputByDay[date] = outputByDay[date] || [];
        outputByDay[date].push({
          OpenInventory: openInventory,
          Receipts: receipt,
          ProductionIn: productionIn,
          ProductionOut: productionOut,
          OpenOrders: openOrders,
          DemandForecast: demandForecast,
          BlendRequirements: blendRequirements,
          EndingInventory: endingInventory,
        });

        // Update previousEndInventory for the next day
        previousEndInventory = endingInventory;
      });
      outputs[ProductCode] = outputByDay;
    });
    this.RollForwardOutput = outputs
  }

output():ForecastModelOutputParams{
  return{
    ...this.ForecastModelInputs,
    Outputs:this.RollForwardOutput
  }
}

  private generateDateRange(startDate: number, runDays: number): number[] {
    return DateUtils.createDateRangeFromIntegerDate(startDate, runDays);
  }
}

type RollForwardOutput = {[Product:string]:{[Date: string]: OutputItems[]}} 
type ForecastModelOutputParams = ForecastModelInputs & {Outputs:RollForwardOutput}