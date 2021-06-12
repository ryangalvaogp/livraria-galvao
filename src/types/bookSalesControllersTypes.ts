export type detailsPurchaseProps = {
    amount: number
    offeredPrice: number
    soldPrice: number
    factoryPrice: number
    paymentMethod: string
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
    
}