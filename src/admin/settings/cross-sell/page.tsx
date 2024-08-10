import type {SettingConfig} from "@medusajs/admin";
import {Spinner, Tag} from "@medusajs/icons";
import BackButton from "../../components/shared/back-button";
import BodyCard from "../../components/shared/body-card";
import Spacer from "../../components/shared/spacer";
import {useAdminCustomQuery, useAdminCustomPost, useAdminProducts, useAdminProductCategories} from "medusa-react";
import {Button, Switch, Table, Toaster, useToast} from "@medusajs/ui";
import {Select, Input} from 'antd';
import {useState, useEffect, useMemo} from "react";
import {SETTING_TYPES} from "../../types/settings";

const product_fields = [
    {value: "title", label: "Title"},
    {value: "subtitle", label: "Subtitle"},
    {value: "handle", label: "Handle"},
    {value: "rating", label: "Review Rating"},
    {value: "sold_count", label: "Best sold"},
    {value: "created_at", label: "Created time"},
    {value: "updated_at", label: "Updated time"},
];

export type CrossSellRes = {
    get_by_tag: {
        value: string;
        id: number;
    };
    get_by_color: {
        value: string;
        id: number;
    };
    get_by_best_sell: {
        value: string;
        id: number;
    };
    get_by_newest: {
        value: string;
        id: number;
    };
    get_by_collection: {
        value: string;
        id: number;
    };
    get_by_viewed: {
        value: string;
        id: number;
    };
    get_by_buy: {
        value: string;
        id: number;
    };
    header_text: {
        value: string;
        id: number;
    };
    order_by: {
        value: string;
        id: number;
    };
    order: {
        value: string;
        id: number;
    };
    hidden_products: {
        value: string;
        id: number;
    };
    hidden_categories: {
        value: string;
        id: number;
    };
    number_product_display: {
        value: string;
        id: number;
    };
};
const settingKeys = [
    {
        key: "get_by_tag",
        displayName: "Get data by tag",
    },
    {
        key: "get_by_collection",
        displayName: "Get data by collection",
    },
    {
        key: "get_by_category",
        displayName: "Get data by category",
    },
    {
        key: "get_by_color",
        displayName: "Get data by options",
    },
    {
        key: "get_by_best_sell",
        displayName: "Get data by best sell",
    },
    {
        key: "get_by_viewed",
        displayName: "Get data by viewed",
    },
    // {
    //     key: "get_by_buy",
    //     displayName: "Get data by buy",
    // }
];

export type SesSettingUpdatePostRes = {
    data: boolean;
};

