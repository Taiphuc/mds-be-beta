import {  XMark } from "@medusajs/icons";
import { Button } from "@medusajs/ui";
import { FC, ReactNode } from "react";
import { BlockType } from "../ThemePage";
import EditIcon from "../../icons/edit-icon";
import { generateStyle } from "../util/generateStyle";

type ButtonLinkProps = {
  children?: ReactNode;
  actionEdit: (e: BlockType) => void;
  actionRemove: (e: BlockType) => void;
  block: BlockType;
};

const ButtonLink: FC<ButtonLinkProps> = ({ actionEdit, block, actionRemove }) => {
  return (
    <div className="w-full">
      <div className="flex justify-center items-center cursor-pointer" style={generateStyle(block)}>
        {block?.data?.buttonLink?.text}
      </div>
      <div className="w-full flex justify-center gap-4">
        <Button title="Add a block" onClick={() => actionRemove(block)}>
          <XMark />
        </Button>
        <Button title="Add a block" onClick={() => actionEdit(block)}>
          <EditIcon />
        </Button>
      </div>
    </div>
  );
};

export default ButtonLink;
