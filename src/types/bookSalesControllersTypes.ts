import { UserCouponsValidadeProps } from "../utils/validateCoupon"

export type detailsPurchaseProps = {
    amount: number
    offeredPrice: number
    soldPrice: number
    factoryPrice: number
    paymentMethod: string
    coupon:string
}

export type valuesBookSale = {
    idSale: string
    idClient: string | string[]
    idEmployee: string | string[]
    idBook: string
    amount: number
    offeredPrice: number
    soldPrice: number
    factoryPrice: number
    paymentMethod: string
    saleDate: string   
    useCoupon?:{
        id: string
        idUserCoupon: string
        idSale: string
        idUser: string
        idCoupon: string
        isCollected: boolean
        collectedDate: string}
}