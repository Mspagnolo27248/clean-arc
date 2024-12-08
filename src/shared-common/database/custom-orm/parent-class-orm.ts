import { swapKeysAndValues } from "../../services/helper-functions/object-mainpulation";
import { initializeDb } from "../sqlite";

//TODO - a table column should use the class name unless specifically has @TableColumn decorator or @Exclude
//TODO -how to handle identity columns and composite keys.

export class ORM {

  static async findAll(this: typeof ORM): Promise<any> {
    const tableName = this.getTableName();
    const db = await initializeDb();
    const rawTableRecords = await db.all(`SELECT * FROM ${tableName}`);
    await db.close();
    const modelInstances = rawTableRecords.map((record) =>
      this.mapRecordToModel(record, this)
    );
    return modelInstances;
  }

  
  static async insert<T extends Record<string, any>>(instance: T): Promise<any> {
    const tableName = this.getTableName();
    const model = this.instantiateModelFromDTO(instance);
    const identityProperties = this.getIdentityPropeties();
    const modelExcludingIdentyProperties = dropPropertiesFromModel(model,identityProperties)
    const record = this.mapModelToRecord(modelExcludingIdentyProperties); 
    const sql = this.generateInsertStatment(tableName,record);

    try {
      const db = await initializeDb();
      const result = await db.run(sql);
      await db.close();
      if (result.lastID) {
        return instance;
      } else {
        throw new Error("Error executing SQL");
      }
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else {
        throw new Error("Error executing SQL");
      }
    }
  }


  static delete<T extends Record<string, any>>(instance: T): string {   
    const tableName = this.getTableName();   
    const model = this.instantiateModelFromDTO(instance);
    const keyFields = this.getKeyFields();
    const keyValues: string[] = [];
    keyFields.forEach((key) => keyValues.push(`${key}=${model[key]}`));
    const params = keyValues.join(", ");
    const sql = `DELETE FROM ${tableName} WHERE ${params}`;
    return sql;
  }

  static update<T extends Record<string, any>>(instance: T): string {
   return this.updateSQL(instance);
  }
  


  private static generateWhereClause<T extends Record<string, any>>(record:T){  
    const criteria: string[] = []; 
    Object.entries(record).forEach(([key,value]) =>
      criteria.push(`${key}=${value === "" ? "''" : value}`)
    );
    const whereParams = criteria.join(", ");
    return  `WHERE ${whereParams} `
  }

  static findOne<T extends Record<string,any>>(keys:Partial<T>){
    const fieldNames = this.getTableFieldToModelMap();
    const keyFields:string[] = this.getKeyFields();
    const keyValues = Object.entries(keys).reduce((acc,[key,value])=>{ 
      if(keyFields.includes(key)){
        acc.push(value)
      }
     return acc;
  },[] as [string,any][]);

  `SELECT `
}

  static upsert<T extends Record<string, any>>(instance: T ): string {
    const keyFields = this.getKeyFields();
    const record = this.findAll
    let insertStatement = this.insert(instance);
    let updateStatment = this.update(instance);
    let conflictStatment = " ON CONFLICT() DO ";
    return `${insertStatement} ${conflictStatment} ${updateStatment}`;
  }

  //public methods.
  static getTableFieldToModelMap() {
    const columns = this.getModelToTableFieldMap();
    return swapKeysAndValues(columns);
  }

  static mapRecordToModel<T extends Record<string, any>>(record: any,model: Constructor<T>): T {
    const modelToColumnMapping = this.getModelToTableFieldMap();
    const instance = new model();
    const keys = Object.keys(instance);
    keys.forEach((key) => {
      if (record.hasOwnProperty(modelToColumnMapping[key])) {
        (instance as any)[key] = record[modelToColumnMapping[key]]; // Map record properties to instance
      }
    });
    return instance;
  }

  static mapModelToRecord<T extends Record<string, any>>(modelInstance: T): Record<string, any> {
    const modelToColumnMapping = this.getModelToTableFieldMap();
    const record: Record<string, any> = {};
    Object.keys(modelInstance).forEach((key) => {
      const columnName = modelToColumnMapping[key];
      if (columnName) {
        record[columnName] = (modelInstance as any)[key];
      }
    });
    return record;
  }


  //Protected methods
  private static getModelToTableFieldMap(this: typeof ORM) {
    const columns =
      Reflect.get(this.prototype, "columns") ||
      {}; /* {'proper1':'tableFiel1'} */
    return columns;
  }

  private static getTableName() {
    return Reflect.get(this, "tableName");
  }

  private static getKeyFields(){
    return Reflect.get(this.prototype, "keyFields") as [];
  }

  private static instantiateModelFromDTO<T extends Record<string, any>>(dto: T) {
    const target = new this();
    const modelWithUpdatedValues = updateTargetValuesFromSource(target, dto);
    return modelWithUpdatedValues;
  }

  private static getIdentityPropeties(){
    return Reflect.get(this.prototype, "identityFields") || [];
  }


  private static generateInsertStatment<T extends Record<string,any>>(tableName:string,record:T){
    const tableFields = Object.keys(record).join(", ");
    const fieldValues = Object.entries(record).map(([key,value]) => {return typeof value === "string" ? `'${value}'` : value;});
    const valuesString = fieldValues.join(", ");
    return `INSERT INTO ${tableName} (${tableFields}) VALUES (${valuesString})`;
  }

  static insertSql<T extends Record<string, any>>(instance: T): string {
    const tableName = this.getTableName();
    const model = this.instantiateModelFromDTO(instance);
    const identityProperties = this.getIdentityPropeties();
    const modelExcludingIdentyProperties = dropPropertiesFromModel(model,identityProperties)
    const record = this.mapModelToRecord(modelExcludingIdentyProperties); 
    const sql = this.generateInsertStatment(tableName,record)
    return sql
  }

  static updateSQL<T extends Record<string, any>>(instance: T): string {
  const tableName = this.getTableName();
  const model = this.instantiateModelFromDTO(instance);
  const identityFields = this.getIdentityPropeties();
  const modelExcludingIdentyFields = dropPropertiesFromModel(model,identityFields)
  const record = this.mapModelToRecord(modelExcludingIdentyFields);
  const keyFields = this.getKeyFields();
  const keysFromModel = filterModelByProperties(model,keyFields)
  const recordKeys = this.mapModelToRecord(keysFromModel);
  const whereClasue = this.generateWhereClause(recordKeys)
  const setValues: string[] = Object.keys(record).map(
  (key) => `${key}=${record[key] === "" ? "''" : record[key]}`
  );
  const setParams = setValues.join(", ");

  const sql = `UPDATE ${tableName} SET ${setParams} ${whereClasue}`;
  return sql;
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


function dropPropertiesFromModel<T extends Record<string, any>>(model: T,dropFields: (keyof T)[]): T {
return Object.fromEntries(
Object.entries(model).filter(([key]) => !dropFields.includes(key as keyof T))
) as T;
}

function filterModelByProperties<T extends Record<string, any>>(model: T,includeFields: (keyof T)[]): T {
return Object.fromEntries(
Object.entries(model).filter(([key]) => includeFields.includes(key as keyof T))
) as T;
}
