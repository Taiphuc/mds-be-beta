import { ProductOption, ProductVariant, TransactionBaseService } from "@medusajs/medusa";
import ProductRepository from "@medusajs/medusa/dist/repositories/product";
import { Product } from "../models/product";
import { EntityManager, In } from "typeorm";

type InjectedDependencies = {
    manager: EntityManager;
    productRepository: typeof ProductRepository;
};

class ProductV2Service extends TransactionBaseService {
    protected productRepository_: typeof ProductRepository;

    constructor({ productRepository, manager }: InjectedDependencies) {
        super(arguments[0]);
        this.productRepository_ = manager.withRepository(productRepository);
    }

    async listProducts(limit: number, offset: number, q: string) {
        let search = ""
        if (q.length > 0)
            search = `AND p.title LIKE '%${q}%'`

        const query =
            `WITH 
                variant_prices AS (
                    SELECT
                        v.id as variant_id,
                        COALESCE(
                            jsonb_agg(
                                jsonb_build_object(
                                    'id', m.id,
                                    'amount', m.amount,
                                    'currency_code', m.currency_code
                                )
                            ) FILTER (WHERE v.id IS NOT NULL), '[]'::jsonb
                        ) as prices
                    FROM product_variant v
                    LEFT JOIN product_variant_money_amount vm ON v.id = vm.variant_id
                    LEFT JOIN money_amount m ON vm.money_amount_id = m.id
                    GROUP BY v.id
                )
                SELECT 
                    p.id, p.title, p.subtitle, p.description, p.rating, p.thumbnail, 
                    p.collection_id, p.sold_count, p.metadata, 
                    p.created_at, p.updated_at, p.deleted_at,
                    p.handle, p.status, p.is_giftcard,
                    COALESCE(
                        jsonb_agg(
                            jsonb_build_object(
                                'variant_id', v.id, 
                                'variant_title', v.title,
                                'variant_rank', v.variant_rank,
                                'inventory_quantity', v.inventory_quantity,
                                'prices', vp.prices
                                )
                        ) FILTER (WHERE v.id IS NOT NULL),
                        '[]'::jsonb
                    ) as variants
                FROM product p
                LEFT JOIN product_variant v ON p.id = v.product_id
                LEFT JOIN variant_prices vp ON v.id = vp.variant_id
                WHERE p.status = 'published' AND p.is_giftcard = false AND p.deleted_at is null ${search}
                GROUP BY p.id
                ORDER BY p.created_at DESC
                LIMIT ${limit} OFFSET ${offset};`

        return this.manager_.query(query)
    }

    async retrieve(productId: string) {
        const query = `
        WITH 
        option_values AS (
            SELECT 
                o.product_id,
                o.title as option_title,
                COALESCE(
                    jsonb_agg(
                        jsonb_build_object(
                            'id', ov.id, 
                            'value', ov.value,
                            'option_id', ov.option_id,
                            'variant_id', ov.variant_id,
                            'metadata', ov.metadata
                        )
                    ) FILTER (WHERE ov.variant_id IS NOT NULL), '[]'::jsonb
                ) as values
            FROM product_option o
            JOIN product_option_value ov ON o.id = ov.option_id
            GROUP BY o.product_id, o.title
        ),
        variant_prices AS (
            SELECT
                v.id as variant_id,
                COALESCE(
                    jsonb_agg(
                        jsonb_build_object(
                            'id', m.id,
                            'amount', m.amount,
                            'currency_code', m.currency_code
                        )
                    ) FILTER (WHERE v.id IS NOT NULL), '[]'::jsonb
                ) as prices
            FROM product_variant v
            JOIN product_variant_money_amount vm ON v.id = vm.variant_id
            JOIN money_amount m ON vm.money_amount_id = m.id
            GROUP BY v.id
        )
        SELECT 
            p.id, p.title, p.subtitle, p.description, p.rating, p.thumbnail, 
            p.collection_id, p.sold_count, p.metadata, 
            p.created_at, p.updated_at, p.deleted_at,
            p.handle, p.status, p.is_giftcard,
            COALESCE(
                jsonb_agg(
                    DISTINCT jsonb_build_object(
                        'variant_id', v.id, 
                        'variant_title', v.title,
                        'variant_rank', v.variant_rank,
                        'inventory_quantity', v.inventory_quantity,
                        'prices', vp.prices
                    )
                ) FILTER (WHERE v.id IS NOT NULL),
                '[]'::jsonb
            ) as variants,
            COALESCE(
                jsonb_agg(
                    DISTINCT jsonb_build_object(
                        'id', i.id,
                        'url', i.url, 
                        'metadata', i.metadata
                    )
                ) FILTER (WHERE i.id IS NOT NULL),
                '[]'::jsonb
            ) as images,
            COALESCE(
                jsonb_agg(
                    DISTINCT jsonb_build_object(
                        'id', o.product_id, 
                        'title', o.option_title,
                        'values', o.values
                    )
                ) FILTER (WHERE o.product_id IS NOT NULL),
                '[]'::jsonb
            ) as options
        FROM product p
        JOIN product_variant v ON p.id = v.product_id
        JOIN variant_prices vp ON v.id = vp.variant_id
        LEFT JOIN product_variant_images vi ON v.id = vi.variant_id
        LEFT JOIN image i ON vi.image_id = i.id
        JOIN option_values o ON p.id = o.product_id
        WHERE p.id = '${productId}' 
            AND p.status = 'published' 
            AND p.is_giftcard = false 
            AND p.deleted_at is null 
        GROUP BY p.id
        ORDER BY p.updated_at DESC;
        `

        return this.manager_.query(query)
    }

