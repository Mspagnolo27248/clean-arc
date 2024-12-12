import { PricingRepository } from "../data-access-repository/PricingRepository";

export class GetAllPriceAgreements {
  private pricingRepository: PricingRepository;
  constructor(pricingRepository: PricingRepository) {
    this.pricingRepository = pricingRepository;
  }

  async execute(limit: number = 1000) {
    try {
      const data = await this.pricingRepository.getAllPriceAgreements();
      return data.slice(0, limit);
    } catch (error) {
      // Log the error or handle it as needed
      console.error("Error fetching rack pricing:", error);
      // Optionally, throw a custom error or return a fallback value
      throw new Error("Failed to fetch rack pricing");
    }
  }
}
