export type UserReadBook = {
    idUserReadBook?:string | string[]
    idUser?:string | string[]
    idBook:string
    isRead:boolean
    dateStart:string
    destiny:string
    dateEnd:string
    assessment:number
    review:string
}
export type UserReadBookMap = {
    idUserReadBook: string
    idUser: string
    idBook: string
    isRead: boolean
    dateStart: string
    destiny:string
    dateEnd: string
    assessment: number
    review:string
    id: string
    name: string
    email: string
    city: string
    street: string
    neighborhood: string
    n:number
    cep:number
    cpf: string
    cell: string
    permission:number
    xp:number
    premium: false,
    registrationDate: string
    avatarurl:string
    title: string
    author: string
    isbn: string
    category: string,
    editionNumber:number
    publishingCompany: string
    placeOfPublication:string
    pages:number
    cddcdu:number
    likes: number
}