import { Router } from "express";
import { SpecialPriceController } from "../controllers/special-price-controller";




const specialPriceRoutes = Router();

specialPriceRoutes.post('/',SpecialPriceController.create)





export default specialPriceRoutes