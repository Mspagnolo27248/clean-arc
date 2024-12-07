import { OrderDTO } from "../data-transfer-objects/order-entry-dtos";
import { Order } from "../domain-entities/OrderEntity";

export interface OrderRepository {
  createOrder(order: Order): Promise<Order>;
  
  getAllOrders(): Promise<OrderDTO[]>;

  getOneOrder(orderId: string): Promise<OrderDTO>;
  
  deleteOrder(orderId:string):Promise<OrderDTO>;

}


