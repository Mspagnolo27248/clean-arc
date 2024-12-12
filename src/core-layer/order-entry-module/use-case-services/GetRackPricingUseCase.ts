import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { RackPriceDto } from "../data-transfer-objects/price-records-dtos";

export class GetRackPricingUseCase implements UseCase {
    private pricingRepository: PricingRepository;

    constructor(pricingRepository: PricingRepository) {
        this.pricingRepository = pricingRepository;
    }

    // Wrapping the async code in a try-catch block for error handling
    async execute(limit=1000):Promise<RackPriceDto[]> {
        try {
            const data = await this.pricingRepository.getAllRackPricing();

            return data.slice(0,limit);
        } catch (error) {
            // Log the error or handle it as needed
            console.error('Error fetching rack pricing:', error);
            // Optionally, throw a custom error or return a fallback value
            throw new Error('Failed to fetch rack pricing');
        }
    }
}
