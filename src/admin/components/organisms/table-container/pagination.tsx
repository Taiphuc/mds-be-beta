import { useTranslation } from "react-i18next"
import { SkeletonProvider } from "../../../providers/skeleton-provider"
import { PagingProps } from "./types"
import ArrowRightIcon from "../../shared/icons/arrow-right-icon"
import ArrowLeftIcon from "../../shared/icons/arrow-left-icon"
import Skeleton from "../../shared/skeleton"

type Props = {
  isLoading?: boolean
  pagingState: PagingProps
}

export const TablePagination = ({
  isLoading = false,
  pagingState: {
    title,
    currentPage,
    pageCount,
    pageSize,
    count,
    offset,
    nextPage,
    prevPage,
    hasNext,
    hasPrev,
  },
}: Props) => {
  const { t } = useTranslation()
  const soothedOffset = count > 0 ? offset + 1 : 0
  const soothedPageCount = Math.max(1, pageCount)

  return (
    <SkeletonProvider isLoading={isLoading}>
      <div
        className={
          "inter-small-regular text-grey-50 flex w-full justify-between"
        }
      >
        <Skeleton>
          <div>
            {t(
              "table-container-soothed-offset",
              "{{soothedOffset}} - {{pageSize}} of {{count}} {{title}}",
              {
                soothedOffset,
                pageSize,
                count,
                title,
              }
            )}
          </div>
        </Skeleton>
        <div className="flex space-x-4">
          <Skeleton>
            <div>
              {t(
                "table-container-current-page",
                "{{currentPage}} of {{soothedPageCount}}",
                {
                  currentPage,
                  soothedPageCount,
                }
              )}
            </div>
          </Skeleton>
          <div className="flex items-center space-x-4">
            <button
              className="disabled:text-grey-30 cursor-pointer disabled:cursor-default"
              disabled={!hasPrev || isLoading}
              onClick={() => prevPage()}
            >
              <ArrowLeftIcon />
            </button>
            <button
              className="disabled:text-grey-30 cursor-pointer disabled:cursor-default"
              disabled={!hasNext || isLoading}
              onClick={() => nextPage()}
            >
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </SkeletonProvider>
  )
}
