
/**
 * Swagger Components
 */
export const swaggerComponents = {
    components: {
      schemas: {
        ModelMetaData: {
          type: "object",
          properties: {
            // Add fields for ModelMetaData here
          },
        },
        ProductsForModelItem: {
          type: "array",
          items: {
            type: "object",
            properties: {
              // Add fields for ProductsForModelItem here
            },
          },
        },
        ProductDateKeys: {
          type: "object",
          properties: {
            // Add fields for ProductDateKeys here
          },
        },
        ProductFormulationsObject: {
          type: "object",
          properties: {
            // Add fields for ProductFormulationsObject here
          },
        },
        UnitProductDateKeys: {
          type: "object",
          properties: {
            // Add fields for UnitProductDateKeys here
          },
        },
        UnitYieldObject: {
          type: "object",
          properties: {
            // Add fields for UnitYieldObject here
          },
        },
        RollForwardOutput: {
          type: "object",
          properties: {
            // Add fields for RollForwardOutput here
          },
        },
        ForecastModelInputs: {
          type: "object",
          properties: {
            ModelMetaData: { $ref: "#/components/schemas/ModelMetaData" },
            ProductsForModelItem: { $ref: "#/components/schemas/ProductsForModelItem" },
            Receipts: { $ref: "#/components/schemas/ProductDateKeys" },
            DailyOpenOrders: { $ref: "#/components/schemas/ProductDateKeys" },
            DailyDemandForecast: { $ref: "#/components/schemas/ProductDateKeys" },
            ProductFormulation: { $ref: "#/components/schemas/ProductFormulationsObject" },
            ScheduleItem: { $ref: "#/components/schemas/UnitProductDateKeys" },
            UnitYieldItem: { $ref: "#/components/schemas/UnitYieldObject" },
          },
        },
        ForecastModelOutputParams: {
          type: "object",
          properties: {
            ModelMetaData: { $ref: "#/components/schemas/ModelMetaData" },
            ProductsForModelItem: { $ref: "#/components/schemas/ProductsForModelItem" },
            Receipts: { $ref: "#/components/schemas/ProductDateKeys" },
            DailyOpenOrders: { $ref: "#/components/schemas/ProductDateKeys" },
            DailyDemandForecast: { $ref: "#/components/schemas/ProductDateKeys" },
            ProductFormulation: { $ref: "#/components/schemas/ProductFormulationsObject" },
            ScheduleItem: { $ref: "#/components/schemas/UnitProductDateKeys" },
            UnitYieldItem: { $ref: "#/components/schemas/UnitYieldObject" },
            Outputs: { $ref: "#/components/schemas/RollForwardOutput" },
          },
        },
      },
    },
  };

