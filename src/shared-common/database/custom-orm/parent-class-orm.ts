import { swapKeysAndValues } from "../../services/helper-functions/object-mainpulation";
import { initializeDb } from "../sqlite";

//TODO - a table column should use the class name unless specifically has @TableColumn decorator or @Exclude
//TODO -how to handle identity columns and composite keys.

export class ORM {

  static async findAll(this: typeof ORM): Promise<any> {
    const tableName = Reflect.get(this, "tableName");
    const db = await initializeDb();
    const tableRecords = await db.all(`SELECT * FROM ${tableName}`);
    await db.close();
    const resultsAsModels = tableRecords.map((record) =>
      this.mapRecordToModel(record, this)
    );
    return resultsAsModels;
  }


  static async insert<T extends Record<string, any>>(this: typeof ORM,instance: T ): Promise<any> {
    const tableName = Reflect.get(this, "tableName");
    const defaultModel = new this();
    const target = updateTargetValuesFromSource(defaultModel, instance);
    const record = this.mapModelToRecord(target);
    const propertyMap = this.getModelProperties();

    //Extract the properties with identity decordators
    const identityFields = Reflect.get(this.prototype, "identityFields") || [];
    const identityTableFields = identityFields.map((field: string) => propertyMap[field]);

    //Get fields Exclude  Identity Fields
    const tableFields = Object.keys(record)
      .filter((field) => !identityTableFields.includes(field)) // Exclude identity fields
      .join(", ");

    //Get Values Exclude Identity Fields
    const fieldValues = Object.keys(record)
      .filter((field) => !identityTableFields.includes(field)) // Exclude identity fields
      .map((key) => {
        const value = record[key];
        return typeof value === "string" ? `'${value}'` : value;
      });
    const valuesString = fieldValues.join(", ");
    
      //Sqlite Operations
    const sql =  `INSERT INTO ${tableName} (${tableFields}) VALUES (${valuesString})`;
    try{
      const db = await initializeDb();
      const result = await db.run(sql);
      await db.close();
      if(result.lastID){
        return instance
      }
      else{
        throw new Error("Error executing SQL")
      }
      

    }catch(error){
      if(error instanceof Error)
      throw new Error(error.message)
     else{
      throw new Error("Error executing SQL")
    }
  }
 
  }


  static delete<T extends Record<string, any>>(
    this: typeof ORM,
    instance: T
  ): string {
    const keyValues: string[] = [];
    const defaultObject = new this();
    const tableName = Reflect.get(this, "tableName");
    const keyFields = Reflect.get(this.prototype, "keyFields") as [];
    const mappedObject = Object.assign(defaultObject, instance);
    keyFields.forEach((key) => keyValues.push(`${key}=${mappedObject[key]}`));
    const params = keyValues.join(", ");
    const sql = `DELETE FROM ${tableName} WHERE ${params}`;
    return sql;
  }


  static update<T extends Record<string, any>>(
    this: typeof ORM,
    instance: T
  ): string {
    const tableName = Reflect.get(this, "tableName");
    const defaultModel = new this();
    const target = updateTargetValuesFromSource(defaultModel, instance);  
    const record = this.mapModelToRecord(target);
    const propertyMap = this.getModelProperties();
    const identityFields = Reflect.get(this.prototype, "identityFields") || [];
    const identityTableFields = identityFields.map(
      (field: string | number) => propertyMap[field]
    );


    //creates array of strings [keyName='' or keyName=<value>]
    const keyFields = Reflect.get(this.prototype, "keyFields") as []; 
    const keyValues: string[] = [];
    keyFields.forEach((key) =>
      keyValues.push(
        `${key}=${record[key] === "" ? "''" : record[key]}`
      )
    );
    const whereParams = keyValues.join(", ");

    //Creates SQL to Set 
    const setValues: string[] = Object.keys(record).map(
      (key) => `${key}=${record[key] === "" ? "''" : record[key]}`
    );   
    const setParams = setValues.join(", ");

    const sql = `UPDATE ${tableName} SET ${setParams} WHERE ${whereParams}`;
    return sql;
  }


  static upsert<T extends Record<string, any>>(this: typeof ORM,instance: T ): string {
   let insertStatement = this.insert(instance);
   let updateStatment = this.update(instance);
   let conflictStatment = ' ON CONFLICT() DO ' 
   return `${insertStatement} ${conflictStatment} ${updateStatment}`
   }

 //Protected methods 
  protected static getModelProperties(this: typeof ORM) {
    const columns = Reflect.get(this.prototype, "columns") || {};
    return columns;
  }

   static getTableColumns() {
    const columns = this.getModelProperties();
    return swapKeysAndValues(columns);
  }

   static mapRecordToModel<T extends Record<string, any>>(
    this: typeof ORM,
    record: any,
    model: Constructor<T>
  ): T {
    const modelToColumnMapping = this.getModelProperties();
    const instance = new model();
    const keys = Object.keys(instance);

    keys.forEach((key) => {
      if (record.hasOwnProperty(modelToColumnMapping[key])) {
        (instance as any)[key] = record[modelToColumnMapping[key]]; // Map record properties to instance
      }
    });
    return instance;
  }

  protected static mapModelToRecord<T extends Record<string, any>>(
    this: typeof ORM,
    modelInstance: T
  ): Record<string, any> {
    const modelToColumnMapping = this.getModelProperties();
    const record: Record<string, any> = {};

    Object.keys(modelInstance).forEach((key) => {
      const columnName = modelToColumnMapping[key];
      if (columnName) {
        record[columnName] = (modelInstance as any)[key];
      }
    });

    return record;
  }



  static insertSql<T extends Record<string, any>>(this: typeof ORM, instance: T): string {
    const tableName = Reflect.get(this, 'tableName');
    const defaultModel = new this();
    const target = updateTargetValuesFromSource(defaultModel, instance);
    const record = this.mapModelToRecord(target);
    const propertyMap = this.getModelProperties();
    const identityFields = Reflect.get(this.prototype, 'identityFields') || [];
    const identityTableFields = identityFields.map((field: string | number)=>propertyMap[field])
    
    
    const tableFields = Object.keys(record)
        .filter(field => !identityTableFields.includes(field))  // Exclude identity fields
        .join(', ');
    const fieldValues = Object.keys(record)
        .filter(field => !identityTableFields.includes(field))  // Exclude identity fields
        .map(key => {
            const value = record[key];
            return typeof value === 'string' ? `'${value}'` : value;
        });
    
    const valuesString = fieldValues.join(', ');
    return `INSERT INTO ${tableName} (${tableFields}) VALUES (${valuesString})`;
}

}

type Constructor<T> = new (...args: any[]) => T;

function updateTargetValuesFromSource(
  target: Record<string, any>,
  source: Record<string, any>
): Record<string, any> {
  Object.keys(target).forEach((key) => {
    if (key in source) {
      target[key] = source[key];
    }
  });
  return target;
}
