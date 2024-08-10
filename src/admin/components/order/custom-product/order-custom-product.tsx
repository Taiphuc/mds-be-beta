import {OrderDetailsWidgetProps} from "@medusajs/admin";
import {useAdminCompleteOrder, useAdminCustomQuery, useAdminOrder} from "medusa-react";
import {Container, Heading, Button} from "@medusajs/ui";
import {useAdminCustomPost} from "medusa-react";
import {FC, useEffect, useState} from "react";
import {CubeSolid, PlusMini} from "@medusajs/icons"
import {Input, Select, Checkbox, Flex, Spin} from 'antd';
import {LoadingOutlined} from "@ant-design/icons";
import ModalEditTracking from "./ModalEditTracking";

type FieldType = {
    name?: string;
    slug?: string;
    link?: string;
    number?: string;
};


const OrderCustomProduct: FC<OrderDetailsWidgetProps> = ({order, notify}) => {
    const [trackings, setTrackings] = useState<[]>([]);
    const [isModalEditTracking, setIsModalEditTracking] = useState(false);
    const {
        order: orderDetails,
        isLoading: loadingOrderDetail,
        refetch: refetchOrderDetail,
    } = useAdminOrder(order.id, {fields: "tracking", expand: "items.variant.product"})
    const {mutate: updateTrackingOrder} = useAdminCustomPost<any, any>(`/carrier-slug/update-order`, []);

    useEffect(() => {
        // @ts-ignore
        const listTracking = orderDetails?.tracking
        if (listTracking && listTracking.length > 0) {
            setTrackings(listTracking);
        }
    }, [orderDetails]);

    const handleComplete = (data) => {
        updateTrackingOrder(
            {order_id: order.id, track: data},
            {
                onSuccess() {
                    notify.success("Update successfully", "Update tracking successfully");
                    setIsModalEditTracking(false)
                    refetchOrderDetail()
                },
                onError() {
                    notify.error("Update failed", "Update tracking failed");
                },
            }
        );
    }

    return (
        <div className={"flex space-x-4 mb-5"}>
            <ModalEditTracking
                onUpdateTracking={handleComplete}
                isModalOpen={isModalEditTracking} handleCancel={() => {
                setIsModalEditTracking(false)
            }} dataDefault={trackings}/>
            <Container style={{position: "relative"}}
                       className={"gap-y-base flex h-full w-7/12 flex-col"}
            >
                <div style={{position: "absolute", right: "8px", top: "8px"}}>
                    <Button onClick={() => {
                        setIsModalEditTracking(true)
                    }} variant={"secondary"}>Edit tracking</Button>
                </div>

                <div style={{marginBottom: "8px"}}>
                    <p>Location</p>
                    <p style={{fontWeight: "500"}}>{order?.shipping_address?.address_1}</p>
                </div>
                <div style={{marginBottom: "8px"}}>
                    <p>Delivery method</p>
                    <p style={{fontWeight: "500"}}>{order?.shipping_methods[0]?.shipping_option?.name}</p>
                </div>
                {loadingOrderDetail
                    ? <div style={{height: "200px", width: "100%", display: "flex", justifyContent: "center"}}>
                        <Flex align="center" gap="middle">
                            <Spin indicator={<LoadingOutlined style={{fontSize: 48}} spin/>}/>
                        </Flex>
                    </div>
                    : <div>
                        {trackings.length > 0 && <div>{trackings.map((tracking: FieldType) => {
                            return (<div style={{marginBottom: "8px"}}>
                                <p>{tracking?.name} tracking number</p>
                                <p style={{display: "flex"}}>
                                    <CubeSolid/>
                                    <a style={{fontStyle: "italic", fontWeight: "500", textDecoration: "underline"}}
                                       href={tracking?.link + tracking?.number}
                                       target="_blank">{tracking?.number}</a>
                                </p>
                            </div>)
                        })}</div>}
                    </div>}
            </Container>
            <Container className={"rounded-rounded border-grey-20 bg-grey-0 h-full w-5/12 border"}>
                <Heading level="h1" className="font-semibold pb-2"
                         style={{display: "flex", flexDirection: "column"}}>
                    <span style={{fontSize: "16px"}}>Status Order: <span
                        style={{color: order.status === "pending" ? "orange" : order.status === "completed" ? "green" : "red"}}>{order.status.toUpperCase()}</span></span>
                    {order.status === "pending" &&
                        <Button style={{width: "200px"}} onClick={handleComplete}>Complete order</Button>}
                </Heading>
            </Container>
        </div>
    )
}

export default OrderCustomProduct
