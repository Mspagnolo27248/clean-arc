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
import { DateUtils } from "./helper-functions";

export class RollingForecastService {
  RollingForecastInputParams: RollingForecastInputParams;
  ProductsForModelItem: Map<string, ProductsForModelItem>;
  Receipts: Map<string, ReceiptsItem>;
  DailyOpenOrders: Map<string, DailyOpenOrderItem>;
  DailyDemandForecast: Map<string, DailyDemandForecastItem>;
  DailyBlendRequirements: {[Product:string]:{[Date:string]:number}};
  ScheduleItem: ScheduleItem[];
  UnitYieldItem: UnitYieldItem[];
  ProductFormulation: ProductFormulationItem[];
  RunDates: number[];
  ProductionIn: ProductionData;
  ProductionOut: ProductionData;

  constructor(params: RollingForecastInputParams) {
    this.RollingForecastInputParams = params;
    this.ScheduleItem = params.ScheduleItem;
    this.UnitYieldItem = params.UnitYieldItem;
    this.ProductFormulation = params.ProductFormulation;
    const production = this.generateDailyProduction(
      params.ScheduleItem,
      params.UnitYieldItem
    );
    this.ProductionIn = production.productionIn;
    this.ProductionOut = production.productionOut;
    this.ProductsForModelItem = this.createProductMap(
      params.ProductsForModelItem
    );
    this.Receipts = this.createReceiptsMap(params.Receipts);
    this.DailyOpenOrders = this.createOpenOrdersMap(params.DailyOpenOrders);
    this.DailyDemandForecast = this.createDailyDemandMap(
      params.DailyDemandForecast
    );
    this.DailyBlendRequirements = this.calculateDailyBlendRequirements(
      params.ProductFormulation, params.DailyDemandForecast, params.DailyOpenOrders);
    this.RunDates = this.generateDateRange(
      this.RollingForecastInputParams.ModelMetaData.startDate,
      this.RollingForecastInputParams.ModelMetaData.runDays
    );
  }

  calculateEndingInventory(
    productCode: string,
    date: number,
    previousEndInventory: number | null
  ): number {
    const openInventory =
      previousEndInventory !== null
        ? previousEndInventory
        : this.ProductsForModelItem.get(productCode)?.CurrentInventoryGals || 0;

    const receipts = this.Receipts.get(`${productCode}|${date}`)?.Gals || 0;
    const productionIn = this.ProductionIn[`${productCode}`]?.[`${date}`] || 0; // Fixed key format
    const productionOut =
      this.ProductionOut[`${productCode}`]?.[`${date}`] || 0; // Fixed key format
    const demandForecast =
      this.DailyDemandForecast.get(`${productCode}|${date}`)?.Gals || 0;
    const openOrders =
      this.DailyOpenOrders.get(`${productCode}|${date}`)?.Gals || 0;
    const blendRequirements =
      this.DailyBlendRequirements[`${productCode}`]?.[`${date}`] || 0;

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
        const openInventory =
          previousEndInventory !== null
            ? previousEndInventory
            : product.CurrentInventoryGals || 0;
        const receipts = this.Receipts.get(`${productCode}|${date}`)?.Gals || 0;
        const productionIn =
          this.ProductionIn[`${productCode}`]?.[`${date}`] || 0;
        const productionOut =
          this.ProductionOut[`${productCode}`]?.[`${date}`] || 0;
        const demandForecast =
          this.DailyDemandForecast.get(`${productCode}|${date}`)?.Gals || 0;
        const openOrders =
          this.DailyOpenOrders.get(`${productCode}|${date}`)?.Gals || 0;
        const blendRequirements =
        this.DailyBlendRequirements[`${productCode}`]?.[`${date}`] || 0;

        const endingInventory = this.calculateEndingInventory(
          productCode,
          date,
          previousEndInventory
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

  generateStringKeyFromFields<T extends object, K extends keyof T>(
    obj: T,
    fields: K[]
  ): string {
    return fields.map((field) => obj[field]).join("|");
  }

  private generateDateRange(startDate: number, runDays: number): number[] {
    return DateUtils.createDateRangeFromIntegerDate(startDate, runDays);
  }

  private createProductMap(params: ProductsForModelItem[]) {
    return new Map(
      params.map((item) => {
        const key = this.generateStringKeyFromFields(item, ["ProductCode"]);
        return [key, item];
      })
    );
  }

  private createReceiptsMap(params: ReceiptsItem[]) {
    return new Map(
      params.map((item) => {
        const key = this.generateStringKeyFromFields(item, [
          "ProductCode",
          "Date",
        ]);
        return [key, item];
      })
    );
  }

  //   private createProductionOutMap(params: UnitProductionOutItem[]) {
  //     return new Map(
  //       params.map((item) => {
  //         const key = this.generateStringKeyFromFields(item, [
  //           "Unit",
  //           "Charge_ProductCode",
  //           "Output_ProductCode",
  //           "Date",
  //         ]);
  //         return [key, item];
  //       })
  //     );
  //   }

  private createOpenOrdersMap(params: DailyOpenOrderItem[]) {
    return new Map(
      params.map((item) => {
        const key = this.generateStringKeyFromFields(item, [
          "ProductCode",
          "Date",
        ]);
        return [key, item];
      })
    );
  }

  private createDailyDemandMap(params: DailyDemandForecastItem[]) {
    return new Map(
      params.map((item) => {
        const key = this.generateStringKeyFromFields(item, [
          "ProductCode",
          "Date",
        ]);
        return [key, item];
      })
    );
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
