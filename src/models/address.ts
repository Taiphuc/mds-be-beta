import { Column, Entity } from 'typeorm';
import {
  // alias the core entity to not cause a naming conflict
  Address as MedusaAddress,
} from '@medusajs/medusa';

@Entity()
export class Address extends MedusaAddress {
  @Column()
  email: string;

  @Column()
  state: string;
}
