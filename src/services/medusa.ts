import { TransactionBaseService } from '@medusajs/medusa';
import Medusa from '@medusajs/medusa-js';

class MedusaService extends TransactionBaseService {
  medusaAdmin() {
    return new Medusa({
      baseUrl: process.env.BE_URL,
      maxRetries: 3,
      apiKey: process.env.API_TOKEN,
    });
  }
}

export default MedusaService;
