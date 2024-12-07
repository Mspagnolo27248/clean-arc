
import { DtoMapper } from "../general/DtoMapper";
import {PriceAgreement } from "../order-entry-module/domain-entities/PriceAgreement"


const  postedPriceAgreement = {
productCode:'4315',
containerCode:'460',
customerCode:'255',
customerShipTo:'800',
startDate:20240104,
endDate:20241231
}



const priceAgreement = new PriceAgreement(postedPriceAgreement)

const productCode  = priceAgreement.productCode;

console.log(JSON.stringify(priceAgreement));

const priceDTO = DtoMapper.mapEntityToDTO(priceAgreement)

console.log(JSON.stringify(priceDTO));