const CrossSellSettings = () => {
    const {toast} = useToast();
    const [settings, setSettings] = useState<any>();
    const [searchProductsQuery, setSearchProductsQuery] = useState<string>();
    const {product_categories: categories, refetch: refetchCollections} = useAdminProductCategories();
    const {
        products,
        refetch: refetchProducts,
        isLoading: isLoadingProduct,
    } = useAdminProducts({...(searchProductsQuery ? {q: searchProductsQuery} : {})});
    const [relatedCategoriesHidden, setRelatedCategories] = useState<string[]>([]);
    const [relatedProductsHidden, setRelatedProducts] = useState<string[]>([]);

    const {
        data: dataCrossSell,
        isLoading: isLoadingCrossSell,
        refetch: refetchCrossSell,
    } = useAdminCustomQuery<{ type: string }, { crossSell: CrossSellRes }>("/settings", [], {
        type: SETTING_TYPES.crossSell,
    });

    const {mutate, isLoading: isLoadingUpdate} = useAdminCustomPost<any, any>(`/settings/update`, []);

    const columns: { title: React.ReactNode; key: string; class: string }[] = [
        {title: "Setting name", key: "name", class: ""},
        {title: "value", key: "value", class: ""},
    ];

    const productsOptions = useMemo(() => {
        return products?.map((res) => ({value: res.id, label: res.title})) || [];
    }, [products]);

    const categoryOptions = useMemo(() => {
        const a =
            categories?.map((col) => {
                return {value: col.id, label: col.name};
            }) || [];
        return a;
    }, [categories]);

    const handleChangeSetting = (value: any, id: number) => {
        const newSettings = settings?.map((s) => {
            if (s?.id === id) return {...s, value};
            return s;
        });

        console.log("newSettings")
        console.log(newSettings);
        setSettings(newSettings);
    };

    const handleUpdate = () => {
        mutate(settings, {
            onSuccess() {
                refetchCrossSell();
                toast({
                    title: "Update success",
                    description: "Update successfully",
                    variant: "success",
                    duration: 1500,
                });
            },
            onError() {
                toast({
                    title: "Update failed",
                    description: "Please try again",
                    variant: "error",
                    duration: 1500,
                });
            },
        });
    };

    useEffect(() => {
        const newSettings = [];
        for (const key in dataCrossSell?.crossSell) {
            newSettings.push(dataCrossSell?.crossSell?.[key]);
        }
        setSettings(newSettings);
    }, [dataCrossSell?.crossSell]);

    return (
        <div>
            <BackButton label="Back to settings" path="/a/settings" className="mb-xsmall"/>

            <BodyCard title="Setting Related" customActionable={<Button onClick={handleUpdate}>Update</Button>}>
                <Toaster/>
                {isLoadingCrossSell ? (
                    <div className="w-full flex items-center justify-center h-56">
                        <Spinner/>
                    </div>
                ) : (
                    <div>
                        {/*<div>*/}
                        {/*    <div>*/}
                        {/*        {columns.map((e) => (*/}
                        {/*            <div key={e.key} className={e.class}>*/}
                        {/*                {e.title}*/}
                        {/*            </div>*/}
                        {/*        ))}*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div>
                            <div style={{display:"flex", alignItems:"center", alignContent:"center", marginBottom:"20px"}}>
                                <div style={{width:"200px"}}>Header text</div>
                                <div style={{width:"calc(100% - 200px)"}}>
                                    <Input
                                        size={"large"}
                                        style={{width: "100%"}}
                                        defaultValue={dataCrossSell?.crossSell?.header_text.value}
                                        onChange={(e) => {
                                            handleChangeSetting(e.target.value, dataCrossSell?.crossSell?.header_text?.id);
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{display:"flex", alignItems:"center", alignContent:"center", marginBottom:"20px"}}>
                                <div style={{width:"200px"}}>Order By</div>
                                <div style={{width:"calc(100% - 200px)"}}>
                                    <Select
                                        size={"large"}
                                        style={{width: "100%"}}
                                        options={product_fields}
                                        defaultValue={dataCrossSell?.crossSell?.order_by.value}
                                        onChange={(e) => {
                                            handleChangeSetting(e, dataCrossSell?.crossSell?.order_by?.id);
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{display:"flex", alignItems:"center", alignContent:"center", marginBottom:"20px"}}>
                                <div style={{width:"200px"}}>Order</div>
                                <div style={{width:"calc(100% - 200px)"}}>
                                    <Select
                                        size={"large"}
                                        style={{width: "100%"}}
                                        defaultValue={dataCrossSell?.crossSell?.order.value}
                                        options={[{value: "ASC", label: "ASC"}, {value: "DESC", label: "DESC"},]}
                                        onChange={(e) => {
                                            handleChangeSetting(e, dataCrossSell?.crossSell?.order?.id);
                                        }}
                                    />

                                </div>
                            </div>
                            {/*<div>*/}
                            {/*    <div>Hide related products for categories</div>*/}
                            {/*    <div>*/}
                            {/*        <Select*/}
                            {/*            mode="multiple"*/}
                            {/*            allowClear*/}
                            {/*            size={"large"}*/}
                            {/*            style={{width: "100%"}}*/}
                            {/*            defaultValue={dataCrossSell?.crossSell?.hidden_categories.value ? JSON.parse(dataCrossSell?.crossSell?.hidden_categories.value): []}*/}
                            {/*            options={categoryOptions}*/}
                            {/*            onChange={(e) => {*/}
                            {/*                handleChangeSetting(JSON.stringify(e), dataCrossSell?.crossSell?.hidden_categories?.id);*/}
                            {/*            }}*/}
                            {/*        />*/}

                            {/*    </div>*/}
                            {/*</div>*/}
                            <div style={{display:"flex", alignItems:"center", alignContent:"center", marginBottom:"20px"}}>
                                <div style={{width:"200px"}}>Hide related products for products</div>
                                <div style={{width:"calc(100% - 200px)"}}>
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        size={"large"}
                                        style={{width: "100%"}}
                                        defaultValue={dataCrossSell?.crossSell?.hidden_products.value ? JSON.parse(dataCrossSell?.crossSell?.hidden_products.value): []}
                                        options={productsOptions}
                                        onChange={(e) => {
                                            handleChangeSetting(JSON.stringify(e), dataCrossSell?.crossSell?.hidden_products?.id);
                                        }}
                                    />

                                </div>
                            </div>
                            <div style={{display:"flex", alignItems:"center", alignContent:"center", marginBottom:"20px"}}>
                                <div style={{width:"200px"}}>Number of products to display</div>
                                <div style={{width:"calc(100% - 200px)"}}>
                                    <Input
                                        size={"large"}
                                        style={{width: "100%"}}
                                        type={"number"}
                                        defaultValue={dataCrossSell?.crossSell?.number_product_display.value}
                                        onChange={(e) => {
                                            handleChangeSetting(e.target.value, dataCrossSell?.crossSell?.number_product_display?.id);
                                        }}
                                    />
                                </div>
                            </div>
                            {settingKeys?.map((setting) => {
                                return (
                                    <div key={setting?.key} style={{display:"flex", alignItems:"center", alignContent:"center", marginBottom:"20px"}}>
                                        <div style={{width:"200px"}}>{setting.displayName}</div>
                                        <div style={{width:"calc(100% - 200px)"}}>
                                            <Switch
                                                onCheckedChange={(e) => {
                                                    handleChangeSetting(e ? "1" : "0", dataCrossSell?.crossSell?.[setting.key]?.id);
                                                }}
                                                defaultChecked={toBoolean(dataCrossSell?.crossSell?.[setting.key]?.value)}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </BodyCard>
            <Spacer/>
        </div>
    );
};

export const config: SettingConfig = {
    card: {
        label: "Related",
        description: "Setting related",
        icon: Tag,
    },
};

function toBoolean(e: any) {
    if (typeof e === "boolean") return e;
    if (typeof e === "string") return e === "true" || e === "1";
    return false;
}

export default CrossSellSettings;
