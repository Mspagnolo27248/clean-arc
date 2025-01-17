import { NextFunction, Request, Response } from "express";
import { PricingRepositoryImp } from "../../core-layer/pricing-module/data-access-repository/PricingReposityoryImp";
import { RackPriceDto } from "../../core-layer/pricing-module/data-transfer-objects/price-records-dtos";
import { CreateRackPriceUseCase } from "../../core-layer/pricing-module/use-cases/CreateRackPriceUseCase";
import { PricingRepository } from "../../core-layer/pricing-module/data-access-repository/PricingRepository";
import { GetRackPricingUseCase } from "../../core-layer/pricing-module/use-cases/GetRackPricingUseCase";
import { GetRackPriceByKeyUseCase } from "../../core-layer/pricing-module/use-cases/GetRackPriceByKeyUseCase";
import { DeleteRackPriceUseCase } from "../../core-layer/pricing-module/use-cases/DeleteRackPriceUseCase";
import { handleError } from "../utility/error-handler";
/*
              **** Presentaton Layer: Controllers ************
 1. **Receiving Request Input**: Handles incoming requests from routes and prepares to send responses back.
 2. **Parsing Input Request**: Extracts and type checks input data from the request object (e.g., body, query, params). 
      - Focus on type checking to ensure the data is in the expected format before passing it to use-cases.
      - Avoid performing business logic validation at this stage.
 3. **Dependency Injection**: Instantiates required repositories and services, injecting them into use-cases for execution.
 4. **Executes Use Cases these are the main entry points of the Application layer
 5. **Returning HTTP Responses**: Uses the response object to send appropriate HTTP responses. 
      - Example: `200 OK` for successful operations or `400 Bad Request` for invalid input.
*/

const pricingRepository: PricingRepository = new PricingRepositoryImp();

const createRackPriceUseCase: CreateRackPriceUseCase =  new CreateRackPriceUseCase(pricingRepository);


export class RackPriceController {

  static async getAll(req: Request, res: Response){
    const filters = req.body;
    const usecase = new GetRackPricingUseCase(pricingRepository); 
    try {
      const rackPrices = await usecase.execute(filters);
      return res.status(200).json(rackPrices);
    } catch (error) {
      handleError(res,error)
  }
}


  static async getOne(req: Request, res: Response) {
    try {
      const keys = req.body as RackPriceDto;
      const usecase =  new GetRackPriceByKeyUseCase(pricingRepository);
      const rackPrice = await usecase.execute(keys);
      return res.status(200).json(rackPrice);
    } catch (error) {
      handleError(res,error);
    }
  }




  static async upsert(req: Request, res: Response) {
    try {
      const rackPriceDto = req.body as RackPriceDto;
      const rackPrice = await createRackPriceUseCase.execute(rackPriceDto);
      return res.status(201).json(rackPrice);
    } catch (error) {
      handleError(res,error);
  }
}

  static async delete(req: Request, res: Response) {
    try {
      const rackPriceDto = req.body as RackPriceDto;
      const usecase = new DeleteRackPriceUseCase(pricingRepository);
      const rackPrice = await usecase.execute(rackPriceDto);
      return res.status(204).json(rackPrice);
    } catch (error) {
      handleError(res,error);
  }
}


}



 


// Example of Middleware check libriary like ZOD can do this. 
export const checkBodyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productCode, containerCode, rackPricePerUom, effectiveDate, effectiveTime, unitOfMeasure } = req.body;
  if (
    typeof productCode !== "string" ||
    typeof containerCode !== "string" ||
    typeof unitOfMeasure !== "string"||
    typeof effectiveDate !== "number"||
    typeof effectiveTime !== "number"
  ) {
    return res.status(400).json({ error: "Invalid request body. Ensure all fields are correct." });
  } else {
    next();
  }



};


