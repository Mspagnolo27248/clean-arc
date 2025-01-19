import { PricingRepository } from "../core-layer/pricing-module/data-access-repository/PricingRepository";
import { DIContainer } from "./di-container";
import { GetProductByIdUseCase } from "../core-layer/pricing-module/use-cases/GetProductByIdUseCase";
import { GetProductUseCase } from "../core-layer/pricing-module/use-cases/GetProductsUseCase";
import { PricingRepositoryImp } from "../core-layer/pricing-module/data-access-repository/PricingReposityoryImp";
import { ForecastModelRepositoryImp } from "../core-layer/financial-forecast-module/data-access-repository/ForecastModelRepositoryImp";
import { ForecastModelRepository } from "../core-layer/financial-forecast-module/data-access-repository/ForecastModelRespository";
import { SaveForecastModelUseCase } from "../core-layer/financial-forecast-module/use-cases/SaveForecastModelUseCase";
import { OpenExistingModelUseCase } from "../core-layer/financial-forecast-module/use-cases/OpenExistingModelUseCase";
import { CalcualteInventoryRollforwardUseCase } from "../core-layer/financial-forecast-module/use-cases/CalculateInventoryRollforwardUseCase";

// Export the container with a specific dependency map
  export const container = new DIContainer<{
    //Repository
    PricingRepository: PricingRepository,
    ForecastModelRepository:ForecastModelRepository,
    //UseCases
    GetProductByIdUseCase: GetProductByIdUseCase,
    GetProductUseCase: GetProductUseCase,
    SaveForecastModelUseCase:SaveForecastModelUseCase,
    OpenExistingModelUseCase:OpenExistingModelUseCase,
  
  }>();


  export function registerDependencies(){
    //Repository
    container.register("PricingRepository", () => new PricingRepositoryImp());
    container.register("ForecastModelRepository", () => new ForecastModelRepositoryImp("./data/json"));
    //UseCases
    container.register("GetProductByIdUseCase", () => new GetProductByIdUseCase(container.resolve("PricingRepository")));
    container.register("GetProductUseCase", () => new GetProductUseCase(container.resolve("PricingRepository")));
    container.register("SaveForecastModelUseCase", () => new SaveForecastModelUseCase(container.resolve("ForecastModelRepository")));
    container.register("OpenExistingModelUseCase", () => new OpenExistingModelUseCase(container.resolve("ForecastModelRepository")));
 
  }



  

