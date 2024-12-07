

export class CompositeKeyGenerator {

static generateKey<T extends Record<string, any>>(instanceOfType:T): string {
    const key = Object.values(instanceOfType).reduce((property,current)=>property.toString()+current.toString());
    return key;
  }
}