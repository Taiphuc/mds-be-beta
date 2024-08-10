export enum EOptionPage {
    HOME = "home",
    CUSTOMER_SERVICE = "customer_service",
    CONTACT_US = "contact_us",
    STORE = "store",
}
export type TOptionPageItem = {
    key: string
    id: string
    value: Record<string, any>
}
export type TCreateOptionPage = {
    key: EOptionPage
    value: Record<string, any>
}
