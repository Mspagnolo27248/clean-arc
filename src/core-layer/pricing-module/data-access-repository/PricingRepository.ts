import {ProductDto, RackPriceDto } from "../data-transfer-objects/price-records-dtos";
import { Product } from "../domain-entities/Product";





export interface PricingRepository { 
    getAllRackPricing(): Promise<RackPriceDto[]> ; 
    getRackPriceByKey(keys:Partial<RackPriceDto>): Promise<RackPriceDto>; 
    upsertRackPrice(rackPriceDto: RackPriceDto): Promise<RackPriceDto>
    deleteRackPrice(instance:RackPriceDto): Promise<RackPriceDto>  
    getProductById(productId: string): Promise<ProductDto>; /*these would be in a master data repo here for simplicty*/ 
    getAllProducts(): Promise<ProductDto[]> 

}