
import { DailyBlendRequirementsItem, DailyDemandForecastItem, MonthlyDemandForecastItem, ScheduleItem, UnitProductionOutItem, UnitYieldItem } from "../data-transfer-objects/dto";
import { ProductFormulationItem } from "../data-transfer-objects/dto";
import { DailyOpenOrderItem } from "../data-transfer-objects/dto";

export function generateBlendRequirements(
  openOrders: DailyOpenOrderItem[],
  dailyForecast: DailyDemandForecastItem[],
  blendRequirements: ProductFormulationItem[]
): DailyBlendRequirementsItem[] {
  const requirementsMap: { [key: string]: DailyBlendRequirementsItem } = {};

  const processSource = (
    source: { ProductCode: string; Date: number; Gals: number }[],
   
  ) => {
    source.forEach((item) => {
      const formulations = blendRequirements.filter(
        (requirement) => requirement.Finished_ProductCode === item.ProductCode
      );

      formulations.forEach((formulation) => {
        const requiredGals = (item.Gals * formulation.FormulaPercent) / 100;
        const key = `${formulation.Component_ProductCode}-${item.Date}`;

        if (requirementsMap[key]) {
          requirementsMap[key].Gals += requiredGals;
        } else {
          requirementsMap[key] = {
            Component_ProductCode: formulation.Component_ProductCode.toString(),
            Date: item.Date,
            Gals: requiredGals,
          };
        }
      });
    });
  };

  processSource(openOrders);
  processSource(dailyForecast);

  return Object.values(requirementsMap);
}
  
  export function generateDailyDemandForecastFromMonthly(
    monthlyForecast: MonthlyDemandForecastItem[]
  ): DailyDemandForecastItem[] {
    const output: DailyDemandForecastItem[] = [];
  
    monthlyForecast.forEach((forecast) => {
      const daysInMonth = new Date(
        parseInt(String(forecast.YYYYMM).substring(0, 4)),
        parseInt(String(forecast.YYYYMM).substring(4, 6)),
        0
      ).getDate();
  
      const dailyGals = forecast.Gals / daysInMonth;
  
      for (let day = 1; day <= daysInMonth; day++) {
        const formattedDate = `${forecast.YYYYMM}${day.toString().padStart(2, "0")}`;
        const YYYYMM = String(forecast.YYYYMM);
        output.push({
          ProductCode: forecast.ProductCode,
          Date: parseInt(formattedDate),
          Gals: dailyGals,
        });
      }
    });
  
    return output;
  }

  export class DateUtils {
    // Convert integer date (yyyyMMdd) to string date (yyyy-MM-dd)
    static convertIntegerDateToString(date: number): string {
      const dateStr = date.toString();
      const year = dateStr.slice(0, 4);
      const month = dateStr.slice(4, 6);
      const day = dateStr.slice(6, 8);
      return `${year}-${month}-${day}`;
    }
  
    // Convert string date (yyyy-MM-dd) to integer date (yyyyMMdd)
    static convertStringToIntegerDate(date: string): number {
      const [year, month, day] = date.split('-').map(num => parseInt(num, 10));
      return year * 10000 + month * 100 + day;
    }
  
    // Create a date range from a string date by adding "runDays" days and returning integers
    static createDateRangeFromString(date: string, runDays: number): number[] {
      const startDate = new Date(date);
      const dateRange: number[] = [];
  
      for (let i = 0; i <= runDays; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i);
        const dateStr = newDate.toISOString().split('T')[0]; // Format as yyyy-MM-dd
        const integerDate = this.convertStringToIntegerDate(dateStr);
        dateRange.push(integerDate);
      }
  
      return dateRange;
    }
  
    // Create a date range from an integer date by adding "runDays" days and returning integers
    static createDateRangeFromIntegerDate(date: number, runDays: number): number[] {
      const startDate = this.convertIntegerDateToString(date);
      return this.createDateRangeFromString(startDate, runDays);
    }
  }
  
  