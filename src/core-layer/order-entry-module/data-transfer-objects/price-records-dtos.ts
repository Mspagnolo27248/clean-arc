import { UnitOfMeasure } from "../enums/order-entry-enums";


export interface RackPriceDto {
    companyNumber: number;        // RKCONO
    location: string;             // RKLOC
    productCode: string;          // RKPROD
    containerCode: string;        // RKCNTR
    unitOfMeasure: string;        // RKUNMS
    effectiveDate: string;        // RKDATE (formatted as string for readability)
    effectiveTime: number;        // RKTIME
    price: number;                // RKPRCE
    priceTier1: string;           // RKPR02
    priceTier2: string;           // RKPR03
    priceTier3: string;           // RKPR04
    priceTier4: string;           // RKPR05
    minimumQuantity: number;      // RKMINQ
    quantityTier1: number;        // RKQT01
    quantityTier2: number;        // RKQT02
    quantityTier3: number;        // RKQT03
    quantityTier4: number;        // RKQT04
    quantityTier5: number;        // RKQT05
    requiredFlag: string;      // RKRKRQ
    inactiveFlag: string;         // RKINAC 
}

export interface PriceAgreementDto {
productCode: string;
containerCode: string;
customerCode: string;
customerShipTo?: string;
startDate: number;
endDate: number;
}


export interface ProductDto {
    productId: string;
    productName: string;
    apiGravity: number;   
 
}


export interface SpecialPriceDTO {
    
}
