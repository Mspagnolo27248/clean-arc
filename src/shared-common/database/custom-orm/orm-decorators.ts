
    /*
    //Customer ORM that uses typescript decorators to attach metadata attributes to classes at compile time.
    // These attributes are then accessed during run time with the "ORM" class functions to 
    // perform CRUD operations on a database. 
    */

    export function ARGModel(tableName?: string): ClassDecorator {
      return function(target: any) {
        const name = tableName || target.name;
        Reflect.defineProperty(target,'tableName', {value:name,enumerable:false,writable:false} );
        
      };
    }
  
    
    export function TableColumn(columnName?: string): PropertyDecorator {
      return function(target: any, propertyKey: string | symbol) {
        const columns = Reflect.get(target, 'columns') || {};
        columns[propertyKey] = columnName || propertyKey;
        Reflect.defineProperty(target, 'columns', { value: columns, enumerable: false, writable: false });
      };
    }
  
    
  
    export function KeyField(target: any, propertyKey: string) {
      const keyFields = Reflect.get( target,'keyFields') || [];
      keyFields.push(propertyKey);
      Reflect.defineProperty( target , 'keyFields',{value:keyFields,writable:false});
    }
  
  
  
  
  
  export function IdentityColumn():PropertyDecorator {
    return function(target: any, propertyKey: string|symbol){
    const identityFields = Reflect.get(target, 'identityFields') || [];
    identityFields.push(propertyKey);
    Reflect.defineProperty(target, 'identityFields', { value: identityFields, enumerable: false, writable: false });
    }
  }