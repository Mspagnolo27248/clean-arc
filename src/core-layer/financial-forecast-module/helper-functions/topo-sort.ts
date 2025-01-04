type UnitYield = {
    Charge_ProductCode: string;
    Output_ProductCode: string;
};

export function determineProcessOrder(unityields: UnitYield[]): string[] {
    const graph: Record<string, string[]> = {}; // Adjacency list
    const inDegree: Record<string, number> = {}; // In-degree tracking
    const allProducts = new Set<string>(); // Set of all unique products

    // Step 1: Build the graph and track in-degree
    for (const record of unityields) {
        const charge = record.Charge_ProductCode;
        const output = record.Output_ProductCode;

        // Initialize graph and in-degree
        if (!graph[charge]) graph[charge] = [];
        if (inDegree[charge] === undefined) inDegree[charge] = 0;
        if (inDegree[output] === undefined) inDegree[output] = 0;

        // Add edge from charge to output
        graph[charge].push(output);

        // Increment in-degree for Output_ProductCode
        inDegree[output] += 1;

        // Track all products
        allProducts.add(charge);
        allProducts.add(output);
    }

    // Step 2: Find all products with in-degree 0
    const queue: string[] = [];
    for (const product of allProducts) {
        if (inDegree[product] === 0) {
            queue.push(product);
        }
    }

    // Step 3: Perform topological sorting
    const topologicalOrder: string[] = [];
    const unprocessed = new Set(allProducts); // Track unprocessed nodes

    while (queue.length > 0) {
        const current = queue.shift()!;
        topologicalOrder.push(current);
        unprocessed.delete(current);

        // Process neighbors and reduce their in-degree
        for (const neighbor of graph[current] || []) {
            inDegree[neighbor] -= 1;
            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }

    // If there's an error, show which products weren't processed
    if (topologicalOrder.length !== allProducts.size) {
        console.log("Products that couldn't be ordered:", Array.from(unprocessed));
        console.log("Their in-degrees:", 
            Array.from(unprocessed).reduce((acc, prod) => {
                acc[prod] = inDegree[prod];
                return acc;
            }, {} as Record<string, number>)
        );
        throw new Error("Cycle detected. Cannot determine a valid process order.");
    }

    return topologicalOrder;
}




