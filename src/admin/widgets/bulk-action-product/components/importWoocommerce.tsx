import React, {useState, useEffect} from 'react';
import {message, Upload, Modal, Radio, Table, Tag} from 'antd';
import {ArrowUpTray, Plus} from "@medusajs/icons";
import Papa from 'papaparse';
import {Button} from "@medusajs/ui";
import {
    useAdminProducts,
    useAdminCreateProduct,
    useAdminCreateProductCategory,
    useAdminProductCategories
} from "medusa-react";
import styled from "styled-components";

const {Dragger} = Upload;

const UploadCustom: any = styled(Dragger)`
    .ant-upload-drag-icon {
        display: flex;
        justify-content: center;
    }

    :where(.css-dev-only-do-not-override-dkbvqv).ant-upload-wrapper .ant-upload-list .ant-upload-list-item {
        font-size: 16px;
        text-align: center;
    }
`

type PropsModal = {
    open: boolean;
    onClose: () => void;
    notify: any;
};

const plainOptions = [
    {label: 'Medusa', value: 'Medusa', disabled: true},
    {label: 'Woocommerce', value: 'Woocommerce'},
    {label: 'Shopify', value: 'Shopify', disabled: true},
];

const publishOptions = [
    {label: 'Publish', value: 'Publish'},
    {label: 'Un publish', value: 'unPublish'},
];

