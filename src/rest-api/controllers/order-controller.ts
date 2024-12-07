import { OrderRepositoryImpl } from "../../core-layer/order-entry-module/data-access-repository/OrderEntryRepositoryImp";
import { OrderDTO } from "../../core-layer/order-entry-module/data-transfer-objects/order-entry-dtos";
import { BillOrderUseCase } from "../../core-layer/order-entry-module/use-case-services/BillOrderUseCase";
import { CreateOrderUseCase } from "../../core-layer/order-entry-module/use-case-services/CreateOrderUseCase";
import { Request, Response } from 'express';
import { GetAllOrdersUseCase } from "../../core-layer/order-entry-module/use-case-services/GetAllOrdersUseCase";
import { PricingRepositoryImp } from "../../core-layer/order-entry-module/data-access-repository/PricingReposityoryImp";
import { throwErrorOrDefaultMsg } from "../../shared-common/services/helper-functions/utilites";
import { GetOneOrderUseCase } from "../../core-layer/order-entry-module/use-case-services/GetOneOrderUseCase";
import { DeleteOrderUseCase } from "../../core-layer/order-entry-module/use-case-services/DeleteOrderUseCase";

//Dependecy Injection Section
const orderRepository = new OrderRepositoryImpl();

const priceRepository = new PricingRepositoryImp();


export class OrderController {

  static async create(req: Request, res: Response): Promise<Response> {
    const createOrderUseCase = new CreateOrderUseCase(orderRepository);
    const orderDTO: OrderDTO = req.body; //Need to validate this in middleware.   
    try {
      const createdOrder = await createOrderUseCase.execute(orderDTO);
      return res.status(201).json(createdOrder);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      } else {
        console.error("An unknown error occurred");
      }
      return res.status(500).json({ message: "Error" });
    }
  }

  static async getAllOrders(req: Request, res: Response) {

    try {
      const getAllOrdersUseCase = new GetAllOrdersUseCase(orderRepository);
      const result = await getAllOrdersUseCase.execute();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error getting all orders" });
    }
  }



  static async getOneOrders(req: Request, res: Response) {

    try {
      const getOneOrder = new GetOneOrderUseCase(orderRepository);
      const orderId = req.params.id
      const result = await getOneOrder.execute(orderId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error getting all orders" });
    }
  }

static async delete(req: Request, res: Response)
{
  const deleteOrderUseCase = new DeleteOrderUseCase(orderRepository);
  try {
    const orderId = req.params.id;
    const result = await deleteOrderUseCase.execute(orderId);
    return res.status(200).json(result);
  } catch (error) {
    const apiError = throwErrorOrDefaultMsg(error, 'error in delete order usecase.')
    return res.status(500).json({ message: apiError.message });
  }

}

  static async billOrder(req: Request, res: Response) {
    const billOrderUseCase = new BillOrderUseCase(orderRepository, priceRepository)
    try {
      const orderDTO: OrderDTO = req.body
      const result = await billOrderUseCase.execute(orderDTO);
      return res.status(200).json(result);
    } catch (error) {
      const apiError = throwErrorOrDefaultMsg(error, 'error in bill order usecase.')
      return res.status(500).json({ message: apiError.message });
    }
  }
}