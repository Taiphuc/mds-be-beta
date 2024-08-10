import { Plus } from "@medusajs/icons";
import { Button } from "@medusajs/ui";
import { FC, ReactNode } from "react";
import { BlockType } from "../ThemePage";
import EditIcon from "../../icons/edit-icon";
import { generateStyle } from "../util/generateStyle";

type RootLayoutProps = {
  children?: ReactNode;
  actionAdd: (e: BlockType) => void;
  actionEdit: (e: BlockType) => void;
  block?: BlockType;
};

const RootLayout: FC<RootLayoutProps> = ({ children, actionAdd, actionEdit, block }) => {
  return (
    <div
      className="w-full flex justify-center overflow-auto flex-col items-center"
    >
      <div
        className="flex flex-col gap-2 min-h-[60px]"
        style={generateStyle(block)}
      >
        {children}
      </div>
      <div className="w-full flex justify-center p-2 gap-4">
        <Button title="Add a block" onClick={() => actionEdit(block)}>
          <EditIcon />
        </Button>
        <Button
          title="Add a block"
          onClick={() => {
            actionAdd(block);
          }}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
};

export default RootLayout;
