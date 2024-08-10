import {Modal, Button, Checkbox, Form, Input, Flex, Spin} from 'antd';
import type {FormProps} from 'antd';
import styled from "styled-components";
import {useAdminCustomPost} from "medusa-react";
import {useEffect} from "react";
import {LoadingOutlined} from "@ant-design/icons";

const ModalCustom = styled(Modal)`
    .ant-modal-footer {
        display: none !important;
    }

`

type FieldType = {
    name?: string;
    slug?: string;
    link?: string;
};

export default function ModalEditAndCreate({isModalOpen, handleCancel, handleSubmit, typeModal, id}) {
    const {mutate: getCarrierSlugByID, isLoading} = useAdminCustomPost<any, any>(`/carrier-slug/get-one`, []);
    const [form] = Form.useForm();
    const onFinish = (values: FormProps) => {
        handleSubmit(values)
    }

    useEffect(() => {
        if(id){
            getCarrierSlugByID(
                {id: id},
                {
                    onSuccess(e) {
                        form.setFieldsValue({name:e.data.name, slug:e.data.slug, link:e.data.link});
                    },
                    onError() {

                    },
                }
            );
        }
    }, [id]);
    return (
        <>
            <ModalCustom title={typeModal === "create" ? "Create Carrier Slug" : "Edit Carrier Slug"} open={isModalOpen}
                         onCancel={handleCancel}>
                <div style={{marginTop: '12px'}}>
                    {isLoading ?
                        <div style={{height: "200px", width: "460px", display: "flex", justifyContent: "center"}}>
                            <Flex align="center" gap="middle">
                                <Spin indicator={<LoadingOutlined style={{fontSize: 48}} spin/>}/>
                            </Flex>
                        </div>: <Form
                            form={form}
                            name="basic"
                            labelCol={{span: 6}}
                            wrapperCol={{span: 16}}
                            style={{maxWidth: 600}}
                            initialValues={{remember: true}}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                label="Name"
                                name="name"
                                rules={[{required: true, message: 'Please input Name!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Slug id"
                                name="slug"
                                rules={[{required: true, message: 'Please input Slug id!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Link"
                                name="link"
                                rules={[{required: true, message: 'Please input Link!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item style={{display: 'flex', justifyContent: 'center'}}>
                                <Button type="primary" htmlType="submit">
                                    {typeModal === "create" ? "Create" : "Update"}
                                </Button>
                            </Form.Item>
                        </Form>}
                </div>
            </ModalCustom>
        </>
    );
}
