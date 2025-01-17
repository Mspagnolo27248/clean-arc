import { AppError } from "../../general/AppError";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { RackPriceDto } from "../data-transfer-objects/price-records-dtos";
import { RackPrice } from "../domain-entities/RackPrice";


export class CreateRackPriceUseCase {

    constructor(private pricingResposity: PricingRepository) {
        this.pricingResposity = pricingResposity;
    }


    public async execute(rackPriceDto: RackPriceDto): Promise<RackPrice> {

        //Validate the Fields inputs based on Application Busienss Rules
        this.validateInputs(rackPriceDto);

        //Existance Check Master Data (we would check all key master data prod,cont,cust,etc...)
        const product = await this.pricingResposity.getProductById(rackPriceDto.productCode);
        if (!product) {
            throw new Error('Product not found');
        }

        //Database interactions abstracted via Data-Access-Repo Interface
        const record = await this.pricingResposity.upsertRackPrice(rackPriceDto);

        //Convert DTO to Domain Entity runs the Domain specific business rules. --Use-case should return Entity incase there are dynamically created fields. ie. CUR/FUT/CF
        const entity = new RackPrice(record);
        return entity

    }


    private validateInputs(rackPriceDto: RackPriceDto): void {
        const today = new Date();
        const effectiveDate = this.parseYYYYMMDDToDate(`${rackPriceDto.effectiveDate}`);

        // Business Rule: Price should be within the range
        if (!(rackPriceDto.price > 0.01 && rackPriceDto.price < 99.0)) {
            throw new AppError('Rack price must be between 0.01 and 99.0');
        }

        // Business Rule: Effective date must be in the future
        if (effectiveDate <= today) {
            throw new AppError('Effective date must be greater than today');
        }

        // Business Rule: Effective time must be between 0 and 2400
        if (!(rackPriceDto.effectiveTime >= 0 && rackPriceDto.effectiveTime <= 2400)) {
            throw new AppError('Effective time must be between 0 and 2400');
        }

        // Business Rule: Minimum quantity must be non-negative
        if (rackPriceDto.minimumQuantity < 0) {
            throw new AppError('Minimum quantity cannot be negative');
        }

        // Business Rule: Required flag should be "Y" or "N"
        // if (!['Y', 'N'].includes(rackPriceDto.requiredFlag)) {
        //     throw new Error('Required flag must be "Y" or "N"');
        // }

        // Business Rule: Inactive flag should be "Y" or "N"
        // if (!['Y', 'N'].includes(rackPriceDto.inactiveFlag)) {
        //     throw new Error('Inactive flag must be "Y" or "N"');
        // }
    }

    private parseYYYYMMDDToDate(yyyymmdd: string): Date {
        if (!/^\d{8}$/.test(yyyymmdd)) {
            throw new Error('Invalid format. Expected YYYYMMDD.');
        }

        const year = parseInt(yyyymmdd.substring(0, 4), 10);
        const month = parseInt(yyyymmdd.substring(4, 6), 10) - 1; // Months are 0-indexed in JavaScript
        const day = parseInt(yyyymmdd.substring(6, 8), 10);

        return new Date(year, month, day);
    }
}

