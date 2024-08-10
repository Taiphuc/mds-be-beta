import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateDataSettingCrossSell1704724556810 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    INSERT INTO settings ("key", "value", "scope", "type")
    VALUES 
        ( 'header_text', 'Related Product', 'store', 'crossSell'),
        ( 'order_by', 'created_at', 'store', 'crossSell'),
        ( 'order', 'DESC', 'store', 'crossSell'),
        ( 'get_by_tag', '1', 'store', 'crossSell'),
        ( 'get_by_color', '0', 'store', 'crossSell'),
        ( 'get_by_best_sell', '0', 'store', 'crossSell'),
        ( 'get_by_newest', '0', 'store', 'crossSell'),
        ( 'get_by_collection', '0', 'store', 'crossSell'),
        ( 'get_by_category', '0', 'store', 'crossSell'),
        ( 'get_by_viewed', '0', 'store', 'crossSell'),
        ( 'get_by_buy', '0', 'store', 'crossSell');
        ( 'hidden_products', null, 'store', 'crossSell');
        ( 'hidden_categories', null, 'store', 'crossSell');
        ( 'number_product_display', null, 'store', 'crossSell');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM settings WHERE type IN ('crossSell');
    `);
  }
}
