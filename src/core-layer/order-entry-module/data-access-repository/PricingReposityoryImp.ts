import { PriceAgreementModel } from "../../../shared-common/database/custom-orm/data-models/PriceAgreementModel";
import { ProductModel } from "../../../shared-common/database/custom-orm/data-models/ProductModel";
import { RackPriceModel } from "../../../shared-common/database/custom-orm/data-models/RackPriceModel";
import { initializeDb } from "../../../shared-common/database/sqlite";
import { CompositeKeyGenerator } from "../../general/CompositeKeyGenerator";
import { PriceAgreementDto, ProductDto, RackPriceDto } from "../data-transfer-objects/price-records-dtos";
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

  async getAllPriceAgreements(): Promise<PriceAgreementDto[]> {
    try {
      const data  = await PriceAgreementModel.findAll();
      return data;
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }


  async createPriceAgreement(entity: PriceAgreementDto): Promise<PriceAgreementDto> {
    try {
      const data  = await PriceAgreementModel.insert(entity);
      return data;
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  async getProductById(productId: string): Promise<ProductDto> {
    try {
       return await ProductModel.findByKey({productId})
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error getting product by ID: ${error.message}`);
        throw new Error(`Error getting product by ID: ${error.message}`);
      }
      throw new Error(`Error getting product by ID: `);
    } 
  }

  async getAllRackPricing(): Promise<RackPriceDto[]> {
    try {
      const rackPriceRecords = await RackPriceModel.findAll();
      return rackPriceRecords;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error executing getAllRackPricing() ${error.message}`);
      }
      throw new Error("Error executing getAllRackPricing()");
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
      CompositeKeyGenerator.generateKey({
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

  getManyUOMAndGallonFactor( ): Promise<{
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
