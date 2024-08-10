import {CloudArrowUp, PlusMini} from "@medusajs/icons"
import {Select, Checkbox, Flex, Spin, Modal, Form, Row, Col, Button, Input} from 'antd';
import {useAdminCustomQuery} from "medusa-react";
import styled from "styled-components";

import {Heading, Label, useToggleState} from "@medusajs/ui";

import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';

type FieldType = {
    name?: string;
    slug?: string;
    link?: string;
    number?: string;
};


const ModalCustom = styled(Modal)`

    .ant-modal-footer {
        display: none !important;
    }
`

export default function ModalEditTracking({isModalOpen, handleCancel, dataDefault, onUpdateTracking}) {
    const [form] = Form.useForm();

    const {
        data: listCarrier,
        isLoading: isLoadingPages,
        refetch: refetchPages,
    } = useAdminCustomQuery<any, { data: any }>("/carrier-slug", []);

    const onFinish = (values: any) => {
        let array = values.track_data.map((item)=>{
            // @ts-ignore
            const itemFullData = listCarrier?.data.find((carrier)=>carrier.id === item.carrier_id);
            return {
                carrier_id: itemFullData.id,
                name:itemFullData.name,
                link: itemFullData.link,
                number:item.number
            };
        })
        onUpdateTracking(array)
    };

    return (
        <ModalCustom width={600} title={"Edit Tracking"} open={isModalOpen}
                     onCancel={handleCancel}>
            <div style={{margin: "8px 0", borderTop: "1px solid #ccc", paddingTop: "8px"}}>
                <Form
                    scrollToFirstError
                    form={form}
                    initialValues={{track_data:dataDefault}}
                    name="metadata"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    {/* Slider Section */}
                    <Form.List name="track_data">
                        {(fields, {add, remove}) => (
                            <Row>
                                {fields.map(({key, name, ...restField}, index) => (
                                    <Col key={key} span={24}>
                                        <Row gutter={16}>
                                            <Col className="gutter-row" span={11}>
                                                <Col
                                                    span={24}
                                                    className="flex justify-between items-center"
                                                >
                                                    <Label className="italic">Tracking number</Label>

                                                </Col>
                                                <Col span={24}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "number"]}
                                                        rules={[{required: true, message: "Missing title"}]}
                                                    >
                                                        <Input placeholder="Tracking number"/>
                                                    </Form.Item>
                                                </Col>
                                            </Col>
                                            <Col className="gutter-row" span={11}>
                                                <Col
                                                    span={24}
                                                    className="flex justify-between items-center"
                                                >
                                                    <Label className="italic">Shipping carrier</Label>
                                                </Col>
                                                <Col span={24}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "carrier_id"]}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Missing description 1",
                                                            },
                                                        ]}
                                                    >
                                                        <Select
                                                            showSearch
                                                            placeholder="Select a shipping carrier"
                                                            filterOption={(input, option) =>
                                                                // @ts-ignore
                                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                            }
                                                            options={listCarrier?.data.map((item) => {
                                                                return {value: item.id, label: item.name}
                                                            })}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Col>
                                            <Col className="gutter-row" span={2}>
                                                <Col span={24} className="flex justify-center items-center">
                                                    <DeleteOutlined style={{fontSize: "20px", marginTop: "24px"}}
                                                                    onClick={() => remove(name)}/>
                                                </Col>

                                            </Col>
                                        </Row>
                                    </Col>
                                ))}
                                <Col span={24}>
                                    <div style={{display: "flex", color: "#005bd3", cursor: "pointer"}}
                                         onClick={() => add()}>
                                        <PlusMini/>
                                        Add another tracking number
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </Form.List>
                    <div style={{margin: "12px 0"}}>
                        <Checkbox onChange={() => {
                        }}>Send notification email to customer</Checkbox>
                    </div>
                    <Form.Item style={{marginTop: "12px"}}>
                        <div style={{display: "flex", justifyContent: "end"}}>
                            <Button htmlType="submit">
                                Save
                            </Button>
                            <Button style={{marginLeft: "8px", backgroundColor: "red !important"}} danger>
                                Cancel
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </ModalCustom>

    )
}
