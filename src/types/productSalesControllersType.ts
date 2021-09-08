export type detailsPurchaseProps = {
    amount: number
    offeredPrice: number
    soldPrice: number
    factoryPrice: number
    paymentMethod: string
}

export type valuesProductSale = {
    idSale: string
    idClient: string | string[]
    idEmployee: string | string[]
    idProduct: string
    amount: number
    offeredPrice: number
    soldPrice: number
    factoryPrice: number
    paymentMethod: string
    saleDate: string
    
}

export type valuesProductSaleUpdate = {
    isClosed?:boolean
    closedDate?:string
}