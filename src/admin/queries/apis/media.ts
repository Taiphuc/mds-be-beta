import axios from "axios";

export const listMedia = (params: { page: number, limit: number }) =>
    axios({ url: `admin/media`, method: 'POST', params })