export abstract class Entity {
    toDTO() {
        const properties = Object.keys(this);
        const dto: Record<string, any> = {};
        for (const key of properties) {
            dto[key] = (this as any)[key];
        }
        return dto as typeof this;
    }
}
