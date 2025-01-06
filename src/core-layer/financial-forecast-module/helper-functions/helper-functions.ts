
import {DailyDemandForecastItem, MonthlyDemandForecastItem, ScheduleItem, UnitProductionOutItem, UnitYieldItem } from "../data-transfer-objects/dto";
import { ProductFormulationItem } from "../data-transfer-objects/dto";
import { DailyOpenOrderItem } from "../data-transfer-objects/dto";


  
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
  
  export function generateStringKeyFromFields<T extends object, K extends keyof T>(
    obj: T,
    fields: K[]
  ): string {
    return fields.map((field) => obj[field]).join("|");
  }
  
  
  export function createMap<T extends object, U>(
    params: T[],
    keyFields: (keyof T)[],
    valueField?: keyof T
  ): Map<string, U> {
    return new Map(
      params.map((item) => {
        const key = generateStringKeyFromFields(item, keyFields);
        const value = (valueField ? item[valueField]  :item ) as U;
        return [key, value];
      })
    );
  }
  


  export function createNestedObject<T extends object>(
    params: T[],
    keyFields: (keyof T)[],
    valueField: keyof T,
    aggregate:(currentValue: any, newValue: any)=> any = (currentValue, newValue) => currentValue +  newValue ,
    storeFullObject: boolean = false
  ){
    const nestedObject: Record<string, any> = {};
  
    params.forEach((item) => {
      let currentLevel = nestedObject;
  
      keyFields.forEach((field, index) => {
        const key = item[field] as string | number;
  
        if (index === keyFields.length - 1) {
          const newValue = storeFullObject ? (item ) : (item[valueField] );
          if (currentLevel[key] !== undefined) {
            currentLevel[key] = aggregate
              ? aggregate(currentLevel[key], newValue)
              : newValue;
          } else {
            currentLevel[key] = newValue;
          }
        } else {
          if (!currentLevel[key]) {
            currentLevel[key] = {};
          }
          currentLevel = currentLevel[key];
        }
      });
    });
  
    return nestedObject;
  }
  


  type NestedObject<T, K extends keyof T> = {
    [key: string]: NestedObject<T, Exclude<keyof T, K>> | T[]; // Recursively handle nesting
  };

  type ConvertObjectArrayToNestedObjectWithArrayValue<T, K extends keyof T> = {
    [key: string]: NestedObject<T, Exclude<keyof T, K>> | T[]; // Recursively handle nesting
  };
  
  function convertToNestedObject<T>(array: T[], keyFields: (keyof T)[]): NestedObject<T, keyof T> {
    const result: NestedObject<T, keyof T> = {};
  
    array.forEach(item => {
      let currentLevel = result;
  
      // Traverse through the key fields
      keyFields.forEach((field, index) => {
        const keyValue = item[field] as unknown as string;
  
        // If we're at the last key field, we need to add the remaining properties
        if (index === keyFields.length - 1) {
          // Remove the key fields from the item to get the remaining properties
          const remainingProperties = Object.fromEntries(
            Object.entries(item as keyof T).filter(([key]) => !keyFields.includes(key as keyof T))
          );
  
          // If the key doesn't exist, initialize it with an empty array
          if (!currentLevel[keyValue]) {
            currentLevel[keyValue] = [];
          }
  
          // Add the remaining properties as an object to the array
          (currentLevel[keyValue] as T[]).push(remainingProperties as T);
        } else {
          // Otherwise, move deeper into the next level
          if (!currentLevel[keyValue]) {
            currentLevel[keyValue] = {};
          }
          currentLevel = currentLevel[keyValue] as NestedObject<T, keyof T>;
        }
      });
    });
  
    return result;
  }
  