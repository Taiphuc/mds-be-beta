import { MedusaRequest, MedusaResponse } from '@medusajs/medusa'

export default async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  res.sendStatus(200)
}
