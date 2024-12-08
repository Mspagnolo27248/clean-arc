
import { CustomerDto } from "../../../../core-layer/order-entry-module/data-transfer-objects/order-entry-dtos";
import { ARGModel, TableColumn } from "../orm-decorators";
import { ORM } from "../parent-class-orm";

@ARGModel('GARCUST')
export class CustomerAccountModel extends ORM implements CustomerDto{
    @TableColumn('ARDEL') 
    accountDivision: string = '';

    @TableColumn('ARCO') 
    companyCode: number = 10;

    @TableColumn('ARCUSN') 
    customerNumber: number = 0;

    @TableColumn('ARNAME') 
    customerName: string = '';

    @TableColumn('ARADR1') 
    addressLine1: string = '';

    @TableColumn('ARADR2') 
    addressLine2: string = '';

    @TableColumn('ARADR3') 
    addressLine3: string = '';

    @TableColumn('ARADR4') 
    addressLine4: string = '';

    @TableColumn('ARZIP5') 
    zipCode5: string = '';

    @TableColumn('ARZIP9') 
    zipCode9: string = '';

    @TableColumn('ARZP14') 
    zipCode14: string = '';

    @TableColumn('ARTOTD') 
    totalDue: number = 0;

    @TableColumn('ARCURD') 
    currentDue: number = 0;

    @TableColumn('AR0110') 
    overdue1To10Days: number = 0;

    @TableColumn('AR1120') 
    overdue11To20Days: number = 0;

    @TableColumn('AR2130') 
    overdue21To30Days: number = 0;

    @TableColumn('AROV30') 
    overdueOver30Days: number = 0;

    @TableColumn('ARPYMT') 
    lastPaymentAmount: number = 0;

    @TableColumn('ARPDAT') 
    lastPaymentDate: string = '';

    @TableColumn('ARPREP') 
    prepaidAmount: number = 0;

    @TableColumn('ARMTDS') 
    monthToDateSales: number = 0;

    @TableColumn('ARYTDS') 
    yearToDateSales: number = 0;

    @TableColumn('ARSTMT') 
    statementFlag: string = '';

    @TableColumn('ARFINA') 
    financialAdjustmentFlag: string = '';

    @TableColumn('ARPBAL') 
    previousBalance: number = 0;

    @TableColumn('ARFINC') 
    financialIncrease: number = 0;

    @TableColumn('ARMCPD') 
    monthlyCreditPeriod: number = 0;

    @TableColumn('ARYCPD') 
    yearlyCreditPeriod: number = 0;

    @TableColumn('ARCLMT') 
    creditLimit: number = 0;

    @TableColumn('ARAREA') 
    areaCode: number = 0;

    @TableColumn('ARTELE') 
    telephoneNumber: string = '';

    @TableColumn('ARSLSN') 
    salesPersonNumber: number = 0;

    @TableColumn('ARTERM') 
    termsCode: number = 0;

    @TableColumn('ARSTAX') 
    stateTaxCode: string = '';

    @TableColumn('ARLSTN') 
    lastTransactionNumber: number = 0;

    @TableColumn('ARGRUP') 
    groupCode: string = '';

    @TableColumn('ARMILS') 
    miles: number = 0;

    @TableColumn('ARHIBL') 
    highBalance: number = 0;

    @TableColumn('ARHIDT') 
    highBalanceDate: string = '';

    @TableColumn('ARINTR') 
    interestRate: number = 0;

    @TableColumn('ARSTAT') 
    accountStatus: string = '';

    @TableColumn('AREFT') 
    referenceNumber: string = '';

    @TableColumn('ARGCO') 
    groupCompany: string = '';

    @TableColumn('ARGCUS') 
    groupCustomerNumber: number = 0;

    @TableColumn('ARPDA8') 
    paymentDate8Digit: string = '';

    @TableColumn('ARHID8') 
    highBalanceDate8Digit: string = '';

    @TableColumn('ARCUCL') 
    customerClass: string = '';

    @TableColumn('AREDI') 
    ediIndicator: string = '';

    @TableColumn('ARCLPB') 
    closeBalance: number = 0;

    @TableColumn('ARWIRE') 
    wireTransferFlag: string = '';

    @TableColumn('ARFEIN') 
    federalEIN: string = '';

    @TableColumn('ARPMCL') 
    paymentClass: string = '';

    @TableColumn('ARPRMV') 
    promotionalCode: string = '';

    @TableColumn('ARF001') 
    reservedField1: string = '';
}
