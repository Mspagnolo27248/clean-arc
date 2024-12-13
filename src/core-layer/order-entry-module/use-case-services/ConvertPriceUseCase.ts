import { PricingRepository } from "../data-access-repository/PricingRepository";
import { RackPriceDto } from "../data-transfer-objects/price-records-dtos";
import { UnitOfMeasureConverterService, UnitOfMeasureConverterServiceReturnType } from "../domain-services/UnitOfMeasureConverterService";

export class ConvertPriceUseCase {
  constructor(private priceRepository: PricingRepository) { }

  public async execute(priceRecord: RackPriceDto): Promise<UnitOfMeasureConverterServiceReturnType> {
    const {productCode,containerCode,price,unitOfMeasure} = priceRecord;
    
    const gallonsFactors = await this.priceRepository.getManyUOMAndGallonFactor();
    const product = await this.priceRepository.getProductById(productCode);
    const convertedPrice = UnitOfMeasureConverterService(
      {
        product: productCode,
        apiGravity: product.apiGravity, 
        container: containerCode,
        uom: unitOfMeasure,
        pricePerUnitOfMeasure: price,
        qtyOfContainers: 1,
      },
      gallonsFactors
    );
    return convertedPrice;
  }
}
