import { DtoMapper } from "../../general/DtoMapper";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { PriceAgreementDto } from "../data-transfer-objects/price-records-dtos";
import { AppError } from "../../general/AppError";
import { PriceAgreement } from "../domain-entities/PriceAgreement";

export class CreatePriceAgreementUseCase {
  private pricingRepository: PricingRepository;

  constructor(priceRepository: PricingRepository) {
    this.pricingRepository = priceRepository;
  }
  public async execute(params: PriceAgreementDto) {
    try {
      const entity = new PriceAgreement(params)
      const data = await this.pricingRepository.createPriceAgreement(entity);
      const dto = DtoMapper.mapEntityToDTO(data);
      return dto
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      } else {
        throw new AppError("Error creating order", 500);
      }
    }
  }
}
