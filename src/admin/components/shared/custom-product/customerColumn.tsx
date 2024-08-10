import { Image, TableProps } from "antd";
import { CustomProduct } from "../../../../models/custom-product";
import { ColumnType } from "antd/es/table";
import Button from "../../fundamentals/button";
import { Eye, Trash } from "@medusajs/icons";
import { Prompt } from "@medusajs/ui";

export const CustomerColumn = ({ deleteOne }: { viewInfo?: (data: CustomProduct) => void, deleteOne: (data: CustomProduct) => void }) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (_, { image }) => <div className="w-[40px] h-[40px]"><Image src={image} /></div>,
    },
    {
      title: 'Parent name',
      dataIndex: 'parent_name',
      key: 'parent_name',
      render: (_, { product }) => <p>{product?.title}</p>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (_, record) => <div className="flex gap-2">
        {/* <Button size="small" onClick={() => { viewInfo(record) }} variant="primary" ><Eye /></Button> */}
        <Prompt>
          <Prompt.Trigger asChild>
            <Button size="small" variant="danger" ><Trash /></Button>
          </Prompt.Trigger>
          <Prompt.Content>
            <Prompt.Header>
              <Prompt.Title>Delete custom product base</Prompt.Title>
              <Prompt.Description>
                Are you sure? This cannot be undone.
              </Prompt.Description>
            </Prompt.Header>
            <Prompt.Footer>
              <Prompt.Cancel>Cancel</Prompt.Cancel>
              <Prompt.Action onClick={() => deleteOne(record)}>Delete</Prompt.Action>
            </Prompt.Footer>
          </Prompt.Content>
        </Prompt>


      </div>,
    },
  ] as ColumnType<CustomProduct>[]
}
