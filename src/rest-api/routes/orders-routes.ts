import  { Router, Request, Response, NextFunction } from "express";
import { OrderController } from "../controllers/order-controller";



const ordersRoutes = Router();

ordersRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const result = await OrderController.getAllOrders(req, res);
    return result;
  } catch (error) {
    return res.status(500).json({ message: "Error getting orders" });
  }
}); 

ordersRoutes.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await OrderController.getOneOrders(req, res);
    return result;
  } catch (error) {
    return res.status(500).json({ message: "Error getting one order" });
  }
}); 


ordersRoutes.post('/', async (req: Request, res: Response) => {
    try {  
      const result = await OrderController.create(req, res);
      return result; 
    } catch (error) {
      return res.status(500).json({ message: "Error creating order" });
    }
  });

ordersRoutes.put('/:id', (req: Request, res: Response) => { });

ordersRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {  
    const result = await OrderController.delete(req, res);
    return result; 
  } catch (error) {
    return res.status(500).json({ message: "Error deleting order" });
  }

 });


ordersRoutes.post('/complete', async (req: Request, res: Response) => {
  try {  
    const result = await OrderController.billOrder(req, res);
    return result; 
  } catch (error) {
    if(error instanceof Error){
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error creating order" });
  }
});
export default ordersRoutes;