import { Router } from "express";
import productsRoutes from "./products-routes";
import ordersRoutes from "./orders-routes";
import forecastModelRoutes from "./forecast-model.routes";
import rackPriceRoutes from "./rack-price.routes";
import specialPriceRoutes from "./special-price.routes";






const router = Router();
// ****define Resource endpoints root paths and the files that specify the http verb paths.***
//Note Routes should be lowercase and kebab case*/
//Should we create a stadard return object like {"data":[] , "success":[], count:int*/ 

/*This should be a list of Resources*/

router.use('/orders',ordersRoutes);
router.use('/rack-price',rackPriceRoutes);
router.use('/special-price',specialPriceRoutes);
router.use('/forecast-model',forecastModelRoutes);
router.use('/products',productsRoutes);

export default router;


