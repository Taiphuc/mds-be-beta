import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('settings')
export class Settings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @Column({comment:"admin or store"})
  scope: string;

  @Column({comment: "settings for ... (ex: sms, review, ...)"})
  type: string;
}
