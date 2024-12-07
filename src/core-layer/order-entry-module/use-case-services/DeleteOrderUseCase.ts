import { OrderRepository } from "../data-access-repository/OrderEntryRepository";




export class DeleteOrderUseCase {
    constructor(private orderRepository: OrderRepository) { }

    async execute(id:string){

        try{
        const deletedOrder = this.orderRepository.deleteOrder(id);
        return deletedOrder;
        }
        catch(err){
            throw err
        }

}
}
