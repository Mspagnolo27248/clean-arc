import { RackPriceDto } from "../../../../core-layer/order-entry-module/data-transfer-objects/price-records-dtos";
import { ARGModel, KeyField, TableColumn } from "../orm-decorators";
import { ORM } from "../parent-class-orm";

@ARGModel('GBBPRCE')
export class RackPriceModel extends ORM implements RackPriceDto {
    @TableColumn('RKCONO')
    companyNumber: number = 0; // RKCONO, initialized with 0

    @TableColumn('RKLOC')
    location: string = ''; // RKLOC, initialized with empty string

    @KeyField
    @TableColumn('RKPROD')
    productCode: string = ''; // RKPROD, initialized with empty string

    @KeyField
    @TableColumn('RKCNTR')
    containerCode: string = ''; // RKCNTR, initialized with 0

    @KeyField
    @TableColumn('RKUNMS')
    unitOfMeasure: string = ''; // RKUNMS, initialized with empty string

    @KeyField
    @TableColumn('RKDATE')
    effectiveDate: string = ''; // RKDATE, initialized with empty string

    @KeyField
    @TableColumn('RKTIME')
    effectiveTime: number = 0; // RKTIME, initialized with 0

    @TableColumn('RKPRCE')
    price: number = 0; // RKPRCE, initialized with 0

    @TableColumn('RKPR02')
    priceTier1: string = ''; // RKPR02, initialized with empty string

    @TableColumn('RKPR03')
    priceTier2: string = ''; // RKPR03, initialized with empty string

    @TableColumn('RKPR04')
    priceTier3: string = ''; // RKPR04, initialized with empty string

    @TableColumn('RKPR05')
    priceTier4: string = ''; // RKPR05, initialized with empty string

    @TableColumn('RKMINQ')
    minimumQuantity: number = 0; // RKMINQ, initialized with 0

    @TableColumn('RKQT01')
    quantityTier1: number = 0; // RKQT01, initialized with 0

    @TableColumn('RKQT02')
    quantityTier2: number = 0; // RKQT02, initialized with 0

    @TableColumn('RKQT03')
    quantityTier3: number = 0; // RKQT03, initialized with 0

    @TableColumn('RKQT04')
    quantityTier4: number = 0; // RKQT04, initialized with 0

    @TableColumn('RKQT05')
    quantityTier5: number = 0; // RKQT05, initialized with 0

    @TableColumn('RKRKRQ')
    requiredFlag: string = ''; // RKRKRQ, initialized with empty string

    @TableColumn('RKINAC')
    inactiveFlag: string = ''; // RKINAC, initialized with empty string
}
