
type Factory<T> = () => T;

// Define a map of keys to their corresponding types
interface DependencyMap {
  [key: string]: any;
}

export class DIContainer<T extends DependencyMap = {}> {
  private factories = new Map<keyof T, Factory<any>>();

  // Register a factory for a dependency
  register<K extends keyof T>(key: K, factory: Factory<T[K]>) {
    this.factories.set(key, factory);
  }

  // Resolve a dependency by its key
  resolve<K extends keyof T>(key: K): T[K] {
    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`Dependency "${String(key)}" is not registered`);
    }
    return factory();
  }
}


