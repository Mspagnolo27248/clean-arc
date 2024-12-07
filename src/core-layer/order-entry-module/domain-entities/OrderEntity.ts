import { OrderDetailDTO, OrderDTO, OrderHeaderDTO } from "../data-transfer-objects/order-entry-dtos";

export class Order {
  private orderDTO: OrderDTO;


  constructor(orderDTO:OrderDTO) {
      this.orderDTO = orderDTO;
     this.validateOrder();
  }

  // Domain logic: Validate if the order is valid
  private validateOrder(): void {
      if (this.orderDTO.details.length === 0) {
          throw new Error('Order must contain at least one order detail.');
      }

      for (const detail of this.orderDTO.details) {
          if (detail.quantity <= 0) {
              throw new Error('Quantity must be greater than zero for all order details.');
          }
          if (detail.unitPrice <= 0) {
              throw new Error('Unit price must be greater than zero for all order details.');
          }
      }     
  }

  

  // Add an order detail to the order
  addDetail(detail: OrderDetailDTO): void {
      this.orderDTO.details.push(detail);
      this.validateOrder();
  }

  // Remove an order detail by orderDetailID
  removeDetail(orderDetailID: number): void {
      this.orderDTO.details = this.orderDTO.details.filter(detail => detail.orderDetailID !== orderDetailID);   
      this.validateOrder();
  }

  // Get order header information
  getHeader(): OrderHeaderDTO {
    const headers:Partial<OrderDTO>= {...this.orderDTO};
     delete headers.details
      return  headers as OrderHeaderDTO;
  }

  // Get order details
  getDetails(): OrderDetailDTO[] {
      return this.orderDTO.details;
  }

  setBillingInfomation(gallonsFactors:Record<string,{unitsOfMeasureInAContainer:number,gallonsInAContainer:number}>):void{
    for(const detail of this.orderDTO.details){
      const gallonsFactor = gallonsFactors[`${detail.productID}|${detail.containerID}|${detail.uom}`];
      detail.billedQtyUom = detail.quantity * gallonsFactor.unitsOfMeasureInAContainer;
      detail.billedRevenue = detail.billedQtyUom * detail.unitPrice;
      detail.billedGallons = detail.billedQtyUom * gallonsFactor.gallonsInAContainer;
      detail.billedPricePerGallon = detail.billedRevenue / detail.billedGallons;
    }
  }

}

