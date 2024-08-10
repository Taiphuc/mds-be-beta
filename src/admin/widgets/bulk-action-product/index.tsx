import {WidgetConfig, WidgetProps} from "@medusajs/admin";
import {Button, useToggleState} from "@medusajs/ui";
import ModalBulkDelete from "./components/bulkDeleteModal";
import {useAdminCustomPost, useAdminProducts} from "medusa-react";
import {Trash, ArrowUpTray} from "@medusajs/icons"
import ModalImportWoocommerce from "./components/importWoocommerce";
import {useState} from "react";


const BulkActionProduct = ({notify}: WidgetProps) => {
    const {state, toggle} = useToggleState();
    const [isOpenImport, setOpenImport] = useState<boolean>(false);
    const {refetch} = useAdminProducts();

    const {mutate: mutateBulkDelete, isLoading: isLoadingBulkDelete} =
        useAdminCustomPost<{ productIds: string[] }, any>("/products-v2", [
            "bulk-delete",
        ]);
    const handleBulkDelete = ({productIds}: { productIds: string[] }) => {
        mutateBulkDelete(
            {productIds},
            {
                onSuccess: () => {
                    notify.success("Success", "Delete product success");
                    toggle();
                },
                onError: (error) => {
                    notify.error("Error", "Something went wrong, " + error?.message);
                },
            }
        );
    };

    return (
        <div>
            <div
                className="px-xlarge py-4 rounded-rounded bg-grey-0 border-grey-20 flex h-full w-full flex-col overflow-hidden border">
                <div className="flex flex-wrap justify-between inter-large-semibold items-center">
                    <span className="text-grey-90">Actions</span>
                    <div className="flex gap-x-2">
                        <Button variant="secondary" onClick={() => {
                            setOpenImport(true)
                        }}>
                            <ArrowUpTray/>
                            Bulk Import
                        </Button>
                        <Button variant="danger" onClick={toggle}>
                            <Trash/>
                            Bulk delete
                        </Button>
                    </div>
                </div>
            </div>
            <ModalBulkDelete
                handleBulkDelete={handleBulkDelete}
                isLoading={isLoadingBulkDelete}
                open={state}
                onClose={toggle}
            />

            <ModalImportWoocommerce
                open={isOpenImport}
                notify={notify}
                onClose={() => {
                    setOpenImport(false)
                    refetch()
                }}/>
        </div>
    );
};

export const config: WidgetConfig = {
    zone: "product.list.before",
};

export default BulkActionProduct;
