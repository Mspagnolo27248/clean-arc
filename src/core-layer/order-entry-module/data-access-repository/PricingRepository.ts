import { PriceAgreementDto, ProductDto, RackPriceDto } from "../data-transfer-objects/price-records-dtos";
import { PriceAgreement } from "../domain-entities/PriceAgreement";




export interface PricingRepository {
    createPriceAgreement(params:PriceAgreement):Promise<PriceAgreement>;
    createRackPrice(rackPrice: RackPriceDto): Promise<RackPriceDto>;
    getProductById(productId: string): Promise<ProductDto>;
    getAllRackPricing(): Promise<RackPriceDto[]> ;
    getAllProducts(): Promise<ProductDto[]>
    getOneUOMAndGallonFactor(productId: string, containerId: string, uom: string): Promise<{unitsOfMeasureInAContainer: number,gallonsInAContainer: number}>;    
    getManyUOMAndGallonFactor(productKeys: { productId: string, containerId: string, uoms: string }[]): Promise<ConversionFactorType>   
    testUpsert(...data:any):any
}

export type ConversionFactorType = Record<string, { unitsOfMeasureInAContainer: number, gallonsInAContainer: number }>

export type UOMAndGallonFactorCompositeKeyType = {
  productId: string, containerId: string, uom: string
}