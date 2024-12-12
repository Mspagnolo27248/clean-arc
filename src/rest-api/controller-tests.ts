import { PricingRepository } from "../core-layer/order-entry-module/data-access-repository/PricingRepository";
import { PricingRepositoryImp } from "../core-layer/order-entry-module/data-access-repository/PricingReposityoryImp";
import { GetAllPriceAgreements } from "../core-layer/order-entry-module/use-case-services/GetAllPriceAgreementsUseCase";
import { GetRackPricingUseCase } from "../core-layer/order-entry-module/use-case-services/GetRackPricingUseCase";
import { ProductModel } from "../shared-common/database/custom-orm/data-models/ProductModel";
import { RackPriceController } from "./controllers/rack-price-controller";

const main = async () => {
  const pricingRepository: PricingRepository = new PricingRepositoryImp();
  //Price Agreements
  //const usecase =new GetAllPriceAgreements(pricingRepository);
  //const results = await usecase.execute();

  //Rack Prices
  //const usecase =new GetRackPricingUseCase(pricingRepository);
  //const results = await usecase.execute();
  
  //Products
  const productId = 4315
  const usecase =  await ProductModel.findByKey({productId})

  console.log(JSON.stringify(usecase));
};

main();
