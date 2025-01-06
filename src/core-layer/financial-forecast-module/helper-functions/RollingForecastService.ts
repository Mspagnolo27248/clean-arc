import {
  DailyBlendRequirementsItem,
  DailyDemandForecastItem,
  DailyOpenOrderItem,
  DailyProductionOutput,
  ModelOutputParams,
  OutputItems,
  ProductDateDict,
  ProductFormulationItem,
  ProductionData,
  ProductsForModelItem,
  ReceiptsItem,
  RollingForecastInputParams,
  ScheduleItem,
  UnitYieldItem,
} from "../data-transfer-objects/dto";
import { createMap, DateUtils } from "./helper-functions";

export class RollingForecastService {
  RollingForecastInputParams: RollingForecastInputParams;
  ProductsForModelItem: Map<string, ProductsForModelItem>;
  Receipts: Map<string, ReceiptsItem>;
  DailyOpenOrders: Map<string, DailyOpenOrderItem>;
  DailyDemandForecast: Map<string, DailyDemandForecastItem>;
  BlendRequirements: DailyBlendRequirementsItem;
  RunDates: number[];
  ProductionIn: ProductionData;
  ProductionOut: ProductionData;

  constructor(params: RollingForecastInputParams) {
    this.RollingForecastInputParams = params;
    const production = this.generateDailyProduction(params.ScheduleItem,params.UnitYieldItem);
    this.ProductionIn = production.productionIn;
    this.ProductionOut = production.productionOut;
    this.ProductsForModelItem =  createMap(params.ProductsForModelItem, ["ProductCode"]);  
    this.Receipts = createMap(params.Receipts, ["ProductCode", "Date"])
    this.DailyOpenOrders = createMap(params.DailyOpenOrders,["ProductCode","Date"]);
    this.DailyDemandForecast = createMap(params.DailyDemandForecast,["ProductCode","Date"])
    this.BlendRequirements = this.calculateDailyBlendRequirements(
      params.ProductFormulation, 
      params.DailyDemandForecast, 
      params.DailyOpenOrders);
    this.RunDates = this.generateDateRange(
      this.RollingForecastInputParams.ModelMetaData.startDate,
      this.RollingForecastInputParams.ModelMetaData.runDays
    );
  }

  calculateEndingInventory(
    openInventory:number,
    receipts:number ,
    productionIn:number ,
    demandForecast:number ,
    openOrders:number ,
    blendRequirements:number ,
    productionOut:number
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

  outputModel(): ModelOutputParams {
    const result = {} as ProductDateDict;

    this.ProductsForModelItem.forEach((product, productCode) => {
      const productData: { [Date: string]: OutputItems[] } = {};
      let previousEndInventory: number | null = null;

      this.RunDates.forEach((date) => {
        const openInventory =previousEndInventory ?? this.ProductsForModelItem.get(productCode)?.CurrentInventoryGals ?? 0;
        const receipts = this.Receipts.get(`${productCode}|${date}`)?.Gals || 0;
        const productionIn = this.ProductionIn[`${productCode}`]?.[`${date}`] || 0;
        const productionOut = this.ProductionOut[`${productCode}`]?.[`${date}`] || 0;
        const demandForecast =  this.DailyDemandForecast.get(`${productCode}|${date}`)?.Gals || 0;
        const openOrders = this.DailyOpenOrders.get(`${productCode}|${date}`)?.Gals || 0;
        const blendRequirements =this.BlendRequirements[`${productCode}`]?.[`${date}`] || 0;
        const endingInventory = this.calculateEndingInventory(
          openInventory,receipts,productionIn,productionOut,demandForecast,openOrders,blendRequirements          
        );
        productData[date] = [
          {
            OpenInventory: openInventory,
            Receipts: receipts,
            ProductionIn: productionIn,
            ProductionOut: productionOut,
            OpenOrders: openOrders,
            DemandForecast: demandForecast,
            BlendRequirements: blendRequirements,
            EndingInventory: endingInventory,
          },
        ];

        previousEndInventory = endingInventory;
      });

      result[productCode] = productData;
    });

    return {
      ...this.RollingForecastInputParams,
      Output: result,
    } as ModelOutputParams;
  }


  private generateDateRange(startDate: number, runDays: number): number[] {
    return DateUtils.createDateRangeFromIntegerDate(startDate, runDays);
  }







  private calculateDailyBlendRequirements(
    formulations: ProductFormulationItem[],
    openorder: DailyDemandForecastItem[],
    dailyForecast: DailyDemandForecastItem[]
  ):Record<string, Record<string, number>> {
    const productBlendVolumes= {} as Record<string, Record<string, number>>;

    const updateProductBlendVolumes = (item: DailyDemandForecastItem) => {
      let formulas = formulations.filter(
        (record) => record.Finished_ProductCode === item.ProductCode
      );
      formulas.forEach((component) => {
        const componentCode = component.Component_ProductCode;
        const date = `${item.Date}`;

        if (!productBlendVolumes[componentCode]) {
          productBlendVolumes[componentCode] = {};
        }
        if (!productBlendVolumes[componentCode][date]) {
          productBlendVolumes[componentCode][date] = 0;
        }
        productBlendVolumes[componentCode][date] += component.FormulaPercent * item.Gals;
      });
    };
    openorder.forEach((item) => updateProductBlendVolumes(item));
    dailyForecast.forEach((item) => updateProductBlendVolumes(item));
    return productBlendVolumes;
  }

 

  private generateDailyProduction(
    Schedule: ScheduleItem[],
    UnitYields: UnitYieldItem[]
  ): {
    productionIn: { [Product: string]: { [Date: string]: number } };
    productionOut: { [Product: string]: { [Date: string]: number } };
  } {
    const productionIn: { [Product: string]: { [Date: string]: number } } = {};
    const productionOut: { [Product: string]: { [Date: string]: number } } = {};

    Schedule.forEach((scheduleItem) => {
      // Aggregating the production out based on Charge_ProductCode and Date
      const product = scheduleItem.Charge_ProductCode;
      const date = `${scheduleItem.Date}`;
      const scheduleBbls = scheduleItem.bbls;

      if (!productionOut[product]) {
        productionOut[product] = {};
      }

      if (!productionOut[product][date]) {
        productionOut[product][date] = 0;
      }

      // Aggregating scheduleItem.bbls as production out
      productionOut[product][date] += scheduleBbls * 42;

      // Now iterate through UnitYields for productionIn
      const yieldsForUnit = UnitYields.filter(
        (yieldItem) =>
          yieldItem.Unit === scheduleItem.Unit &&
          yieldItem.Charge_ProductCode === product
      );

      yieldsForUnit.forEach((yieldItem) => {
        const outputGals = scheduleBbls * yieldItem.OutputPercent * 42; // Convert bbls to gallons
        const outputProduct = yieldItem.Output_ProductCode;
        if (!productionIn[outputProduct]) {
          productionIn[outputProduct] = {};
        }

        if (!productionIn[outputProduct][date]) {
          productionIn[outputProduct][date] = 0;
        }

        // Aggregating output in gallons as productionIn
        productionIn[outputProduct][date] += outputGals;
      });
    });

    return {
      productionIn,
      productionOut,
    } as DailyProductionOutput;
  }



  
}



