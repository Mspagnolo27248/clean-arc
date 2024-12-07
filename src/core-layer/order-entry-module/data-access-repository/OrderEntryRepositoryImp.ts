import { OrderDetailModel } from "../../../shared-common/database/custom-orm/data-models/OrderDetail";
import { OrderHeaderModel } from "../../../shared-common/database/custom-orm/data-models/OrderHeaderModel";
import { initializeDb } from "../../../shared-common/database/sqlite";
import { mapInstance } from "../../../shared-common/services/helper-functions/object-mainpulation";
import {
  OrderDTO,
  OrderDetailDTO,
  OrderHeaderDTO,
} from "../data-transfer-objects/order-entry-dtos";
import { AppError } from "../domain-entities/AppError";
import { Order } from "../domain-entities/OrderEntity";
import { OrderRepository } from "./OrderEntryRepository";

export class OrderRepositoryImpl implements OrderRepository {
  async getAllOrders(): Promise<OrderDTO[]> {
    try {
      const db = await initializeDb();
      const HeadertableProperties = OrderHeaderModel.getTableColumns();
      const DetailableProperties = OrderDetailModel.getTableColumns();
      const orderHeaders = await db.all("SELECT * FROM OrderHeader");
      const orderDetails = await db.all("SELECT * FROM OrderDetail");
      const orderDetailModels: OrderDetailDTO[] = [];
      
      for (const order of orderDetails) {
        orderDetailModels.push(
          mapInstance<any, OrderDetailDTO>(order, DetailableProperties)
        );
      }
      const orderMap = new Map<string, any>();
      for (const header of orderHeaders) {
        const mappedHeader = mapInstance<any, OrderHeaderDTO>(
          header,
          HeadertableProperties
        );
        orderMap.set(String(header.OrderID), { ...mappedHeader, details: [] });
      }
      for (const details of orderDetailModels) {
        const orderHeader = orderMap.get(String(details.orderID));
        if (orderHeader) {
          orderMap.set(String(details.orderID), {
            ...orderHeader,
            details: [...orderHeader.details, details],
          });
        }
      }
      return [...orderMap.values()];
    } catch (error) {
      throw new Error("Error Getting Orders");
    }
  }


  async getOneOrder(orderId: string): Promise<OrderDTO> {
    try {  
      const db = await initializeDb();
      const orderHeadersResults: OrderHeaderDTO[] = await db.all(
        `SELECT * FROM OrderHeader where OrderId= ${orderId}`
      );
      const orderHeader = OrderHeaderModel.mapRecordToModel(orderHeadersResults[0],OrderHeaderModel)
      const orderDetailResults: OrderDetailDTO[] = await db.all(
        `SELECT * FROM OrderDetail where OrderId= ${orderId} `
      );
      const orderDetails = orderDetailResults.map(detail=>(OrderDetailModel.mapRecordToModel(detail,OrderDetailModel)));
      return { ...orderHeader, details: orderDetails };
    } catch (error) {
      throw new Error("Error Getting Orders");
    }
  }


  async createOrder(order: Order): Promise<Order> {
    const db = await initializeDb();
    const orderHeader = order.getHeader();
    const orderDetails = order.getDetails();
    let orderId = orderHeader.orderID
    const orderExists = await db.get(`select * from OrderHeader where OrderID = ${orderId}`)
    if (orderExists) throw new Error(`Order Already Exists:${orderId}`)
    const customerExists = await db.get(`select * from CustomerShipTo where CustomerID = '${orderHeader.customerID}'`)
  if(!customerExists)throw new Error(`Customer Does not exist ID:${orderHeader.customerID}`)
    try {         
      await db.exec("BEGIN TRANSACTION");
      const insertHeaderStatement = OrderHeaderModel.insert(orderHeader);
      const headerResult = await db.run(insertHeaderStatement);
      
      if(!headerResult.lastID){
        throw new Error('Error inserting header')
      } 
      orderId = headerResult.lastID;
      const orderDetailsInsertStatments = orderDetails.map(detail=>OrderDetailModel.insert({...detail,orderID:orderId}))
      for (const stmt of orderDetailsInsertStatments) {
        await db.exec(stmt);
      }
      await db.exec("COMMIT");
    } catch (error) {    
      await db.exec("ROLLBACK");  
      if (error instanceof Error) {     
        throw new Error(`Error creating order: ${error.message}`);
      } else {
        throw new Error('Error Creating Order')
      }
    } finally {
      await db.close();
    }
    const createdOrder = await this.getOneOrder(String(orderId))
    return  new Order(createdOrder);
  }


  async deleteOrder(orderId: string): Promise<OrderDTO> {
    const order = await this.getOneOrder(orderId)
    const db = await initializeDb();
    try {      
      await db.run('BEGIN TRANSACTION'); 
      const deleteOrderDetails = await db.run(`DELETE FROM OrderDetail WHERE OrderID = ?`, order.orderID);
      const deleteOrderHeader = await db.run(`DELETE FROM OrderHeader WHERE OrderID = ?`, order.orderID);
      if (!deleteOrderDetails.changes || !deleteOrderHeader.changes) {
          throw new Error('Error with DB transaction deleting records.');
      }  
      await db.run('COMMIT'); 
      return order;
  
  } catch (err) {
      await db.run('ROLLBACK'); 
      throw err; 
  }
  
   

      
  }
  
}

