import { Image, TableProps } from "antd";
import { CustomProductBase } from "../../../../models/custom-product-base";
import { ColumnType } from "antd/es/table";
import Button from "../../fundamentals/button";
import { Eye, Trash } from "@medusajs/icons";
import { Prompt } from "@medusajs/ui";

export const columns = ({ viewInfo, deleteOne }: { viewInfo: (data: CustomProductBase) => void, deleteOne: (data: CustomProductBase) => void }) => {
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
      render: (_, { product, thumbnail }) => <div className="w-[40px] h-[40px]"><Image src={thumbnail || product?.thumbnail} /></div>,
    },
    {
      title: 'Title',
      dataIndex: 'parent_name',
      key: 'parent_name',
      render: (_, { product, template }) => <p>{template?.title || product?.title}</p>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (_, record) => <div className="flex gap-2">
        <Button size="small" onClick={() => { viewInfo(record) }} variant="primary" ><Eye /></Button>
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
  ] as ColumnType<CustomProductBase>[]
}
