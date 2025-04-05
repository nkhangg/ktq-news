export interface ILoginDTO {
    email: string;
    password: string;
}

export interface IRegisterDTO extends ILoginDTO {
    name: string;
}
