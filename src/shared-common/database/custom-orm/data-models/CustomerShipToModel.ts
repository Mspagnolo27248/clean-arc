import { CustomerShipToDTO } from "../../../../core-layer/order-entry-module/data-transfer-objects/order-entry-dtos";
import { ARGModel, TableColumn } from "../orm-decorators";
import { ORM } from "../parent-class-orm";


@ARGModel('CustomerShipTo')
export class CustomerShipToModel extends ORM implements CustomerShipToDTO {
    @TableColumn('CustomerShipToId')
    customerShipToId: string = '';  // Composite key (ShipToID, CustomerID)
    
    @TableColumn('ShipToID')
    shipToID: string = '';
    
    @TableColumn('')
    shipToName: string = '';
    
    @TableColumn('')
    customerID: string = '';
    
    @TableColumn('')
    customerName: string = '';
    
    @TableColumn('')
    salespersonID: string = '';
    
    @TableColumn('')
    salespersonName: string = '';
    
    @TableColumn('')
    city: string = '';
    
    @TableColumn('')
    state: string = '';
    
    @TableColumn('')
    country: string = '';
    
    @TableColumn('')
    company: string = '';

}