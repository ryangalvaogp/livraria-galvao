export type TableProps = {
    id: string
    title: string
    capacity: number
    isBusy?: boolean
    roomId: string | string[]
}

export type TableReqBodyProps = {
    title: string
    capacity: number
}