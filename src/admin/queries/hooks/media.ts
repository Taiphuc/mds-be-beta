import { useInfiniteQuery } from "@tanstack/react-query"
import { listMedia } from "../apis"
import { Image as ImageType } from "@medusajs/medusa";

export const LIST_MEDIA = 'LIST_MEDIA'
export const useInfiniteListMedia = (params: { page: number, limit: number }) => {
    return useInfiniteQuery({
        queryKey: [LIST_MEDIA, params],
        queryFn: ({ pageParam = 1 }) => listMedia({ ...params, page: pageParam }),
        getNextPageParam: (lastPage: any) =>
            lastPage?.page < Math.ceil(lastPage?.total / lastPage?.limit) ? lastPage?.page + 1 : undefined,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
    })
}