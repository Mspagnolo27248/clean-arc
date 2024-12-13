import { ARGModel, TableColumn } from "../orm-decorators";
import { ORM } from "../parent-class-orm";


export class GGSCTUM extends ORM {
    @TableColumn('CUDEL')
    actionIndicator: string = '';

    @TableColumn('CUCONO')
    companyNumber: number = 10;

    @TableColumn('CUPROD')
    productCode: string = '';

    @TableColumn('CUCNTR')
    countryCode: string = '';

    @TableColumn('CUUNMS')
    unitOfMeasure: string = '';

    @TableColumn('CUOPER')
    operationCode: string = '';

    @TableColumn('CUCVFA')
    conversionFactor: number = 1.0;

    @TableColumn('CUHAZM')
    isHazardous: string = 'N';

    @TableColumn('CUIUM')
    internalUnitOfMeasure: string = '';

    @TableColumn('CUFEGL')
    featureLogic: number = 0;

    @TableColumn('CUF001')
    additionalFeature: string = '';
}
