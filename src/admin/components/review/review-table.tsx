import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import BodyCard from "../../components/shared/body-card";
import { CommandBar, Input, Prompt, Select, Table, Toaster, useToast, useToggleState } from "@medusajs/ui";
import Spinner from "../../components/shared/spinner";
import RatingStar from "../../components/review/rating-star";
import dayjs from "dayjs";
import { Product } from "../../../models/product";
import ReviewDetailModal from "../../components/review/review-detail-modal";
import Spacer from "../shared/spacer";
import Button from "../shared/button";
import CopyReviewModal from "./copy-review-modal";
import ConfirmModal from "../modal/confirm-modal";

export type ReviewRes = {
  product_id: string;
  product: Product;
  title: string;
  user_name: string;
  rating: number;
  content: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  id: string;
  checked?: boolean;
};

type ReviewsRes = {
  data: ReviewRes[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
};

type PaginationType = {
  count: number;
  pageSize: number;
  pageIndex: number;
  pageCount: number;
  keyword?: string;
  rate?: number;
};

const selectItems = [
  { value: "-1", label: "All" },
  { value: "1", label: "Publish" },
  { value: "0", label: "Draft" },
];

export type UpdateActiveReq = {
  id: string;
  active: boolean;
};

const ReviewTable = ({ id, product }: { id?: string; product?: Product }) => {
  const { toast } = useToast();
  const [review, setReview] = useState({} as ReviewRes);
  const [openDetail, setOpenDetail] = useState(false);
  const [openCopyReview, setOpenCopyReview] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [commandBarState, setCommandBarState] = useState({ selected: false, count: 0 });
  const [selectValue, setSelectValue] = useState("-1");
  const [promptData, setPromptData] = useState(
    {} as { title: string; description: string; action: () => void; data?: any }
  );
  const [pagination, setPagination] = useState<PaginationType>({
    count: 0,
    pageSize: 15,
    pageIndex: 1,
    pageCount: 1,
    keyword: "",
  });
  const {
    data,
    refetch: refetchReview,
    isLoading,
    isFetching,
  } = useAdminCustomQuery<any, ReviewsRes>("/product-reviews", [], {
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    ...(pagination?.keyword ? { keyword: pagination?.keyword } : {}),
    ...(selectValue !== "-1" ? { active: selectValue === "1" } : {}),
    ...(pagination?.rate ? { rate: pagination?.rate } : {}),
    ...(id ? { product_id: id } : {}),
  });
  const { mutate: mutateDelete, isLoading: isDeleteLoading } = useAdminCustomPost<{ ids: string[] }, any>(
    "/product-reviews/delete-many",
    []
  );
  const { mutate: mutateUpdate, isLoading: isUpdateLoading } = useAdminCustomPost<UpdateActiveReq[], any>(
    "/product-reviews/update/active",
    []
  );
  const [reviews, setReviews] = useState([] as ReviewRes[]);
  const { state: isShowConfirm, close: closeConfirm, open: showConfirm, toggle: toggleConfirm } = useToggleState(false);
  const [keyword, setKeyword] = useState("");
  const timer = useRef(null);

  const handleSetActiveFilter = (e: string) => {
    setSelectValue(e);
  };

  const handleOpenDetail = (e: ReviewRes) => {
    setOpenDetail(true);
    setReview(e);
  };

  const handleDeleteReviews = () => {
    const deleteIds = reviews?.reduce((result, review) => {
      if (review?.checked) {
        result?.push(review?.id);
        return result;
      }
      return result;
    }, [] as string[]);
    if (deleteIds.length) {
      mutateDelete(
        { ids: deleteIds },
        {
          onSuccess() {
            toast({
              title: "Delete Successful",
              description: "Delete Successful",
              variant: "success",
              duration: 1500,
            });
            refetchReview();
          },
        }
      );
    }
    closeConfirm();
  };

  const handleUpdateActive = () => {
    const updateData = reviews.reduce((result, review) => {
      if (review.checked) {
        result.push({ id: review.id, active: promptData.data === "publish" });
      }
      return result;
    }, [] as UpdateActiveReq[]);

    if (updateData.length) {
      mutateUpdate(updateData, {
        onSuccess() {
          toast({
            title: "Update Successful",
            description: "Update Successful",
            variant: "success",
            duration: 1500,
          });
          refetchReview();
        },
      });
    }
    closeConfirm();
  };

  const handleCheckAll = (e) => {
    setCheckAll(e?.currentTarget?.checked);
    const newReviews = reviews?.map((r) => ({ ...r, checked: e?.currentTarget?.checked }));
    setReviews(newReviews);
  };

  const columns: { title: React.ReactNode; key: string; class: string }[] = [
    {
      title: <input type="checkbox" onClick={handleCheckAll} checked={checkAll} style={{ cursor: "pointer" }}></input>,
      key: "checkbox",
      class: "w-[75px]",
    },
    { title: "Reviewer", key: "reviewer", class: "150px" },
    { title: "Title", key: "title", class: "" },
    { title: "Rating", key: "rating", class: "w-[100px]" },
    { title: "status", key: "status", class: "w-[100px] text-center" },
    { title: "Create time", key: "merchant_status", class: "w-[125px]" },
  ];
  const handleNextPage = () => {
    const page = pagination?.pageIndex + 1 > pagination?.pageCount ? pagination?.pageCount : pagination?.pageIndex + 1;
    setPagination({ ...pagination, pageIndex: page });
  };
  const handlePrePage = () => {
    const page = pagination?.pageIndex > 1 ? pagination?.pageIndex - 1 : 1;
    setPagination({ ...pagination, pageIndex: page });
  };
  const handleCheckReview = (e, review) => {
    const newReviews = reviews?.map((r) => {
      if (review?.id === r.id) {
        return { ...review, checked: e?.target?.checked };
      }
      return r;
    });
    setReviews(newReviews);
  };
  const handleChangeSearch = (e) => {
    setKeyword(e?.target.value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setPagination({ ...pagination, keyword: e?.target?.value });
    }, 500);
  };

  useEffect(() => {
    setReviews(data?.data?.map((r) => ({ ...r, checked: false })));
    setCheckAll(false);
  }, [isFetching]);

  useEffect(() => {
    refetchReview();
  }, [selectValue, pagination?.keyword, pagination?.pageIndex]);

  useEffect(() => {
    const count = reviews?.reduce((a, b) => {
      if (b?.checked) {
        return ++a;
      }
      return a;
    }, 0);

    setCommandBarState({ selected: count > 0, count });
    if (data?.total) {
      setPagination({
        ...pagination,
        count: data?.total,
        pageIndex: data?.page,
        pageCount: Math.ceil(data?.total / pagination.pageSize),
      });
    }
  }, [reviews]);

  useLayoutEffect(() => {
    if (document) {
      const main = document.querySelector("main.h-full");
      main?.classList?.remove("h-full");
    }
  }, []);

  return (
    <BodyCard
      title="Product Reviews"
      customActionable={
        <div className="w-[200px]">
          <Select onValueChange={handleSetActiveFilter} value={selectValue}>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {selectItems.map((item) => (
                <Select.Item key={item.value} value={item.value}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
      }
    >
      <Toaster />
      <div className="w-full flex justify-between">
        <div className="w-[250px]">
          <Input
            placeholder="Search by title or content"
            id="search-input"
            type="search"
            value={keyword}
            onChange={handleChangeSearch}
          />
        </div>
        <div>
          {!!id && (
            <>
              <Button variant="secondary" onClick={() => setOpenCopyReview(true)}>
                Get Review
              </Button>
              <CopyReviewModal
                data={product}
                open={openCopyReview}
                setOpen={setOpenCopyReview}
                reload={refetchReview}
                setData={setReview}
              />
            </>
          )}
        </div>
      </div>
      <Spacer />
      {isLoading || isDeleteLoading || isUpdateLoading ? (
        <div className="flex items-center justify-center bg-white bg-opacity-50 w-full min-h-[400px]">
          <Spinner variant="secondary" />
        </div>
      ) : (
        <>
          <Table className="m-h-[800px]">
            <Table.Header>
              <Table.Row>
                {columns.map((e) => (
                  <Table.HeaderCell key={e.key} className={e.class}>
                    {e.title}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {reviews?.map((review, i) => {
                return (
                  <Table.Row
                    key={i}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleOpenDetail(review);
                    }}
                  >
                    <Table.Cell
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!review?.checked}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckReview(e, review);
                        }}
                      ></input>
                    </Table.Cell>
                    <Table.Cell>{review?.user_name}</Table.Cell>
                    <Table.Cell className="truncate max-w-[260px]">{review?.title}</Table.Cell>
                    <Table.Cell>
                      <RatingStar rate={review?.rating} />
                    </Table.Cell>
                    <Table.Cell className="text-center font-bold">
                      {review.active ? (
                        <p className="text-[#9ADE7B]">Publish</p>
                      ) : (
                        <p className="text-[#FEA433]">Draft</p>
                      )}
                    </Table.Cell>
                    <Table.Cell>{dayjs(review.created_at).format("DD MMM YYYY")}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
          <Table.Pagination
            canNextPage
            canPreviousPage
            count={pagination.count}
            pageSize={pagination.pageSize}
            pageIndex={pagination.pageIndex - 1}
            pageCount={pagination.pageCount}
            nextPage={handleNextPage}
            previousPage={handlePrePage}
          />
        </>
      )}
      <ReviewDetailModal
        data={review}
        open={openDetail}
        setOpen={setOpenDetail}
        reload={refetchReview}
        setData={setReview}
      />
      <ConfirmModal
        open={isShowConfirm}
        title={promptData?.title}
        description={promptData?.description}
        action={promptData?.action}
        toggle={toggleConfirm}
      />
      <CommandBar open={commandBarState.selected}>
        <CommandBar.Bar className="bg-slate-900 text-gray-400">
          <CommandBar.Value>{commandBarState.count} selected</CommandBar.Value>
          <CommandBar.Seperator className="bg-white" />
          <CommandBar.Command
            action={() => {
              showConfirm();
              setPromptData({
                action: handleDeleteReviews,
                description: "Delete reviews",
                title: "Are you sure you want to delete reviews",
              });
            }}
            label="Delete"
            shortcut="d"
            className="hover:bg-slate-700 text-slate-100"
          />
          <CommandBar.Seperator className="bg-white" />
          <CommandBar.Command
            action={() => {
              showConfirm();
              setPromptData({
                action: handleUpdateActive,
                description: "Publish reviews",
                title: "Are you sure you want to Publish reviews",
                data: "publish",
              });
            }}
            label="Publish"
            shortcut="p"
            className="hover:bg-slate-700 text-slate-100"
          />
          <CommandBar.Seperator className="bg-white" />
          <CommandBar.Command
            action={() => {
              showConfirm();
              setPromptData({
                action: handleUpdateActive,
                description: "Draft reviews",
                title: "Are you sure you want to Draft reviews",
                data: "draft",
              });
            }}
            label="Draft"
            shortcut="q"
            className="hover:bg-slate-700 text-slate-100"
          />
        </CommandBar.Bar>
      </CommandBar>
    </BodyCard>
  );
};

export default ReviewTable;