    async getByHandle(handle: string) {
        const query = `
        WITH 
        option_values AS (
            SELECT 
                o.product_id,
                o.id as option_id,
                o.title as option_title,
                COALESCE(
                    jsonb_agg(
                        jsonb_build_object(
                            'id', ov.id, 
                            'value', ov.value,
                            'option_id', ov.option_id,
                            'variant_id', ov.variant_id,
                            'metadata', ov.metadata
                        )
                    ) FILTER (WHERE ov.variant_id IS NOT NULL), '[]'::jsonb
                ) as values
            FROM product_option o
            JOIN product_option_value ov ON o.id = ov.option_id
            GROUP BY o.product_id, o.title, o.id
        ),
        variant_prices AS (
            SELECT
                v.id as variant_id,
                COALESCE(
                    jsonb_agg(
                        jsonb_build_object(
                            'id', m.id,
                            'amount', m.amount,
                            'currency_code', m.currency_code
                        )
                    ) FILTER (WHERE v.id IS NOT NULL), '[]'::jsonb
                ) as prices
            FROM product_variant v
            JOIN product_variant_money_amount vm ON v.id = vm.variant_id
            JOIN money_amount m ON vm.money_amount_id = m.id
            GROUP BY v.id
        )
        SELECT 
            p.id, p.title, p.subtitle, p.description, p.rating, p.thumbnail, 
            p.collection_id, p.sold_count, p.metadata, 
            p.created_at, p.updated_at, p.deleted_at,
            p.handle, p.status, p.is_giftcard,
            COALESCE(
                jsonb_agg(
                    DISTINCT jsonb_build_object(
                        'variant_id', v.id, 
                        'variant_title', v.title,
                        'variant_rank', v.variant_rank,
                        'inventory_quantity', v.inventory_quantity,
                        'prices', vp.prices,
                        'options', o.values
                    )
                ) FILTER (WHERE v.id IS NOT NULL),
                '[]'::jsonb
            ) as variants,
            COALESCE(
                jsonb_agg(
                    DISTINCT jsonb_build_object(
                        'id', i.id,
                        'url', i.url, 
                        'metadata', i.metadata
                    )
                ) FILTER (WHERE i.id IS NOT NULL),
                '[]'::jsonb
            ) as images,
            COALESCE(
                jsonb_agg(
                    DISTINCT jsonb_build_object(
                        'id', o.option_id,
                        'product_id', o.product_id, 
                        'title', o.option_title,
                        'values', o.values
                    )
                ) FILTER (WHERE o.product_id IS NOT NULL),
                '[]'::jsonb
            ) as options
        FROM product p
        JOIN product_variant v ON p.id = v.product_id
        JOIN variant_prices vp ON v.id = vp.variant_id
        LEFT JOIN product_variant_images vi ON v.id = vi.variant_id
        LEFT JOIN image i ON vi.image_id = i.id
        JOIN option_values o ON p.id = o.product_id
        WHERE p.handle = '${handle}' 
            AND p.status = 'published' 
            AND p.is_giftcard = false 
            AND p.deleted_at is null 
        GROUP BY p.id
        ORDER BY p.updated_at DESC
        LIMIT 1;
        `

        return this.manager_.query(query)
    }

    async deleteMany(productIds: string[]) {
        try {
            const result = await this.manager_.transaction(async transactionalEntityManager => {
                const productRepository = transactionalEntityManager.getRepository(Product);
                const productVariantRepository = transactionalEntityManager.getRepository(ProductVariant);
                const productOptionRepository = transactionalEntityManager.getRepository(ProductOption)

                await productRepository.update({ id: In(productIds) }, { deleted_at: new Date() })
                await productVariantRepository.update({ product_id: In(productIds) }, { deleted_at: new Date() })
                await productOptionRepository.update({ product_id: In(productIds) }, { deleted_at: new Date() })

                return true
            })
            return result
        } catch (err) {
            return false
        }
    }
}

export default ProductV2Service;