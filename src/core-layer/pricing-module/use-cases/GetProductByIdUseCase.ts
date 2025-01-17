import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { Product } from "../domain-entities/Product";




export class GetProductByIdUseCase implements UseCase {
    pricingRepository:PricingRepository;
    constructor(repository:PricingRepository){
        this.pricingRepository = repository
    }

    async execute(productId:string): Promise<Product> {            
        const dto =  await this.pricingRepository.getProductById(String(productId))
        const productEntity = new Product(dto);    
        return productEntity;
        
    }
}