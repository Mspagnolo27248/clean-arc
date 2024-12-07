// src/cache/MasterDataCache.ts



class MasterDataCache {
    private static instance: MasterDataCache;
    private cache: Map<string, Map<string, any>>;

    // Private constructor to prevent direct instantiation
    private constructor() {
        this.cache = new Map();
    }

    // Accessor for the singleton instance
    public static getInstance(): MasterDataCache {
        if (!MasterDataCache.instance) {
            MasterDataCache.instance = new MasterDataCache();
        }
        return MasterDataCache.instance;
    }

    // Load master data into the cache from the database
    public async loadCacheData(cacheData:cacheData): Promise<void> {
        for(const table of Object.entries(cacheData)){
            this.cache.set(table[0], new Map(table[1].map((item) => [item.id, item])));
        }
        // Store each dataset as a Map for constant-time access
    }

    // Get data from the cache
    public get(table: string): Map<string, any> | undefined {
        return this.cache.get(table);
    }

    // Check if a key exists within a specific table using Map.has for O(1) lookup
    public checkIfExists(table: string, key: string): boolean {
        const dataSet = this.cache.get(table);
        return dataSet ? dataSet.has(key) : false;
    }

    // Schedule daily cache refresh
    // public scheduleDailyRefresh(): void {
    //     schedule('0 0 * * *', async () => {
    //         console.log('Refreshing cache...');
    //         await this.loadCacheData();
    //         console.log('Cache refreshed.');
    //     });
    // }
}

export default MasterDataCache;


type cacheData = {[table:string]:[{[table:string]:any}]};

