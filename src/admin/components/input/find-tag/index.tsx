import { FC, useState, ChangeEvent, useRef, useEffect } from "react";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { productQueryType } from "../../shared/product-tab";
import { Checkbox, Input, Label } from "@medusajs/ui";
import { ProductTag } from "../../../../models/tag";

export type PickTagsDataType = { selectedTags: any[] };

type FindTagProps = {
  onChangeSelected: (data: PickTagsDataType) => void;
  defaultData?: PickTagsDataType;
  isClear?: boolean;
};

export type TagsRes = {
  offset: number;
  limit: number;
  count: number;
  product_tags: ProductTag[];
};

const FindTag: FC<FindTagProps> = ({ onChangeSelected, defaultData, isClear }) => {
  const timerRef = useRef<any>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    pageSize: 20,
    pageIndex: 1,
    pageCount: 1,
    query: "",
  });
  const { data: tagsRes, refetch: refetchProduct } = useAdminCustomQuery<productQueryType, TagsRes>(
    "/product-tags",
    [],
    {
      offset: (pagination.pageIndex - 1) * pagination.pageSize,
      limit: pagination.pageSize,
      ...(pagination?.query ? { q: pagination?.query } : {}),
    }
  );

  const tags = tagsRes?.product_tags;
  const [selectedTags, setSelectedTags] = useState<any[]>(defaultData?.selectedTags || []);
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPagination({ ...pagination, query: e?.target.value });
    }, 400);
  };

  const handleChangeSelectTag = (e: boolean | "indeterminate", tag: any) => {
    if (e) {
      // add tag
      const newTags = [...selectedTags];
      newTags.push(tag);
      setSelectedTags(newTags);
    } else {
      // remove tag
      const newTags = selectedTags?.filter((e) => e?.id !== tag?.id);
      setSelectedTags(newTags);
    }
  };
  useEffect(() => {
    onChangeSelected({ selectedTags });
  }, [selectedTags]);
  useEffect(() => {
    if (isClear) {
      setSelectedTags([]);
    }
  }, [isClear]);
  return (
    <div className="w-full flex flex-col space-y-3 p-3">
      <div className="w-full">
        <Input placeholder="Search" id="search-input" type="search" onChange={handleChangeSearch} />
      </div>
      <div className="w-full overflow-y-auto h-[400px] flex flex-col space-y-2">
        {tags?.map((tag) => {
          return (
            <div className="w-full flex flex-col space-y-2" key={tag?.id}>
              <div className="flex space-x-2 items-center">
                <Checkbox
                  id={tag?.id}
                  onCheckedChange={(e) => handleChangeSelectTag(e, tag)}
                  checked={selectedTags?.some((sTag) => sTag?.id === tag?.id)}
                />
                <Label htmlFor={tag?.id} className="flex space-x-2 items-center">
                  {tag?.value}
                </Label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default FindTag;
