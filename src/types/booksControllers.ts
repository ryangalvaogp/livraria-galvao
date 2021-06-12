export type Book = {
    id: string
    title: string
    author: string
    isbn: string
    category: string
    editionNumber: number
    publishingCompany: string
    placeOfPublication: string
    pages: number
    cddcdu: number
    preco: number
}

export type BookProps = {
    list: Book[],
    create: {
        request: {
            title: string
            author: string
            isbn: string
            category: string
            editionNumber: number
            publishingCompany: string
            placeOfPublication: string
            pages: number
            cddcdu: number
            salePrice: number
            factoryPrice: number


        }
        crud: {
            tableBook: {
                id: string
                title: string
                author: string
                isbn: string
                category: string
                editionNumber: number
                publishingCompany: string
                placeOfPublication: string
                pages: number
                cddcdu: number
                amount?: number
                salePrice?: number
                factoryPrice?: number
            },
            tableStockBook: BookStock
        }
    }
}

export type BookStock = {
    idBook: string
    amount: number
    salePrice: number
    factoryPrice: number
}