 interface PriceAgreementParams {
    productCode: string;
    containerCode: string;
    customerCode: string;
    customerShipTo?: string;
    startDate: number;
    endDate: number;
}

export class PriceAgreement {

    #productCode: string;
    #containerCode: string;
    #customerCode: string;
    #customerShipTo?: string;
    #startDate: number;
    #endDate: number;

    constructor(params: PriceAgreementParams) {
        if (!params) {
            throw new Error("PriceAgreementParams object is required.");
        }

        if (typeof params.productCode !== 'string' || params.productCode.trim() === '') {
            throw new Error("productCode must be a non-empty string.");
        }
        this.#productCode = params.productCode;

        if (typeof params.containerCode !== 'string' || params.containerCode.trim() === '') {
            throw new Error("containerCode must be a non-empty string.");
        }
        this.#containerCode = params.containerCode;

        if (typeof params.customerCode !== 'string' || params.customerCode.trim() === '') {
            throw new Error("customerCode must be a non-empty string.");
        }
        this.#customerCode = params.customerCode;

        if (params.customerShipTo && typeof params.customerShipTo !== 'string') {
            throw new Error("customerShipTo must be a string if provided.");
        }
        this.#customerShipTo = params.customerShipTo;

        if (typeof params.startDate !== 'number' || isNaN(params.startDate)) {
            throw new Error("startDate must be a valid number.");
        }
        if (typeof params.endDate !== 'number' || isNaN(params.endDate)) {
            throw new Error("endDate must be a valid number.");
        }
        if (params.startDate >= params.endDate) {
            throw new Error("startDate must be before endDate.");
        }
        this.#startDate = params.startDate;
        this.#endDate = params.endDate;
    }

    // Public property getters
    get productCode(): string {
        return this.#productCode;
    }

    get containerCode(): string {
        return this.#containerCode;
    }

    get customerCode(): string {
        return this.#customerCode;
    }

    get customerShipTo(): string | undefined {
        return this.#customerShipTo;
    }

    get startDate(): number {
        return this.#startDate;
    }

    get endDate(): number {
        return this.#endDate;
    }

    public toDTO(){
        return {id:'blalgld'}
    }
}


