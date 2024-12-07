
import { NextFunction, Request, Response } from "express";
import { PriceAgreementDto } from "../../core-layer/order-entry-module/data-transfer-objects/price-records-dtos";
import { CreatePriceAgreementUseCase } from "../../core-layer/order-entry-module/use-case-services/CreatePriceAgreement";
import { PricingRepositoryImp } from "../../core-layer/order-entry-module/data-access-repository/PricingReposityoryImp";


export class SpecialPriceController {
    static async create(req: Request, res: Response) {  
        try {
            const specialPriceDto:PriceAgreementDto = req.body ;
            const repo = new PricingRepositoryImp();
            const usecase =  new CreatePriceAgreementUseCase(repo)
            const results = await usecase.execute(specialPriceDto);
            return res.status(201).json(results);
          } catch (error) {
            if (error instanceof Error) {
              return res.status(500).json({ message: error.message });
            } else {
              console.error("An unknown error occurred");
            }
            return res.status(500).json({ message: "Error" });
          }
    }

}