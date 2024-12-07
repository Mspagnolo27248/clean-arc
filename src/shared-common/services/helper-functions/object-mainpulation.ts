


export function getObjectValuesByKeys<U extends Record<string, any>>(object: U, keysToInclude: Array<keyof U>) {
    return keysToInclude.map(key => object[key]);
  }
  

export function innerJoin2ObjectArrays<T extends Object,U extends Object> (
    arr1: T[],
    arr2: U[],
    fieldMappings: [keyof T, keyof U][]
    // fieldMappings: Array<[keyof T, keyof U]>
):Array<T & U>{

//1. Get list of table 2 keys
const table2Keys = fieldMappings.map(item=>item[1]);
const table1Keys = fieldMappings.map(item=>item[0]);

//2. Create a Map of table two, the key will be a string 
const mapOfTable2 = new Map(arr2.map(item=>[getObjectValuesByKeys(item,table2Keys).toString(),item]))

//3. Loop Over table one and retun only the values that exist in both tables. 
const output  = arr1.map(row=>{

    //a. find match in table two
    const valueOfKey = getObjectValuesByKeys(row,table1Keys).toString() //map key
    const table2Match = mapOfTable2.get(valueOfKey)

    //b. if match found return joined object
if(table2Match===undefined) return;

return {
    ...row,
    ...table2Match
}

}).filter(Boolean)  as (T & U)[]

return output
}



export function reduceJoin2ObjectArrays<T extends Object,U extends Object> (
    arr1: T[],
    arr2: U[],
    fieldMappings: [keyof T, keyof U][]
    // fieldMappings: Array<[keyof T, keyof U]>
):Array<T & U>{

//1. Get list of table 2 keys
const table2Keys = fieldMappings.map(item=>item[1]);
const table1Keys = fieldMappings.map(item=>item[0]);

//2. Create a Map of table two, the key will be a string 
const mapOfTable2 = new Map(arr2.map(item=>[getObjectValuesByKeys(item,table2Keys).toString(),item]))

//3. Loop Over table one and retun only the values that exist in both tables. 
const output  = arr1.reduce((joinedRows,row)=>{
    //a. find match in table two
    const valueOfKey = getObjectValuesByKeys(row,table1Keys).toString() //map key
    const table2Match = mapOfTable2.get(valueOfKey)
    //b. if match found return joined object
if(table2Match===undefined) return joinedRows;

joinedRows.push({
    ...row,
    ...table2Match
});
return joinedRows
},[]  as (U&T)[])

return output
}




export async function generateYieldsDict<T>(dto:T[],keyFields:Array<keyof T>):Promise<Record<string,Array<Partial<T>>>>{
    const dtoAccess =  dto.reduce((acc,row)=>{
        const key= keyFields.map(key=>row[key]).join('-')
        if(!acc[key]){
            acc[key] = []
        }
        acc[key].push(row);
        return acc
    },{} as Record<string,Array<T>>)
    return dtoAccess
};



export function aggregateByKey<T extends Record<string, any>>(
    dto: T[],
    row: Array<keyof T>,
    cols: Array<keyof T>,
    value: keyof T,
    keyDelimiter: string = "-"
  ): Record<string, any> {
    const resultMap: Record<string, any> = {};
  
    dto.forEach((item) => {
      const rowKey = row.map((key) => item[key]).join(keyDelimiter);
      const colKey = cols.map((key) => item[key]).join(keyDelimiter);
      const val = item[value];
  
      if (!resultMap[rowKey]) {
        resultMap[rowKey] = {};
      }
  
      if (typeof val === "number") {
        if (!resultMap[rowKey][colKey]) {
          resultMap[rowKey][colKey] = 0;
        }
        resultMap[rowKey][colKey] += val;
      } else {
        if (!resultMap[rowKey][colKey]) {
          resultMap[rowKey][colKey] = 0;
        }
        resultMap[rowKey][colKey]++;
      }
    });
  
    return resultMap;
  }
  


 export  function swapKeysAndValues<T extends Record<string, any>>(obj: T): { [key: string]: keyof T } {
    const swapped: { [key: string]: keyof T } = {};
    
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            swapped[value] = key; // Swap key and value
        }
    }

    return swapped;
}


// Function to map properties from an instance of T to an instance of U
export function mapInstance<T, U>(instance: T, mapping:{}): U {
  const mappedInstance = {} as U;
  const _mapping = mapping as { [K in keyof T]: keyof U }

  for (const key in _mapping) {
      if (mapping.hasOwnProperty(key)) {
          const targetKey = _mapping[key];
          (mappedInstance as any)[targetKey] = (instance as any)[key];
      }
  }

  return mappedInstance;
}



