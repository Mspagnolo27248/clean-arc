import { ProductDto } from "../../../../core-layer/order-entry-module/data-transfer-objects/price-records-dtos";
import { ARGModel, TableColumn } from "../orm-decorators";
import { ORM } from "../parent-class-orm";


@ARGModel('Product')
export class ProductModel extends ORM implements ProductDto {

    @TableColumn('productId') 
    productId: string ='';

    @TableColumn('productName') 
    productName: string = '';

    @TableColumn('apiGravity') 
    apiGravity: number = 30;


}