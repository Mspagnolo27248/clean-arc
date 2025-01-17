import { Entity } from "../../general/Entity";
import { RackPriceDto } from "../data-transfer-objects/price-records-dtos";
import { UnitOfMeasure } from "../enums/price-record-enums";


export class RackPrice extends Entity {
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
    private rackPricePerGallon?: number;

    constructor(rackPriceDto: RackPriceDto) {
        super();
        this.companyNumber = rackPriceDto.companyNumber;
        this.location = rackPriceDto.location;
        this.productCode = rackPriceDto.productCode;
        this.containerCode = rackPriceDto.containerCode;
        this.unitOfMeasure = rackPriceDto.unitOfMeasure.trim();
        this.effectiveDate = rackPriceDto.effectiveDate;
        this.effectiveTime = rackPriceDto.effectiveTime;
        this.price = rackPriceDto.price;
        this.priceTier1 = rackPriceDto.priceTier1;
        this.priceTier2 = rackPriceDto.priceTier2;
        this.priceTier3 = rackPriceDto.priceTier3;
        this.priceTier4 = rackPriceDto.priceTier4;
        this.minimumQuantity = rackPriceDto.minimumQuantity;
        this.quantityTier1 = rackPriceDto.quantityTier1;
        this.quantityTier2 = rackPriceDto.quantityTier2;
        this.quantityTier3 = rackPriceDto.quantityTier3;
        this.quantityTier4 = rackPriceDto.quantityTier4;
        this.quantityTier5 = rackPriceDto.quantityTier5;
        this.requiredFlag = rackPriceDto.requiredFlag;
        this.inactiveFlag = rackPriceDto.inactiveFlag;

        this.validateUnitOfMeasure();
    }   
    
     private validateUnitOfMeasure(): void {
        if (!Object.values(UnitOfMeasure).includes(this.unitOfMeasure as UnitOfMeasure)) {
            throw new Error(`Invalid unit of measure: ${this.unitOfMeasure}. Must be one of: ${Object.values(UnitOfMeasure).join(", ")}`);
        }
    }
    public setRackPricePerGallon(GallonsPerUom: number): void {
        if (this.unitOfMeasure === UnitOfMeasure.GAL) {
            this.rackPricePerGallon = this.price;
        } else {
            this.rackPricePerGallon = this.price * GallonsPerUom;
        }
    }

    public getRackPricePerGallon(): number {
        if (this.rackPricePerGallon === undefined) {
            throw new Error('Rack price per gallon is not set');
        }
        return this.rackPricePerGallon;
    }
}
