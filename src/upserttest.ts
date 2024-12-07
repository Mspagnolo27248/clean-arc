import { PricingRepositoryImp } from "./core-layer/order-entry-module/data-access-repository/PricingReposityoryImp";


const pricingRepository = new PricingRepositoryImp();

const data = pricingRepository.testUpsert(
    {
        
            companyNumber: 10,
            location: '001',
            productCode: '102V',
            containerCode: '283',
            unitOfMeasure: 'GAL',
            effectiveDate: '20230330',
            effectiveTime: 1,
            price: 0,
            priceTier1: '0.0000',
            priceTier2: '0.0000',
            priceTier3: '0.0000',
            priceTier4: '0.0000',
            minimumQuantity: 0,
            quantityTier1: 0,
            quantityTier2: 0,
            quantityTier3: 0,
            quantityTier4: 0,
            quantityTier5: 0,
            requiredFlag:  '',
            inactiveFlag: 'I'
          
    }
);

console.log(data)