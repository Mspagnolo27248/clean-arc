import { PricingRepository } from "../data-access-repository/PricingRepository";
import { RackPriceDto } from "../data-transfer-objects/price-records-dtos";
import { RackPrice } from "../domain-entities/RackPrice";


export class CreateRackPriceUseCase {

    constructor( private pricingResposity: PricingRepository) {
        this.pricingResposity = pricingResposity; 
    }

   public async execute(rackPriceDto: RackPriceDto): Promise<RackPriceDto> {    
        //Existance Check Master Data
        const product = await this.pricingResposity.getProductById(rackPriceDto.productCode);
        if (!product) {
            throw new Error('Product not found');
        }
        
        return this.pricingResposity.createRackPrice( new RackPrice(rackPriceDto));
    }
}

