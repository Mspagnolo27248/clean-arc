import { MonthlyDemandForecastItem, RollingForecastInputParams, ScheduleItem, UnitYieldItem } from "../data-transfer-objects/dto";
import { MonthlyForecast } from "../data/MonthlyForecast";
import { openOrders } from "../data/OpenOrders";
import { ProductFormulations } from "../data/ProductFormulations";
import { producstToRun } from "../data/ProductsToRun";
import { receiptsData } from "../data/RececiptsData";
import { Schedule } from "../data/Schedule";
import { UnitYields } from "../data/UnitYieldsData";
import { OutputService } from "../services/outputService";
import { generateBlendRequirements, generateDailyDemandForecastFromMonthly } from "./helper-functions";
import { RollingForecastService } from "./RollingForecastService";


const products = producstToRun.map((item)=>({...item,ProductCode:`${item.ProductCode}`}));
const schedule:ScheduleItem[] = Schedule.map(item=>({...item,Date:parseInt(item.Date)}));
const yields:UnitYieldItem[] = UnitYields.map(item=>({...item,Output_ProductCode:`${item.Output_ProductCode}`}));
const receipts = receiptsData.map((item)=>({...item,Date:parseInt(item.Date)}));
const monthlyForecast:MonthlyDemandForecastItem[] = MonthlyForecast.map(item=>({...item,ProductCode:String(item.ProductCode)}));
const dailyForecast = generateDailyDemandForecastFromMonthly(monthlyForecast);
const blends = ProductFormulations.map(item=>({...item,Finished_ProductCode:`${item.Finished_ProductCode}`,Component_ProductCode:`${item.Component_ProductCode}`}));
const blendRequirements = generateBlendRequirements(openOrders,dailyForecast,blends);

const inputParams:RollingForecastInputParams = {
    ModelMetaData:{startDate:20240101,runDays:90,uid:"901",id_description:"test-model"} ,
    ProductsForModelItem: products,
    Receipts: receipts,
    ScheduleItem: schedule,
    UnitYieldItem:yields,
    DailyOpenOrders: openOrders,
    DailyDemandForecast:dailyForecast,
    DailyBlendRequirements: blendRequirements,
};

const model = new RollingForecastService(inputParams);
const modelOutput = model.outputModel();
OutputService.saveOutput('model1',modelOutput)
console.log(modelOutput)