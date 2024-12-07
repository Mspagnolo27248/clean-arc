import { OrderRepository } from "../data-access-repository/OrderEntryRepository";
import { OrderDTO } from "../data-transfer-objects/order-entry-dtos";

export class GetOneOrderUseCase{

    constructor(private orderRepository:OrderRepository){}

    public async execute(orderId:string):Promise<OrderDTO>{
        return this.orderRepository.getOneOrder(orderId);
    }
}