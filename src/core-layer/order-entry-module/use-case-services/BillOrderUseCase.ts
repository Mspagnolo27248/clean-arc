import { OrderRepository } from "../data-access-repository/OrderEntryRepository";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { OrderDTO } from "../data-transfer-objects/order-entry-dtos";
import { Order } from "../domain-entities/OrderEntity";



export class BillOrderUseCase{
    constructor(private orderRepository: OrderRepository,private priceRepository:PricingRepository) {}
    public async execute(orderDTO:OrderDTO):Promise<OrderDTO>{
        const order = new Order(orderDTO);
        const  gallonsFactors = await this.priceRepository.getManyUOMAndGallonFactor(order.getDetails().map(detail=>({productId:detail.productID,containerId:detail.containerID,uoms:detail.uom})));
        //Calculate billedQtyUom
         order.setBillingInfomation(gallonsFactors);

    return Promise.resolve(orderDTO);
    }

    
}
