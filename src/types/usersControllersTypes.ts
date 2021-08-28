
export type user ={
    id: string
    name: string
    email: string
    city: string
    street: string
    neighborhood:string
    n: number
    cep: number
    cpf: string
    cell: string
    permission: number
    xp: number
    premium: boolean
    registrationDate: string
    avatarurl?:string
    password?:string
}
export type UserProps = {
    list: user[],
    create: {
        request: {
            name: string
            email: string
            city: string
            street: string
            neighborhood:string
            n: number
            cep: number
            cpf: string
            cell: string
            permission: number
            premium: boolean
            password: string
        }
        crud: {
            id: string
            name: string
            email: string
            city: string
            street: string
            neighborhood:string
            n: number
            cep: number
            cpf: string
            cell: string
            permission: number
            xp: number
            premium: boolean
            registrationDate: string
            password: string
        }
    }
}