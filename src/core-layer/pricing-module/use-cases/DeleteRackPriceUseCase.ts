import { PricingRepository } from "../data-access-repository/PricingRepository";
import { RackPriceDto } from "../data-transfer-objects/price-records-dtos";



export class DeleteRackPriceUseCase {

    constructor( private pricingResposity: PricingRepository) {
        this.pricingResposity = pricingResposity; 
    }

   public async execute(rackPriceDto: RackPriceDto): Promise<RackPriceDto> {          
        return this.pricingResposity.deleteRackPrice(rackPriceDto);
    }
}

