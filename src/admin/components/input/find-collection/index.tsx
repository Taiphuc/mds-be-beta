import { FC, useState, ChangeEvent, useRef, useEffect } from "react";
import { useAdminCustomQuery } from "medusa-react";
import { productQueryType } from "../../shared/product-tab";
import { Checkbox, Input, Label } from "@medusajs/ui";
import { ProductCollection } from "../../../../models/collection";

export type PickProductDataType = { selectedCollections: any[] };

type FindCollectionProps = {
  onChangeSelected: (data: PickProductDataType) => void;
  defaultData?: PickProductDataType;
  isClear?: boolean;
};

export type CollectionRes = {
  offset: number;
  limit: number;
  count: number;
  collections: ProductCollection[];
};

const FindCollection: FC<FindCollectionProps> = ({ onChangeSelected, defaultData, isClear }) => {
  const timerRef = useRef<any>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    pageSize: 20,
    pageIndex: 1,
    pageCount: 1,
    query: "",
  });
  const { data: collectionsRes, refetch: refetchProduct } = useAdminCustomQuery<productQueryType, CollectionRes>(
    "/collections",
    [],
    {
      offset: (pagination.pageIndex - 1) * pagination.pageSize,
      limit: pagination.pageSize,
      ...(pagination?.query ? { q: pagination?.query } : {}),
    }
  );

  const collections = collectionsRes?.collections;
  const [selectedCollections, setSelectedCollections] = useState<any[]>(defaultData?.selectedCollections || []);
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPagination({ ...pagination, query: e?.target.value });
    }, 400);
  };

  const handleChangeSelectCollection = (e: boolean | "indeterminate", collection: any) => {
    if (e) {
      // add collection
      const newCollections = [...selectedCollections];
      newCollections.push(collection);
      setSelectedCollections(newCollections);
    } else {
      // remove collection
      const newCollections = selectedCollections?.filter((e) => e?.id !== collection?.id);
      setSelectedCollections(newCollections);
    }
  };
  useEffect(() => {
    onChangeSelected({ selectedCollections });
  }, [selectedCollections]);
  useEffect(() => {
    if (isClear) {
      setSelectedCollections([]);
    }
  }, [isClear]);
  return (
    <div className="w-full flex flex-col space-y-3 p-3">
      <div className="w-full">
        <Input placeholder="Search" id="search-input" type="search" onChange={handleChangeSearch} />
      </div>
      <div className="w-full overflow-y-auto h-[400px] flex flex-col space-y-2">
        {collections?.map((collection) => {
          return (
            <div className="w-full flex flex-col space-y-2" key={collection?.id}>
              <div className="flex space-x-2 items-center">
                <Checkbox
                  id={collection?.id}
                  onCheckedChange={(e) => handleChangeSelectCollection(e, collection)}
                  checked={selectedCollections?.some((sCollection) => sCollection?.id === collection?.id)}
                />
                <Label htmlFor={collection?.id} className="flex space-x-2 items-center">
                  {collection?.title}
                </Label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default FindCollection;
