import { Router } from "express";
import { ProductsController } from "../controllers/products-controller";






const productsRoutes = Router();
productsRoutes.get("/", ProductsController.getAll); 
productsRoutes.get("/:id", ProductsController.getOne);  
//TODO - productsRoutes.post('/', );  
//TODO -  productsRoutes.put('/:id',;  
//TODO -  productsRoutes.delete('/',);  

export default productsRoutes;
