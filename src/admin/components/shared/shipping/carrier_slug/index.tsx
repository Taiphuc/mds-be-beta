import {Popconfirm, Table} from "antd";
import {useAdminCustomPost, useAdminCustomQuery} from "medusa-react";
import {useEffect, useState} from "react";
import {PencilSquare, Trash, PlusMini} from "@medusajs/icons"
import styled from "styled-components";
import {Button} from "@medusajs/ui";
import ModalEditAndCreate from "./ModalEditAndCreate";

const RowActionButton = styled.div`
    display: flex;

    .item_button {
        margin-right: 12px;
        padding: 8px;
        border: 1px solid unset;
        cursor: pointer;
    }

    .item_button:hover {
        background-color: #ccc;
        border-radius: 50%;
    }

    .item_button:hover svg {
        color: white;
    }
`

type FieldDataCarried = {
    name?: string;
    slug?: string;
    link?: string;
};

export default function CarrierSlug({notify}) {
    const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
    const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
    const [idEdit, setIdEdit] = useState(null);
    const {
        data,
        isLoading: isLoadingPages,
        refetch: refetchPages,
    } = useAdminCustomQuery<any, { data: any }>("/carrier-slug", []);
    const {mutate: deleteCarrierSlug} = useAdminCustomPost<any, any>(`/carrier-slug/delete`, []);
    const {mutate: createCarrierSlug} = useAdminCustomPost<any, any>(`/carrier-slug/create`, []);
    const {mutate: updateCarrierSlug} = useAdminCustomPost<any, any>(`/carrier-slug/update`, []);
    const [dataTable, setDataTable] = useState([])

    useEffect(() => {
        if(idEdit){
            setIsOpenEdit(true)
        }else {
            setIsOpenEdit(false)
        }
    }, [idEdit]);

    const onConfirmDelete = ((pageId: string) => {
        deleteCarrierSlug(
            {id: pageId},
            {
                onSuccess() {
                    notify.success("Delete successfully", "Carrier slug deleted successfully");
                    refetchPages();
                },
                onError() {
                    notify.error("Delete failed", "Carrier slug deleted failed");
                    refetchPages();
                },
            }
        );
    })

    const onCreateCarrierSlug = (data: FieldDataCarried) => {
        createCarrierSlug(
            data,
            {
                onSuccess() {
                    notify.success("Create successfully", "Carrier slug created successfully");
                    setIsOpenCreate(false)
                    refetchPages();
                },
                onError() {
                    notify.error("Create failed", "Carrier slug created failed");
                    refetchPages();
                },
            }
        );
    }

    const onUpdateCarrierSlug = (data: FieldDataCarried) => {
        updateCarrierSlug(
            data,
            {
                onSuccess() {
                    notify.success("Update successfully", "Carrier slug Update successfully");
                    setIsOpenEdit(false)
                    refetchPages();
                },
                onError() {
                    notify.error("Update failed", "Carrier slug update failed");
                    refetchPages();
                },
            }
        );
    }


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <p style={{fontWeight: "400"}}>{text}</p>,
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'age',
            render: (text) => <p style={{fontWeight: "400"}}>{text}</p>,
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'address',
            render: (text) => <p style={{fontWeight: "400"}}>{text}</p>,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 150,
            render: (text, value) => <RowActionButton style={{display: "flex"}}>
                <div onClick={()=>{
                    setIdEdit(value.id)
                }} className={"item_button"}>
                    <PencilSquare/>
                </div>
                <Popconfirm
                    title="Delete the carrier"
                    description="Are you sure to delete this carrier?"
                    onConfirm={() => {
                        onConfirmDelete(value.id)
                    }}
                    okText="Yes"
                    cancelText="No"
                >
                    <div className={"item_button"}>
                        <Trash color={"red"}/>
                    </div>
                </Popconfirm>

            </RowActionButton>,
        }
    ];


    useEffect(() => {
        if (data) {
            setDataTable(data?.data)
        }
    }, [data]);

    return (
        <>
            <div>
                <ModalEditAndCreate id={null} typeModal={"create"} isModalOpen={isOpenCreate} handleCancel={() => {
                    setIsOpenCreate(false);
                }} handleSubmit={(dataCreate) => {
                    onCreateCarrierSlug(dataCreate)
                }}/>
                <ModalEditAndCreate id={idEdit} typeModal={"edit"} isModalOpen={isOpenEdit} handleCancel={() => {
                    setIdEdit(null)
                }} handleSubmit={(dataEdit) => {
                    onUpdateCarrierSlug({...dataEdit, id:idEdit})
                }}/>
                <div style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    margin: "16px 0 12px",
                    display: "flex",
                    justifyContent: "space-between",
                }}>
                    <p>Total carrier slug: {dataTable.length}</p>
                    <Button
                        onClick={() => {
                            setIsOpenCreate(true)
                        }}
                        className="h-[32px]"
                        variant="primary"
                    >
                        <PlusMini/>
                        Create
                    </Button>
                </div>
                <Table dataSource={dataTable} columns={columns}/>;
            </div>
        </>
    );
}
