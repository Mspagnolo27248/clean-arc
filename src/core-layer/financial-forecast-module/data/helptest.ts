
import { ForecastModelRepositoryImp } from "../data-access-repository/ForecastModelRepositoryImp";
import { MonthlyDemandForecastItem, RollingForecastInputParams, ScheduleItem, UnitYieldItem } from "../data-transfer-objects/dto";
import { MonthlyForecast } from "./MonthlyForecast";
import { openOrders } from "./OpenOrders";
import { ProductFormulations } from "./ProductFormulations";
import { producstToRun } from "./ProductsToRun";
import { receiptsData } from "./RececiptsData";
import { Schedule } from "./Schedule";
import { UnitYields } from "./UnitYieldsData";
import { generateBlendRequirements, generateDailyDemandForecastFromMonthly } from "../helper-functions/helper-functions";
import { RollingForecastService } from "../helper-functions/RollingForecastService";


const products = producstToRun.map((item)=>({...item,ProductCode:`${item.ProductCode}`}));
const schedule:ScheduleItem[] = Schedule.map(item=>({...item,Date:parseInt(item.Date)}));
const yields:UnitYieldItem[] = UnitYields.map(item=>({...item,Output_ProductCode:`${item.Output_ProductCode}`}));
const receipts = receiptsData.map((item)=>({...item,Date:parseInt(item.Date)}));
const monthlyForecast:MonthlyDemandForecastItem[] = MonthlyForecast.map(item=>({...item,ProductCode:String(item.ProductCode)}));
const dailyForecast = generateDailyDemandForecastFromMonthly(monthlyForecast);
const blends = ProductFormulations.map(item=>({...item,Finished_ProductCode:`${item.Finished_ProductCode}`,Component_ProductCode:`${item.Component_ProductCode}`}));
const blendRequirements = generateBlendRequirements(openOrders,dailyForecast,blends);

const inputParams:RollingForecastInputParams = {
    ModelMetaData:{startDate:20240112,runDays:31,uid:"901",id_description:"test-model"} ,
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
const repo = new ForecastModelRepositoryImp('./data/json');
repo.saveModel('model2.json',modelOutput)
console.log(modelOutput)