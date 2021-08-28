export type PasswordRecoveryLog = {
    id: string
    idUser:string
    resetToken:string
    resetExpires:Date
    isReseted:boolean
}