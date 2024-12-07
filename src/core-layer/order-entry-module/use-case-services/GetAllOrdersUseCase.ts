import { OrderRepository } from "../data-access-repository/OrderEntryRepository"
import { OrderDTO } from "../data-transfer-objects/order-entry-dtos";
import { Order } from "../domain-entities/OrderEntity";

export  class GetAllOrdersUseCase{

    constructor(private orderRepository:OrderRepository){}

    public async execute():Promise<OrderDTO[]>{
        return this.orderRepository.getAllOrders();
    }
}
