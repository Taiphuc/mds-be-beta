import React from "react"

export type ReactFCWithChildren<T> = React.FC<React.PropsWithChildren<T>>
export interface ApiResponse<T = {}> {
    data: T;
}
export type QueryParams<T = {}> = T & {
    limit: number
    offset: number
}