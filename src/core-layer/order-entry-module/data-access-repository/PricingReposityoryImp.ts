import { ProductModel } from "../../../shared-common/database/custom-orm/data-models/ProductModel";
import { RackPriceModel } from "../../../shared-common/database/custom-orm/data-models/RackPriceModel";
import { initializeDb } from "../../../shared-common/database/sqlite";
import { CompositeKeyGenerator } from "../../general/CompositeKeyGenerator";
import { ProductDto, RackPriceDto } from "../data-transfer-objects/price-records-dtos";
import { PriceAgreement } from "../domain-entities/PriceAgreement";
import { RackPrice } from "../domain-entities/RackPrice";
import { PricingRepository, UOMAndGallonFactorCompositeKeyType } from "./PricingRepository";


export class PricingRepositoryImp implements PricingRepository {
    
  async createRackPrice(rackPriceDto: RackPriceDto): Promise<RackPriceDto> {
    try {
      const results = await RackPriceModel.insert(rackPriceDto);
      return results;
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  // async createRackPrice(rackPriceDto: RackPriceDto): Promise<RackPriceDto> {
  //     const db = await initializeDb();
  //     try {
  //         // Create a RackPrice entity from the DTO
  //         const rackPrice = new RackPrice(rackPriceDto);

  //         // Now insert the rackPrice entity data into the database
  //         let results = await db.run(
  //             `INSERT INTO RackPrice ( ` +
  //             `productId, containerId, rackPricePerUom, effectiveDate, expirationDate, uom, ` +
  //             `priceTier1, priceTier2, priceTier3, priceTier4, minimumQuantity, ` +
  //             `quantityTier1, quantityTier2, quantityTier3, quantityTier4, quantityTier5, ` +
  //             `requiredFlag, inactiveFlag ) ` +
  //             `VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  //             [
  //                 rackPrice.productCode, // Assuming productCode maps to productId
  //                 rackPrice.containerCode, // Assuming containerCode maps to containerId
  //                 rackPrice.unitOfMeasure,
  //                 rackPrice.effectiveDate,
  //                 rackPrice.effectiveTime, // Assuming expirationDate is not directly used
  //                 rackPrice.unitOfMeasure,
  //                 rackPrice.priceTier1,
  //                 rackPrice.priceTier2,
  //                 rackPrice.priceTier3,
  //                 rackPrice.priceTier4,
  //                 rackPrice.minimumQuantity,
  //                 rackPrice.quantityTier1,
  //                 rackPrice.quantityTier2,
  //                 rackPrice.quantityTier3,
  //                 rackPrice.quantityTier4,
  //                 rackPrice.quantityTier5,
  //                 rackPrice.requiredFlag,
  //                 rackPrice.inactiveFlag,
  //             ]
  //         );
  //         if(results.lastID)
  //         {
  //             return rackPriceDto; // Returning the same DTO, or you can return a new DTO after processing
  //         }
  //         else{
  //             throw new Error(`Error creating RackPrice: ${results}`);
  //         }
  //     } catch (error) {
  //         if (error instanceof Error) {
  //             console.error(`Error creating RackPrice: ${error.message}`);
  //             throw new Error(`Error creating RackPrice: ${error.message}`);
  //         }
  //     } finally {
  //         await db.close();
  //     }

  //     throw new Error('Error creating RackPrice');
  // }

  async createPriceAgreement(entity: PriceAgreement): Promise<PriceAgreement> {
    return entity;
  }

  async getProductById(productId: string): Promise<ProductDto> {
    const db = await initializeDb();
    try {
      const product = await db.get(
        "SELECT * FROM Product WHERE productId = ?",
        [productId]
      );
      return product;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error getting product by ID: ${error.message}`);
        throw new Error(`Error getting product by ID: ${error.message}`);
      }
      throw new Error(`Error getting product by ID: `);
    } finally {
      await db.close();
    }
  }

  async getAllRackPricing(): Promise<RackPriceDto[]> {
    const db = await initializeDb();
    try {
      const rackPriceRecords = await RackPriceModel.findAll();
      return rackPriceRecords;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting rackPriceRecords${error.message}`);
      }
      throw new Error("Errpr getting all rackprice records");
    } finally {
      await db.close();
    }
  }

  async getAllProducts(): Promise<ProductDto[]> {
    try {
      const product = await ProductModel.findAll();
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting rackPriceRecords${error.message}`);
      }
      throw new Error("Errpr getting all rackprice records");
    } finally {
    }
  }



  getOneUOMAndGallonFactor(
    productId: string,
    containerId: string,
    uom: string
  ): Promise<{
    unitsOfMeasureInAContainer: number;
    gallonsInAContainer: number;
  }> {
    const key =
      CompositeKeyGenerator.generateKey<UOMAndGallonFactorCompositeKeyType>({
        productId,
        containerId,
        uom,
      });
    const uomAndGallonFactor =
      mockUOMAndGallonFactor[key as keyof typeof mockUOMAndGallonFactor];
    if (!uomAndGallonFactor) {
      throw new Error("UOM and Gallon Factor not found");
    }
    return Promise.resolve(uomAndGallonFactor);
  }

  getManyUOMAndGallonFactor(
    keys: { productId: string; containerId: string; uoms: string }[]
  ): Promise<{
    [key: string]: {
      unitsOfMeasureInAContainer: number;
      gallonsInAContainer: number;
    };
  }> {
    return Promise.resolve(mockUOMAndGallonFactor);
  }
}


//Mock Data
const mockUOMAndGallonFactor: Record<string, { unitsOfMeasureInAContainer: number; gallonsInAContainer: number }> = {
    "7946|846|EA": { unitsOfMeasureInAContainer: 1, gallonsInAContainer: .5548 },
    "7168|464|EA": { unitsOfMeasureInAContainer: 12, gallonsInAContainer: 3 },
    "7730|469|PAL": { unitsOfMeasureInAContainer: 1, gallonsInAContainer: 4.73 },
};
