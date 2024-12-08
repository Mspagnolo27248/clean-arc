import { PricingRepositoryImp } from "./core-layer/order-entry-module/data-access-repository/PricingReposityoryImp";
import { CustomerAccountModel } from "./shared-common/database/custom-orm/data-models/CustomerModel";
import { RackPriceModel } from "./shared-common/database/custom-orm/data-models/RackPriceModel";


const pricingRepository = new PricingRepositoryImp();

 async function getFromPersitance(){
   const data  = await CustomerAccountModel.findAll();
   console.log(data)

 }
 
 getFromPersitance();

// const data =  async ()=> await RackPriceModel.update(
//     {
        
//             companyNumber: 10,
//             location: '001',
//             productCode: '4319',
//             containerCode: '283',
//             unitOfMeasure: 'GAL',
//             effectiveDate: '20230330',
//             effectiveTime: 1,
//             price: 1.99,
//             priceTier1: '0.0000',
//             priceTier2: '0.0000',
//             priceTier3: '0.0000',
//             priceTier4: '0.0000',
//             minimumQuantity: 0,
//             quantityTier1: 0,
//             quantityTier2: 0,
//             quantityTier3: 0,
//             quantityTier4: 0,
//             quantityTier5: 0,
//             requiredFlag:  '',
//             inactiveFlag: 'I'
          
//     }
// );

// data().then(d=>console.log(d))
;
