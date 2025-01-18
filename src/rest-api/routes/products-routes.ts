import { Router } from "express";
import { ProductsController } from "../controllers/products-controller";
import { container } from "../../dependancy-registar/wire-di";






const productsRoutes = Router();
productsRoutes.get("/", (req,res)=>{
    const productsController = container.resolve("ProductsController");
    productsController.getAll(req,res);
}); 
productsRoutes.get("/:id", (req,res)=>{
    const productsController = container.resolve("ProductsController");
    productsController.getOne(req,res);
});
//TODO - productsRoutes.post('/', );  
//TODO -  productsRoutes.put('/:id',;  
//TODO -  productsRoutes.delete('/',);  

export default productsRoutes;
