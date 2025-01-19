import { PricingRepository } from "../core-layer/pricing-module/data-access-repository/PricingRepository";
import { DIContainer } from "./di-container";
import { GetProductByIdUseCase } from "../core-layer/pricing-module/use-cases/GetProductByIdUseCase";
import { GetProductUseCase } from "../core-layer/pricing-module/use-cases/GetProductsUseCase";
import { PricingRepositoryImp } from "../core-layer/pricing-module/data-access-repository/PricingReposityoryImp";

// Export the container with a specific dependency map
  export const container = new DIContainer<{
    PricingRepository: PricingRepository,
    GetProductByIdUseCase: GetProductByIdUseCase,
    GetProductUseCase: GetProductUseCase,

    Test:string;
  }>();


  export function registerDependencies(){
    container.register("PricingRepository", () => new PricingRepositoryImp());
    container.register("GetProductByIdUseCase", () => new GetProductByIdUseCase(container.resolve("PricingRepository")));
    container.register("GetProductUseCase", () => new GetProductUseCase(container.resolve("PricingRepository")));
  }


  

