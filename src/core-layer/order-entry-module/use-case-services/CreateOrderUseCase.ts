import { OrderRepository } from "../data-access-repository/OrderEntryRepository";
import { OrderDTO } from "../data-transfer-objects/order-entry-dtos";
import { AppError } from "../domain-entities/AppError";
import { Order } from "../domain-entities/OrderEntity";

export class CreateOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(orderDTO: OrderDTO,): Promise<OrderDTO> {   
    try {  
      const order = new Order(orderDTO);      
      const createdOrder = await this.orderRepository.createOrder(order);
      const orderHeaders = createdOrder.getHeader();
      const orderDetails = createdOrder.getDetails();
      const createdOrderDTO = {...orderHeaders,details:orderDetails}
      return createdOrderDTO;
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      } else{
        throw new AppError('Error creating order', 500);
      }
     
    }
  }
}
