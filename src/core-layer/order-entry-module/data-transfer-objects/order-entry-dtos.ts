import { UnitOfMeasure } from "../enums/order-entry-enums";


export interface OrderHeaderDTO{
  orderID: number;  
  customerID: number;
  orderDate: string;
  billedQtyUom?:number;
  billedRevenue?:number;
  billedGallons?:number;

}

export interface OrderDetailDTO {
  orderDetailID: number;  
  orderID: string;  
  productID: string;
  containerID: string;
  quantity: number;
  unitPrice: number;
  uom: UnitOfMeasure;
  billedQtyUom?:number;
  billedRevenue?:number;
  billedGallons?:number;
  billedPricePerGallon?:number;
}



// OrderDTO combines OrderHeaderDTO and includes an additional details array
export interface OrderDTO extends OrderHeaderDTO {
  details: OrderDetailDTO[];
}


export interface CustomerShipToDTO{

  customerShipToId: string;  // Composite key (ShipToID, CustomerID)
    shipToID: string;
    shipToName: string;
    customerID: string;
    customerName: string;
    salespersonID: string;
    salespersonName: string;
    city: string;
    state: string;
    country: string;
    company: string;
}

export interface CustomerDto {
  accountDivision: string;
  companyCode: number;
  customerNumber: number;
  customerName: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  zipCode5: string;
  zipCode9: string;
  zipCode14: string;
  totalDue: number;
  currentDue: number;
  overdue1To10Days: number;
  overdue11To20Days: number;
  overdue21To30Days: number;
  overdueOver30Days: number;
  lastPaymentAmount: number;
  lastPaymentDate: string;
  prepaidAmount: number;
  monthToDateSales: number;
  yearToDateSales: number;
  statementFlag: string;
  financialAdjustmentFlag: string;
  previousBalance: number;
  financialIncrease: number;
  monthlyCreditPeriod: number;
  yearlyCreditPeriod: number;
  creditLimit: number;
  areaCode: number;
  telephoneNumber: string;
  salesPersonNumber: number;
  termsCode: number;
  stateTaxCode: string;
  lastTransactionNumber: number;
  groupCode: string;
  miles: number;
  highBalance: number;
  highBalanceDate: string;
  interestRate: number;
  accountStatus: string;
  referenceNumber: string;
  groupCompany: string;
  groupCustomerNumber: number;
  paymentDate8Digit: string;
  highBalanceDate8Digit: string;
  customerClass: string;
  ediIndicator: string;
  closeBalance: number;
  wireTransferFlag: string;
  federalEIN: string;
  paymentClass: string;
  promotionalCode: string;
  reservedField1: string;
}
