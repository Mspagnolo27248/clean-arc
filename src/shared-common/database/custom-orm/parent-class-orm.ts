
import { swapKeysAndValues } from "../../services/helper-functions/object-mainpulation";
import { initializeDb } from "../sqlite";

/*
Example customer ORM using Sqlite

*/

export class ORM {


  static async findAll<T extends Record<string, any>>(this: typeof ORM): Promise<any> {
    const tableName = this.getTableName();
    const db = await initializeDb();
    const rawTableRecords = await db.all(`SELECT * FROM ${tableName}`);
    await db.close();
    const modelInstances = rawTableRecords.map((record) =>
      this.mapRecordToModel(record, this)
    );
    return modelInstances;
  }


  static async findByKey<T extends Record<string, any>>(filters: Partial<T>): Promise<any> {
    const tableName = this.getTableName();
    if (!filters || Object.keys(filters).length === 0) {
      throw new Error("No filters provided for the search.");
    }

    const keyFields: (keyof T)[] = this.getKeyFields();
    if (!keyFields) {
      throw new Error(`No Key Fields Defined on ${this.name}`)
    }
    const missingKeys = keyFields.filter((key) => !(key in filters));
    if (missingKeys.length > 0) {
      throw new Error(`Missing required key fields in filters: ${missingKeys.join(", ")}`);
    }

    const modelToColumnMapping = this.getModelToTableFieldMap();

    // Construct WHERE clause using key fields
    const criteria: string[] = keyFields.map((key) => {
      const columnName = modelToColumnMapping[key];
      const value = filters[key];
      return `${columnName}=${typeof value === "string" ? `'${value}'` : value}`;
    });
    const whereClause = `WHERE ${criteria.join(" AND ")}`;
    const sql = `SELECT * FROM ${tableName} ${whereClause}`;

    try {
      const db = await initializeDb();
      const rawRecords = await db.all(sql); // Execute the query
      await db.close();
      const modelInstances = rawRecords.map((record) =>
        this.mapRecordToModel(record, this)
      );
      return modelInstances[0] as T; // Return the first matching instance
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database error: ${error.message}`);
      } else {
        throw new Error("Unknown error during database operation.");
      }
    }
  }




  static async insert<T extends Record<string, any>>(instance: T): Promise<any> {
    const tableName = this.getTableName();
    const model = this.instantiateModelFromDTO(instance);
    const identityProperties = this.getIdentityPropeties();
    const modelExcludingIdentyProperties = dropPropertiesFromModel(model, identityProperties)
    const record = this.mapModelToRecord(modelExcludingIdentyProperties);
    const sql = this.generateInsertStatment(tableName, record);

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


  static async delete<T extends Record<string, any>>(instance:T): Promise<T> {
    const tableName = this.getTableName();
    const model = this.instantiateModelFromDTO(instance);
    const keyFields = this.getKeyFields();
    const modelToColumnMapping = this.getModelToTableFieldMap();
    const keyValues: string[] = keyFields.map((key) => {
      const columnName = modelToColumnMapping[key];
      const value = model[key];
      return `${columnName}=${typeof value === "string" ? `'${value}'` : value}`;
    });
    const params = keyValues.join(" AND ");
    const sql = `DELETE FROM ${tableName} WHERE ${params}`;

     try {
      const db = await initializeDb();
      const result = await db.run(sql);
      await db.close();
      const changes = result?.changes ?? 0;
      if (changes > 0) {
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

  static async update<T extends Record<string, any>>(instance: T): Promise<T> {
    const sql = this.updateSQL(instance);
    try {
      const db = await initializeDb();
      const result = await db.run(sql);
      await db.close();
      if (result.changes) {
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



  private static generateWhereClause<T extends Record<string, any>>(record: T) {
    const criteria: string[] = [];
    Object.entries(record).forEach(([key, value]) =>
      criteria.push(`${key}=${typeof value === "string" ? `'${value}'` : value}`)
    );

    const whereParams = criteria.join(" AND ");
    return `WHERE ${whereParams} `
  }


  static async upsert<T extends Record<string, any>>(instance: T): Promise<T> {
    try {     
      return await this.insert(instance);
    } catch (error) {    
      if (error instanceof Error && error.message.includes("constraint")) {      
        return await this.update(instance);
      }    
      throw error;
    }
  }

  //public methods.
  static getTableFieldToModelMap() {
    const columns = this.getModelToTableFieldMap();
    return swapKeysAndValues(columns);
  }

  static mapRecordToModel<T extends Record<string, any>>(record: any, model: Constructor<T>): T {
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

  private static getKeyFields() {
    return Reflect.get(this.prototype, "keyFields") as [];
  }

  private static instantiateModelFromDTO<T extends Record<string, any>>(dto: T) {
    const target = new this();
    const modelWithUpdatedValues = updateTargetValuesFromSource(target, dto);
    return modelWithUpdatedValues;
  }

  private static getIdentityPropeties() {
    return Reflect.get(this.prototype, "identityFields") || [];
  }


  private static generateInsertStatment<T extends Record<string, any>>(tableName: string, record: T) {
    const tableFields = Object.keys(record).join(", ");
    const fieldValues = Object.entries(record).map(([key, value]) => { return typeof value === "string" ? `'${value}'` : value; });
    const valuesString = fieldValues.join(", ");
    return `INSERT INTO ${tableName} (${tableFields}) VALUES (${valuesString})`;
  }

  static insertSql<T extends Record<string, any>>(instance: T): string {
    const tableName = this.getTableName();
    const model = this.instantiateModelFromDTO(instance);
    const identityProperties = this.getIdentityPropeties();
    const modelExcludingIdentyProperties = dropPropertiesFromModel(model, identityProperties)
    const record = this.mapModelToRecord(modelExcludingIdentyProperties);
    const sql = this.generateInsertStatment(tableName, record)
    return sql
  }

  static updateSQL<T extends Record<string, any>>(instance: T): string {
    const tableName = this.getTableName();
    const model = this.instantiateModelFromDTO(instance);
    const identityFields = this.getIdentityPropeties();
    const modelExcludingIdentyFields = dropPropertiesFromModel(model, identityFields)
    const record = this.mapModelToRecord(modelExcludingIdentyFields);
    const keyFields = this.getKeyFields();
    const keysFromModel = filterModelByProperties(model, keyFields)
    const recordKeys = this.mapModelToRecord(keysFromModel);
    const whereClasue = this.generateWhereClause(recordKeys)
    const setValues: string[] = Object.entries(record).map(
      ([key, value]) => `${key}=${typeof value === "string" ? `'${value}'` : value}`
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


function dropPropertiesFromModel<T extends Record<string, any>>(model: T, dropFields: (keyof T)[]): T {
  return Object.fromEntries(
    Object.entries(model).filter(([key]) => !dropFields.includes(key as keyof T))
  ) as T;
}

function filterModelByProperties<T extends Record<string, any>>(model: T, includeFields: (keyof T)[]): T {
  return Object.fromEntries(
    Object.entries(model).filter(([key]) => includeFields.includes(key as keyof T))
  ) as T;
}
