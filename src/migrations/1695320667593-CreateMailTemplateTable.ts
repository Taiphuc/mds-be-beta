import { MigrationInterface, QueryRunner } from 'typeorm';
import { generateEntityId } from '@medusajs/utils';

export class CreateMailTemplateTable1695320667593
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mail_template" (
          "id" character varying NOT NULL PRIMARY KEY,
          "action" character varying NULL,
          "subject" character varying NULL,
          "template_normal" text NULL,
          "template_vip" text NULL,
          "is_active" boolean NOT NULL DEFAULT false,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
          )`
    );

    await Promise.all([
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'batch.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'batch.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'batch.canceled');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'batch.pre_processed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'batch.confirmed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'batch.processing');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'batch.completed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'batch.failed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'cart.customer_updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'cart.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'cart.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'claim.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'claim.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'claim.canceled');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'claim.fulfillment_created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'claim.shipment_created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'claim.refund_processed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'claim_item.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'claim_item.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'claim_item.canceled');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'currency.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'customer.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'customer.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'customer.password_reset');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'draft_order.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'draft_order.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'gift_card.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'inventory-item.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'inventory-item.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'inventory-item.deleted');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'inventory-level.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'inventory-level.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'inventory-level.deleted');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'invite.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'note.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'note.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'note.deleted');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.placed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.canceled');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.completed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.orders_claimed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.gift_card_created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.payment_captured');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.payment_capture_failed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.fulfillment_created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.shipment_created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.fulfillment_canceled');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.return_requested');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.items_returned');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.return_action_required');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.refund_created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.refund_failed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order.swap_created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order-edit.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order-edit.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order-edit.canceled');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order-edit.declined');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order-edit.requested');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order-edit.confirmed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order-edit-item-change.CREATED');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order-edit-item-change.DELETED');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'payment.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'payment.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'payment.payment_captured');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'payment.payment_capture_failed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'payment.payment_refund_created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'payment.payment_refund_failed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'payment-collection.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'payment-collection.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'payment-collection.deleted');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'payment-collection.payment_authorized');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'product.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'product.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'product.deleted');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'product-category.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'product-category.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'product-category.deleted');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'product-variant.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'product-variant.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'product-variant.deleted');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'publishable_api_key.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'publishable_api_key.revoked');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'region.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'region.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'region.deleted');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'reservation-item.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'reservation-item.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'reservation-item.deleted');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'sales_channel.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'sales_channel.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'sales_channel.deleted');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'stock-location.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'stock-location.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'stock-location.deleted');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'swap.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'swap.received');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'swap.fulfillment_created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'swap.shipment_created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'swap.payment_completed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'swap.payment_captured');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'swap.payment_capture_failed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'swap.refund_processed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'swap.process_refund_failed');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'order-update-token.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'user.created');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'user.updated');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'user.password_reset');`
      ),
      queryRunner.query(
        `INSERT INTO "mail_template" ("id", "action") values ('${generateEntityId(
          '',
          'mail'
        )}', 'user.deleted');`
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "mail_template"`);
  }
}
