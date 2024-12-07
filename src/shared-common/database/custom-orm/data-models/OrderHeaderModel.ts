import { OrderHeaderDTO } from "../../../../core-layer/order-entry-module/data-transfer-objects/order-entry-dtos";
import { ARGModel, KeyField, TableColumn } from "../orm-decorators";
import { ORM } from "../parent-class-orm";

@ARGModel('OrderHeader')
export class OrderHeaderModel extends ORM implements OrderHeaderDTO{
    @KeyField
    @TableColumn('OrderID')
    orderID: number = 0;  // Primary key
    
    @TableColumn('CustomerID')
    customerID: number = 0;
    
    @TableColumn('OrderDate')
    orderDate: string = '';  // Can default to current date in actual usage
    
    @TableColumn('BilledQtyUom')
    billedQtyUom: number = 0;

    @TableColumn('BilledRevenue')
    billedRevenue: number =0;

    @TableColumn('BilledGallons')
    billedGallons: number = 0;

}
