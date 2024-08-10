import { Column, Entity, OneToMany } from 'typeorm';
import {
  // alias the core entity to not cause a naming conflict
  Customer as MedusaCustomer,
} from '@medusajs/medusa';
import { Point } from './point';

@Entity()
export class Customer extends MedusaCustomer {
  @Column()
  username: string;

  @Column()
  role: string;

  @Column()
  avatar: string;

  @Column()
  domain: string;

  @Column({ name: 'woo_customer_id' })
  wooCustomerId: number;

  @Column({type: 'bigint', default: 0})
  point: number;

  @Column({type: 'bigint', default: 0, name : 'total_purchased'})
  totalPurchased: number;

  @OneToMany(()=>Point, point=> point.customer)
  points: Point[];
}
