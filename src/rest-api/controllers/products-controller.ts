import { NextFunction, Request, Response } from "express";
import { container } from "../../dependancy-registar/wire-di";




export class ProductsController {
    static async getAll(req: Request, res: Response) {
        const getProductsUseCase = container.resolve("GetProductUseCase");
        try {
            const products = await getProductsUseCase.execute();
            return res.status(201).json(products)
        }
        catch (err) {
            return res.status(500).json({ message: "Error" });
        }   
    }


   static  async getOne(req: Request, res: Response) {
        try {
            const getProductByIdUseCase = container.resolve("GetProductByIdUseCase");
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