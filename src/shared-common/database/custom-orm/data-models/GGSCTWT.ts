import { ARGModel, TableColumn } from "../orm-decorators";
import { ORM } from "../parent-class-orm";

@ARGModel('GGSCTWT')
export class GGSCTWT extends ORM {
    @TableColumn('WTDEL')
    actionIndicator: string = '';

    @TableColumn('WTCONO')
    companyNumber: number = 10;

    @TableColumn('WTPROD')
    productCode: string = '';

    @TableColumn('WTCNTR')
    countryCode: string = '';

    @TableColumn('WTGROS')
    grossWeight: number = 0;

    @TableColumn('WTTARE')
    tareWeight: number = 0;

    @TableColumn('WTNET')
    netWeight: number = 0;

    @TableColumn('WTGAL')
    gallons: number = 0;

    @TableColumn('WTF001')
    additionalFeature: string = '';
}
