import { Entity } from "../../general/Entity";

export class Product extends Entity {
    productId: string;
    productName: string;
    companyNumber: string;
    inactiveDate: number;
    TPPLGR: number;
    productClass: number;
    productGroup: string;
    toCompany: number;
    shortDescription: string;
    priceClass: string;
    apiGravity: number;
    inventoryGroup: string;
    salesGL: number;
    abbreviatedDescription: string;
    sellIndicator: string;
    viscosityFlowCode: string;
    isFluid: string;
    lbsPerGallon:number;

    constructor({
        productId = '',
        productName = '',
        companyNumber = '',
        inactiveDate = 0,
        TPPLGR = 0,
        productClass = 0,
        productGroup = '',
        toCompany = 0,
        shortDescription = '',
        priceClass = '',
        apiGravity = 0,
        inventoryGroup = '',
        salesGL = 0,
        abbreviatedDescription = '',
        sellIndicator = '',
        viscosityFlowCode = '',
        isFluid = ''
    }) {
        super();
        if (typeof productId !== 'string' || typeof productName !== 'string' || typeof companyNumber !== 'string') {
            throw new Error("Invalid data types for ProductModel constructor arguments.");
        }
        this.productId = productId;
        this.productName = productName;
        this.companyNumber = companyNumber;
        this.inactiveDate = parseInt(`${inactiveDate}`);
        this.TPPLGR = TPPLGR;
        this.productClass = productClass;
        this.productGroup = productGroup;
        this.toCompany = toCompany;
        this.shortDescription = shortDescription;
        this.priceClass = priceClass;
        this.apiGravity = parseFloat(`${apiGravity}`);
        this.inventoryGroup = inventoryGroup;
        this.salesGL = salesGL;
        this.abbreviatedDescription = abbreviatedDescription;
        this.sellIndicator = sellIndicator;
        this.viscosityFlowCode = viscosityFlowCode;
        this.isFluid = isFluid;
        this.lbsPerGallon = this.lbsPerGallonFromGravity(this.apiGravity)
    }

    //Example of Domain Logic  "Crititcal Business Rules" 
    private lbsPerGallonFromGravity(apigravity: number) {
        let lbsPerGallon: number;
        const WATER_API: number = 8.3390317
        lbsPerGallon = (141.5000 / (apigravity + 131.5000)) * WATER_API
        const resultRoundedToFourDecimal = Math.round(lbsPerGallon * 10000) / 10000
        return resultRoundedToFourDecimal
    }


}
