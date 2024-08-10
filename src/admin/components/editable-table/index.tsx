import {
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
  TableProps,
} from "antd";
import React, { useContext, useState, useRef, useEffect } from "react";
import "./style.css";

type FormInstance<T> = any;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export enum ETypeEdit {
  STRING = "STRING",
  NUMBER = "NUMBER",
  SELECT = "SELECT",
  CHECKBOX = "CHECKBOX",
}
type TEditable = {
  type: ETypeEdit;
  options?: any[];
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: TEditable;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
  toggleEditable: boolean;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  toggleEditable,
  ...restProps
}) => {
  const [editing, setEditing] = useState(!toggleEditable);
  const inputRef = useRef<any>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (!toggleEditable) return;
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    if (!toggleEditable) return;
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async (checkData?: { [key: string]: boolean }) => {
    try {
      const values = await form.validateFields();
      if (checkData) {
        handleSave({ ...record, ...values, ...checkData });
      } else {
        handleSave({ ...record, ...values });
      }
      toggleEdit();
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        initialValue={record[dataIndex]}
      >
        {editable.type === ETypeEdit.STRING && (
          <Input
            ref={inputRef}
            style={{ width: 300 }}
            onPressEnter={() => save()}
            onBlur={() => save()}
          />
        )}
        {editable.type === ETypeEdit.NUMBER && (
          <InputNumber
            ref={inputRef}
            style={{ width: 150 }}
            onPressEnter={() => save()}
            onBlur={() => save()}
          />
        )}
        {editable.type === ETypeEdit.CHECKBOX && (
          <Checkbox
            ref={inputRef}
            style={{ width: 150, justifyContent: "center" }}
            defaultChecked={!!record[dataIndex]}
            onChange={(e) => save({ [dataIndex]: e.target.checked })}
          />
        )}
        {editable.type === ETypeEdit.SELECT && (
          <Select
            ref={inputRef}
            getPopupContainer={(node) => node.parentNode}
            style={{ width: 150 }}
            showSearch
            allowClear
            optionFilterProp="children"
            onBlur={() => save()}
            onChange={(v) => {
              save();
            }}
          >
            {editable.options.map((option, index) => (
              <Select.Option key={index} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24, width: 300, minHeight: 32 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  name: string;
  age: string;
  address: string;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

type TEditableTable = {
  dataSource: any[];
  setDataSource: React.Dispatch<React.SetStateAction<any[]>>;
  defaultColumns: (ColumnTypes[number] & {
    editable?: TEditable;
    dataIndex: string;
  })[];
  rowKey?: string;
  tableProps?: TableProps<any>;
  toggleEditable?: boolean;
};

const EditableTable = ({
  dataSource,
  setDataSource,
  defaultColumns,
  rowKey = "key",
  tableProps,
  toggleEditable = false,
}: TEditableTable) => {
  const handleSave = (row: any) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row[rowKey] === item[rowKey]);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    } as any);
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        toggleEditable: toggleEditable,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Table
        className="editable-table"
        tableLayout="auto"
        pagination={false}
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        {...tableProps}
      />
    </div>
  );
};

export default EditableTable;