const ModalImportWoocommerce = ({open, onClose, notify}: PropsModal) => {
    const [listProduct, setListProduct] = useState<any[]>([]);
    const [platform, setPlatform] = useState<string>('Woocommerce');
    const [isPublish, setIsPublish] = useState<string>('unPublish');
    const [dataFile, setDataFile] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [importProgress, setImportProgress] = useState<any[]>([]);
    const {refetch} = useAdminProducts();
    const createProduct = useAdminCreateProduct();
    const {
        product_categories,
    } = useAdminProductCategories()
    const createCategory = useAdminCreateProductCategory()


    useEffect(() => {
        setListProduct([])
        setPlatform('Woocommerce')
        setIsPublish('unPublish')
        setDataFile(null)
    }, [open]);


    useEffect(() => {
        if (dataFile) {
            parseCSV(dataFile, setListProduct);
        }
    }, [dataFile, isPublish]);

    const handleRemove = () => {
        setDataFile(null)
        setListProduct([])
    };

    const handleBeforeUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                setDataFile(e.target.result.toString())
            }
        };
        reader.readAsText(file);
        return false; // Prevents the default upload behavior
    };

    const props = {
        multiple: false,
        onRemove: handleRemove,
        beforeUpload: handleBeforeUpload,
    };

    const createProducts = async (products: any[]) => {
        setIsLoading(true);
        setImportProgress(products.map(product => ({
            title: product.title,
            imageStatus: 'Pending',
            productStatus: 'Pending'
        })));

        const productPromises = products.map(async (product, index) => {
            const updatedImages = await Promise.all(product.images.map(async (image: string) => {
                try {
                    const response = await fetch(`${process.env.BE_URL || "http://localhost:9000"}/admin/media/upload-from-url`, {
                        credentials: "include",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({url: image}),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to upload image urrl: ${response.statusText}`);
                    }

                    const infoImage = await response.json();


                    // const res: any = await uploadUrl({ url: image });
                    updateImportProgress(index, 'imageStatus', 'Success');
                    return infoImage.url;
                } catch (error) {
                    updateImportProgress(index, 'imageStatus', 'Failed');
                    return image;
                }
            }));

            let categories = [];

            if (product_categories && product.list_categories) {
                for (const category of product.list_categories) {
                    if (product_categories.some((c) => c.name === category)) {
                        const itemSuccess = product_categories.find((itemCategory) => itemCategory?.name === category)
                        if (itemSuccess) {
                            categories.push({id: itemSuccess.id});
                        }
                    } else {
                        try {
                            await createCategory.mutateAsync({
                                name: category
                            }, {
                                onSuccess: ({product_category}) => {
                                    categories.push({id: product_category.id});
                                }
                            })
                        } catch (error) {
                        }
                    }
                }
            }

            const updatedProduct = {...product, images: updatedImages, categories: categories};

            delete updatedProduct.list_categories

            if (index === products.length - 1) {
                try {
                    await createProduct.mutateAsync(updatedProduct, {
                        onSuccess: (data) => {
                            updateImportProgress(index, 'productStatus', 'Success');
                        },
                    });
                } catch (error) {
                    updateImportProgress(index, 'productStatus', 'Failed');
                }
            } else {
                try {
                    const response = await fetch(`${process.env.BE_URL || "http://localhost:9000"}/admin/products`, {
                        credentials: "include",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedProduct),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to create product: ${response.statusText}`);
                    }

                    await response.json();
                    updateImportProgress(index, 'productStatus', 'Success');
                } catch (error) {
                    updateImportProgress(index, 'productStatus', 'Failed');
                }
            }
        });

        await Promise.all(productPromises);

        notify.success("Success", 'Import file   successfully!');
        refetch();
        setIsLoading(false);
    };

    const updateImportProgress = (index: number, key: string, value: string) => {
        setImportProgress(prev => {
            const newProgress = [...prev];
            newProgress[index][key] = value;
            return newProgress;
        });
    };

    const parseCSV = (csv: string, setListProduct: React.Dispatch<React.SetStateAction<any[]>>) => {
        Papa.parse(csv, {
            header: true,
            complete: (results) => {
                const resultsData = results.data;
                const products: any = {};
                const attributeValues: any = {};

                resultsData.forEach((row: any) => {
                    if (row.Type === 'variable') {
                        const options = [];
                        for (let i = 1; i <= 10; i++) {
                            const attributeName = row[`Attribute ${i} name`];
                            if (attributeName) {
                                const values = [];
                                if (row[`Attribute ${i} value(s)`]) {
                                    const attributeValue = row[`Attribute ${i} value(s)`].split(',').map((value: string) => value.trim());
                                    attributeValue.forEach((value: string) => {
                                        values.push({
                                            value: value,
                                            metadata: attributeName.toLowerCase() === "color" ? {
                                                hex: value
                                            } : null
                                        });
                                    });
                                }
                                options.push({
                                    title: attributeName,
                                    // values: values
                                });
                                if (!attributeValues[attributeName]) {
                                    attributeValues[attributeName] = new Set();
                                }
                            }
                        }

                        const images = row.Images ? row.Images.split(',').map((url: string) => url.trim()) : [];

                        const tags = row.Tags ? row.Tags.split(',').map((value: string) => {
                            return {"value": value.trim()}
                        }) : [];

                        const listCategories = row.Categories ? row.Categories.split(',').map((url: string) => url.trim()) : [];


                        products[row.SKU] = {
                            title: row.Name,
                            type: row['Product Type'] ? {"value": row['Product Type']} : null,
                            description: row.Description,
                            is_giftcard: false,
                            discountable: true,
                            options: options,
                            status: isPublish === "Publish" ? "published" : "draft",
                            variants: [],
                            list_categories: listCategories,
                            images: images,
                            tags: tags,
                        };
                    } else if (row.Type === 'variation') {
                        const product = products[row.Parent];
                        if (product) {
                            const variantOptions = [];
                            for (let i = 1; i <= product.options.length; i++) {
                                const attributeNameKey = `Attribute ${i} name`;
                                if (attributeNameKey in row) {
                                    const attributeValue = row[`Attribute ${i} value(s)`] || '';
                                    variantOptions.push({value: attributeValue});
                                }
                            }

                            product.variants.push({
                                title: row.Name,
                                inventory_quantity: 10000,
                                prices: [
                                    {
                                        amount: Math.round(parseFloat(row['Regular price']) * 100),
                                        currency_code: 'USD',
                                    },
                                ],
                                options: variantOptions,
                            });
                        }
                    }
                });
                setListProduct(Object.values(products));
            },
            error: (error) => {
                message.error('Error parsing CSV file: ' + error.message);
            }
        });
    };

    const onConfirmImport = () => {
        // console.log(listProduct)
        createProducts(listProduct)
    };

    const columns = [
        {title: 'Product Title', dataIndex: 'title', key: 'title'},
        {
            title: 'Image Upload Status',
            dataIndex: 'imageStatus',
            key: 'imageStatus', render: (text) => <Tag
                color={text === "Pending" ? 'yellow' : text === "Success" ? "green" : "red"}>{text}</Tag>
        },
        {
            title: 'Product Creation Status',
            dataIndex: 'productStatus',
            key: 'productStatus',
            render: (text) => <Tag
                color={text === "Pending" ? 'yellow' : text === "Success" ? "green" : "red"}>{text}</Tag>
        }
    ];

    return (
        <Modal title="BULK IMPORT" onCancel={onClose} open={open} footer={null}>
            <div style={{margin: "24px 0 16px", display: "flex"}}>
                <div style={{marginRight: "8px"}}>Select .CSV file from</div>
                <Radio.Group options={plainOptions} value={platform} onChange={(e) => setPlatform(e.target.value)}/>
            </div>
            <div style={{margin: "24px 0 16px", display: "flex"}}>
                <div style={{marginRight: "8px"}}>Select status publish</div>
                <Radio.Group options={publishOptions} value={isPublish} onChange={(e) => {
                    setIsPublish(e.target.value)
                }}/>
            </div>
            <UploadCustom maxCount={1} {...props}>
                <p className="ant-upload-drag-icon">
                    <ArrowUpTray/>
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Only csv files are supported. Uploading company data or other information is strictly prohibited.
                </p>
            </UploadCustom>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px'}}>
                <Button isLoading={isLoading} disabled={listProduct.length === 0} variant="primary"
                        onClick={onConfirmImport}>
                    <Plus/>
                    Confirm Import
                </Button>
            </div>
            {listProduct.length > 0 && <Table
                dataSource={importProgress}
                columns={columns}
                rowKey="title"
                pagination={false}
                style={{marginTop: '24px', maxHeight: "300px", overflow: "scroll"}}
            />}
        </Modal>
    );
};

export default ModalImportWoocommerce;