import { ConversionFactorType } from "../data-access-repository/PricingRepository";
import { UnitOfMeasure } from "../enums/order-entry-enums";

export type UnitOfMeasureConverterServiceReturnType = {
   qtyInGallons:number,
    qtyInUnitsOfMeasure:number,
    totalDollars:number,
    pricePerGallon:number,

}


export function UnitOfMeasureConverterService(
    inputsToConvert: { product: string, apiGravity: number, container: string, uom: string, pricePerUnitOfMeasure: number, qtyOfContainers: number },
    conversionFactors: ConversionFactorType
): UnitOfMeasureConverterServiceReturnType
{   
    const {product,apiGravity,container,uom,pricePerUnitOfMeasure,qtyOfContainers} = inputsToConvert;
    let qtyInGallons:number;
    let qtyInUnitsOfMeasure:number;    
    const conversions = conversionFactors[`${product}|${container}|${uom}`];
    const lbsPerGallon = lbsPerGallonFromGravity(apiGravity);
    
    switch(uom){
        case UnitOfMeasure.GAL:
            qtyInGallons = 1 * qtyOfContainers
            qtyInUnitsOfMeasure = 1 * qtyOfContainers;
            break;
        case UnitOfMeasure.LI:
            qtyInGallons = 1 * qtyOfContainers
            qtyInUnitsOfMeasure = 1 * qtyOfContainers * 3.78541;
            break;
        case UnitOfMeasure.ML:
            qtyInGallons = 1 * qtyOfContainers
            qtyInUnitsOfMeasure = 1 * qtyOfContainers * 3785.41;
            break;
        case UnitOfMeasure.LBS:
            qtyInGallons = 1 * qtyOfContainers
            qtyInUnitsOfMeasure = 1* qtyOfContainers*lbsPerGallon;
            break;            
        case UnitOfMeasure.OZ:
            qtyInGallons = 1 * qtyOfContainers
            qtyInUnitsOfMeasure = (1* qtyOfContainers/128) * lbsPerGallon;
            break;
        case UnitOfMeasure.KG:
            qtyInGallons = 1 * qtyOfContainers
            qtyInUnitsOfMeasure = 1* qtyOfContainers*lbsPerGallon*2.20462;
            break;       
        case UnitOfMeasure.EA:
            qtyInGallons = qtyOfContainers * conversions.gallonsInAContainer;
            qtyInUnitsOfMeasure = qtyOfContainers * conversions.unitsOfMeasureInAContainer;
            break;
        default:
            qtyInGallons = 1
            qtyInUnitsOfMeasure = 1;
            break;        
    }

    const  totalDollars = qtyInUnitsOfMeasure * pricePerUnitOfMeasure;
    const pricePerGallon = totalDollars / qtyInGallons;       
    
    return {
        qtyInGallons,
        qtyInUnitsOfMeasure,
        totalDollars,
        pricePerGallon
    }
}


function lbsPerGallonFromGravity(apigravity:number){
    let lbsPerGallon:number;
    const WATER_API:number = 8.3390317
    lbsPerGallon = (141.5000/(apigravity+131.5000))*WATER_API
    const resultRoundedToFourDecimal = Math.round(lbsPerGallon*10000)/10000
    return resultRoundedToFourDecimal
}
