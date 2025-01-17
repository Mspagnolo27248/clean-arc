import { BaseError } from "../BaseError";




export class DomainError extends BaseError {
    constructor(error:any,fallBackMessage?: string) {
        let message = fallBackMessage||'Domain Error'
        if(error instanceof Error) message = error.message;
        super('DomainError', message);
    }
}



export class ApplicationError extends BaseError {
    constructor(error:any,fallBackMessage?: string) {
        let message = fallBackMessage||'Application Error'
        if(error instanceof Error) message = error.message;
        super('ApplicationError', message);
    }
}



export class InfrastructureError extends BaseError {
    constructor(error:any,fallBackMessage?: string) {
        let message = fallBackMessage||'Infrastructure Error'
        if(error instanceof Error) message = error.message;
        super('InfrastructureError', message);
    }
}