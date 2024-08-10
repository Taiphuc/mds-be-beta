import { Plus, XMark } from "@medusajs/icons";
import { Button } from "@medusajs/ui";
import { FC, ReactNode } from "react";
import { BlockType } from "../ThemePage";
import EditIcon from "../../icons/edit-icon";
import { generateStyle } from "../util/generateStyle";

type ChildrenLayoutProps = {
  children?: ReactNode;
  actionAdd: (e: BlockType) => void;
  actionEdit: (e: BlockType) => void;
  actionRemove: (e: BlockType) => void;
  block: BlockType;
};

const ChildrenLayout: FC<ChildrenLayoutProps> = ({ actionRemove, children, actionAdd, actionEdit, block }) => {
  return (
    <div className="w-full">
      <div className={`w-full min-h-[60px] grid grid-cols-${block?.data?.grid?.col || 1}`} style={generateStyle(block)}>
        {children}
      </div>
      <div className="w-full flex justify-center gap-4">
        <Button title="Add a block" onClick={() => actionRemove(block)}>
          <XMark />
        </Button>
        <Button title="Add a block" onClick={() => actionEdit(block)}>
          <EditIcon />
        </Button>
        <Button title="Add a block" onClick={() => actionAdd(block)}>
          <Plus />
        </Button>
      </div>
    </div>
  );
};

export default ChildrenLayout;
