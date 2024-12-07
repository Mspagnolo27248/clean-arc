


export class DtoMapper{


    static  mapEntityToDTO<T extends object>(entity: T): Partial<T> {
        const dto: Partial<T> = {};
    
        // Get all property names from the instance and its prototype chain
        const propertyNames = [
            ...Object.getOwnPropertyNames(entity), // Instance properties
            ...Object.getOwnPropertyNames(Object.getPrototypeOf(entity)) // Prototype properties (getters, etc.)
        ];
    
        propertyNames.forEach((key) => {
            const descriptor = Object.getOwnPropertyDescriptor(entity, key);
    
            // If the property is a getter (or a regular property)
            if (descriptor && typeof descriptor.get === 'function') {
                // Add getter properties
                dto[key as keyof T] = entity[key as keyof T];
            } else if (typeof entity[key as keyof T] !== 'function') {
                // Add regular properties, but exclude methods (functions)
                dto[key as keyof T] = entity[key as keyof T];
            }
        });
    
        return dto;
    }
}