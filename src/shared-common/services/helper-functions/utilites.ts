

export function throwErrorOrDefaultMsg(error:any,alternativeMessage?:string):Error{
    throw error instanceof Error ? error : new Error(`Error:${alternativeMessage}`);
}