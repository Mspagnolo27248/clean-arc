import { PricingRepository } from "../core-layer/pricing-module/data-access-repository/PricingRepository";
import { DIContainer } from "./di-container";
import { GetProductByIdUseCase } from "../core-layer/pricing-module/use-cases/GetProductByIdUseCase";
import { GetProductUseCase } from "../core-layer/pricing-module/use-cases/GetProductsUseCase";
import { ProductsController } from "../rest-api/controllers/products-controller";
import { PricingRepositoryImp } from "../core-layer/pricing-module/data-access-repository/PricingReposityoryImp";

// Export the container with a specific dependency map
 export const container = new DIContainer<{
    PricingRepository: PricingRepository,
    GetProductByIdUseCase: GetProductByIdUseCase,
    GetProductUseCase: GetProductUseCase,
    ProductsController: ProductsController,
    Test:string;
  }>();


container.register("PricingRepository", () => new PricingRepositoryImp());
container.register("GetProductByIdUseCase", () => new GetProductByIdUseCase(container.resolve("PricingRepository")));
container.register("GetProductUseCase", () => new GetProductUseCase(container.resolve("PricingRepository")));
container.register("ProductsController", () => new ProductsController(
container.resolve("GetProductByIdUseCase"), 
container.resolve("GetProductUseCase")));

  

