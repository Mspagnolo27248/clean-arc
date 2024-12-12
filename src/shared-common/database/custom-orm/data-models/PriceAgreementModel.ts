import { PriceAgreementDto } from "../../../../core-layer/order-entry-module/data-transfer-objects/price-records-dtos";
import { ARGModel, KeyField, TableColumn } from "../orm-decorators";
import { ORM } from "../parent-class-orm";

@ARGModel('GBICUAG')
export class PriceAgreementModel extends ORM implements PriceAgreementDto {

    @TableColumn('BADEL') 
    delete: string = '';

    @TableColumn('BACONO') 
    companyCode: number = 0;

    @KeyField
    @TableColumn('BACUST') 
    customerCode: string = '';

    @KeyField
    @TableColumn('BALOC') 
    location: string = '';

    @KeyField
    @TableColumn('BAPR01') 
    productCode: string = '';

    // @TableColumn('BAPR02') 
    // product2: string = '';

    // @TableColumn('BAPR03') 
    // product3: string = '';

    // @TableColumn('BAPR04') 
    // product4: string = '';

    // @TableColumn('BAPR05') 
    // product5: string = '';

    // @TableColumn('BAPR06') 
    // product6: string = '';

    // @TableColumn('BAPR07') 
    // product7: string = '';

    // @TableColumn('BAPR08') 
    // product8: string = '';

    // @TableColumn('BAPR09') 
    // product9: string = '';

    // @TableColumn('BAPR10') 
    // product10: string = '';

    @KeyField
    @TableColumn('BASTDT') 
    startDate: number = 0;

    @TableColumn('BASTTM') 
    startTime: number = 0;

    @TableColumn('BAENDT') 
    endDate: number = 0;

    @TableColumn('BAENTM') 
    endTime: number = 0;

    @TableColumn('BAF004') 
    filler4: number = 0.0;

    @TableColumn('BAPRCE') 
    price: string = '';

    @TableColumn('BAF005') 
    filler5: number = 0.0;

    @TableColumn('BAOFFP') 
    offRack: number = 0;

    @TableColumn('BAMNQY') 
    minQuantity: number = 0;

    @TableColumn('BAMXQY') 
    maxQuantity: number = 0;

    @TableColumn('BAPPD') 
    paymentPeriod: string = '';

    @TableColumn('BAALSH') 
    allShipTo: string = '';

    @TableColumn('BAF001') 
    filler1: string = '';

    @TableColumn('BAPRIM') 
    priceAtInventory: string = '';

    @TableColumn('BAF002') 
    filler2: string = '';

    @TableColumn('BASTD8') 
    startDate8Digit: number = 0;

    @TableColumn('BAEND8') 
    endDate8Digit: number = 0;

    @TableColumn('BADELV') 
    delivery: string = '';

    @TableColumn('BAFRCD') 
    freightCode: string = '';

    @TableColumn('BACRDT') 
    creationDate: number = 0;

    @TableColumn('BACRTM') 
    creationTime: number = 0;

    @TableColumn('BALUDT') 
    lastUpdateDate: number = 0;

    @TableColumn('BALUTM') 
    lastUpdateTime: number = 0;

    @TableColumn('BACNTR') 
    containerCode: string = '';

    @TableColumn('BASHIP')
    shipTo: string = '';

    @TableColumn('BACNTN') 
    contractNumber: number = 0;

    @TableColumn('BAUNMS') 
    unitMeasurement: string = '';

    @TableColumn('BASEQN') 
    sequenceNumber: number = 0;

    @TableColumn('BAPORD') 
    purchaseOrder: number = 0;

    @TableColumn('BAPOOR') 
    purchaseOrderOriginal: number = 0;

    @TableColumn('BAF003') 
    filler3: string = '';
}
