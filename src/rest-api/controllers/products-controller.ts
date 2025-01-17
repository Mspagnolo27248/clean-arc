import { NextFunction, Request, Response } from "express";
import { PricingRepository } from "../../core-layer/pricing-module/data-access-repository/PricingRepository";
import { PricingRepositoryImp } from "../../core-layer/pricing-module/data-access-repository/PricingReposityoryImp";
import { GetProductByIdUseCase } from "../../core-layer/pricing-module/use-cases/GetProductByIdUseCase";
import { GetRackPriceByKeyUseCase } from "../../core-layer/pricing-module/use-cases/GetRackPriceByKeyUseCase";
import { GetProductUseCase } from "../../core-layer/pricing-module/use-cases/GetProductsUseCase";

const pricingRepository = new PricingRepositoryImp();
const getProductByIdUseCase = new GetProductByIdUseCase(pricingRepository);
const getProductsUseCase = new GetProductUseCase(pricingRepository);


export class ProductsController {

    static async getAll(req: Request, res: Response) {
        try {
            const products = await getProductsUseCase.execute();
            return res.status(201).json(products)
        }
        catch (err) {
            return res.status(500).json({ message: "Error" });
        }
    }


    static async getOne(req: Request, res: Response) {
        try {
            const productID = req.params.id;
            if(!productID) throw new Error("Bad ID")
            const products = await getProductByIdUseCase.execute(productID);
            return res.status(201).json(products)
        }
        catch (err) {
            return res.status(500).json({ message: "Error" });
        }
    }

    
}