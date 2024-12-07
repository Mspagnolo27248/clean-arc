import { NextFunction, Request, Response } from "express";
import { PricingRepositoryImp } from "../../core-layer/order-entry-module/data-access-repository/PricingReposityoryImp";
import { RackPriceDto } from "../../core-layer/order-entry-module/data-transfer-objects/price-records-dtos";
import { CreateRackPriceUseCase } from "../../core-layer/order-entry-module/use-case-services/CreateRackPriceUseCase";
import { PricingRepository } from "../../core-layer/order-entry-module/data-access-repository/PricingRepository";
import { OrderRepository } from "../../core-layer/order-entry-module/data-access-repository/OrderEntryRepository";
import { OrderRepositoryImpl } from "../../core-layer/order-entry-module/data-access-repository/OrderEntryRepositoryImp";
import { ConvertPriceUseCase } from "../../core-layer/order-entry-module/use-case-services/ConvertPriceUseCase";
import { GetRackPricingWithConversionsUseCase } from "../../core-layer/order-entry-module/use-case-services/GetRackPricingWithConversionUseCase";
import { GetRackPricingUseCase } from "../../core-layer/order-entry-module/use-case-services/GetRackPricingUseCase";

const pricingRepository: PricingRepository = new PricingRepositoryImp();
const orderRepository: OrderRepository = new OrderRepositoryImpl();
const createRackPriceUseCase: CreateRackPriceUseCase =  new CreateRackPriceUseCase(pricingRepository);
const convertPriceUseCase: ConvertPriceUseCase =  new ConvertPriceUseCase(pricingRepository);

export class RackPriceController {

  static async getAll(req: Request, res: Response){
    const usecase = new GetRackPricingUseCase(pricingRepository);
    try {
      const rackPrices = await usecase.execute();
      return res.status(201).json(rackPrices);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      } else {
        console.error("An unknown error occurred");
      }
      return res.status(500).json({ message: "Error" });
    }

  }


  static async create(req: Request, res: Response) {
    try {
      const rackPriceDto = req.body as RackPriceDto;
      const rackPrice = await createRackPriceUseCase.execute(rackPriceDto);
      return res.status(201).json(rackPrice);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      } else {
        console.error("An unknown error occurred");
      }
      return res.status(500).json({ message: "Error" });
    }
  }

  static async convertToGallons(req: Request, res: Response) {
    try {
      const priceRecord = req.body as RackPriceDto;
      const convertedPrice = await convertPriceUseCase.execute(priceRecord);
      return res.status(200).json(convertedPrice);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      } else {
        console.error("An unknown error occurred");
      }
    }
  }

  static async getAllRackPricesConverted(req:Request,res:Response){
    try {
      const GetRackPricingWithConversions = new GetRackPricingWithConversionsUseCase(pricingRepository,orderRepository);
      
      const convertedRackPrices = await GetRackPricingWithConversions.execute();
      return res.status(200).json(convertedRackPrices);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      } else {
        console.error("An unknown error occurred");
      }
    }
  }

  static upsertRecords(req:Request,res:Response){
    pricingRepository.testUpsert()
  }

}



 

export const checkBodyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId, containerId, rackPricePerUom, effectiveDate, expirationDate, uom } = req.body;
  if (
    typeof productId !== "string" ||
    typeof containerId !== "string" ||
    typeof rackPricePerUom !== "number" ||   
    typeof uom !== "string"||
    typeof effectiveDate !== "number"||
    typeof expirationDate !== "number"
  ) {
    return res.status(400).json({ error: "Invalid request body. Ensure all fields are correct." });
  } else {
    next();
  }



};
