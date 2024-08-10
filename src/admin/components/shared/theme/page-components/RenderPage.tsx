import { FC } from "react";
import { BlockType } from "../ThemePage";
import RootLayout from "./RootLayout";
import ChildrenLayout from "./ChildrenLayout";
import ButtonLink from "./ButtonLink";
import Slider from "./Slider";
import Categories from "./Categories";
type RenderPageProps = {
  blocks: BlockType[];
  actionAdd: (e: BlockType) => void;
  actionEdit: (e: BlockType) => void;
  actionRemove: (e: BlockType) => void;
};
const RenderPage: FC<RenderPageProps> = ({ blocks, actionAdd, actionEdit, actionRemove }) => {
  return (
    <>
      {blocks?.map((block) => {
        if (block.type === "layoutRoot") {
          return (
            <RootLayout actionAdd={actionAdd} actionEdit={actionEdit} key={block.id} block={block}>
              {block?.children?.length > 0 && (
                <RenderPage
                  actionRemove={actionRemove}
                  actionAdd={actionAdd}
                  actionEdit={actionEdit}
                  blocks={block.children}
                />
              )}
            </RootLayout>
          );
        }

        if (block.type === "layoutChild") {
          return (
            <ChildrenLayout
              actionAdd={actionAdd}
              actionEdit={actionEdit}
              actionRemove={actionRemove}
              key={block.id}
              block={block}
            >
              {block?.children?.length > 0 && (
                <RenderPage
                  actionRemove={actionRemove}
                  actionAdd={actionAdd}
                  actionEdit={actionEdit}
                  blocks={block.children}
                />
              )}
            </ChildrenLayout>
          );
        }

        if (block.type === "slider") {
          return (
            <Slider actionEdit={actionEdit} actionRemove={actionRemove} key={block.id} block={block}>
              {block?.children?.length > 0 && (
                <RenderPage
                  actionRemove={actionRemove}
                  actionAdd={actionAdd}
                  actionEdit={actionEdit}
                  blocks={block.children}
                />
              )}
            </Slider>
          );
        }

        if (block.type === "buttonLink") {
          return <ButtonLink actionEdit={actionEdit} block={block} actionRemove={actionRemove} />;
        }

        if (block.type === "categories") {
          return <Categories actionEdit={actionEdit} block={block} actionRemove={actionRemove} />;
        }
      })}
    </>
  );
};
export default RenderPage;
