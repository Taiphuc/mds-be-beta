import { generateEntityId } from '@medusajs/medusa';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MailTemplate } from './mail-template';

@Entity('segment')
export class Segment extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  condition: string;

  @Column({ name: 'is_active', type: 'boolean', default: false})
  isActive: boolean;

  @Column({ name: 'time_type' })
  timeType: string;

  @Column({ name: 'time_value' })
  timeValue: number;

  @Column({ name: 'mail_to' })
  mailTo: string;

  @Column({ name: 'mail_subject' })
  mailSubject: string;

  @Column({ name: 'mail_heading' })
  mailHeading: string;

  @Column({ name: 'mail_preheader' })
  mailPreheader: string;

  @Column({ name: 'mail_content' })
  mailContent: string;

  @Column({ name: 'template_normal_id' })
  templateNormalId: string;

  @Column({ name: 'template_vip_id' })
  templateVipId: string;

  @ManyToOne(() => MailTemplate, (mailTemplate) => mailTemplate.id, {
    cascade: true,
  })
  @JoinColumn({ name: 'template_normal_id' })
  mailTemplateNormal: MailTemplate;

  @ManyToOne(() => MailTemplate, (mailTemplate) => mailTemplate.id, {
    cascade: true,
  })
  @JoinColumn({ name: 'template_vip_id' })
  mailTemplateVip: MailTemplate;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @BeforeInsert()
  beforeInsert(): void {
    this.id = generateEntityId('', 'seg');
  }
}
