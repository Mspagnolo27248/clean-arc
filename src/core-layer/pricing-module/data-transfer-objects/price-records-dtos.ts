


export interface RackPriceDto {
    companyNumber: number;      
    location: string;           
    productCode: string;         
    containerCode: string;       
    unitOfMeasure: string;       
    effectiveDate: string;       
    effectiveTime: number;        
    price: number;               
    priceTier1: string;          
    priceTier2: string;         
    priceTier3: string;           
    priceTier4: string;          
    minimumQuantity: number;     
    quantityTier1: number;        
    quantityTier2: number;        
    quantityTier3: number;       
    quantityTier4: number;       
    quantityTier5: number;       
    requiredFlag: string;      
    inactiveFlag: string;        
}

export interface RackPriceKeys
{
location:string
productCode:string;
containerCode:string;
unitOfMeasure:string;
effectiveDate:string;
effectiveTime:number;
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
    productId: string ;
    productName: string;
    companyNumber: string;
    inactiveDate: number;
    TPPLGR: number;
    productClass: number ;
    productGroup: string ;
    toCompany: number ;
    shortDescription: string ;
    priceClass: string ;
    apiGravity: number ;
    inventoryGroup: string ;
    salesGL: number ;
    abbreviatedDescription: string ;
    sellIndicator: string ;
    viscosityFlowCode: string ;
    isFluid: string ;
    lbsPerGallon?:number;

}
  

