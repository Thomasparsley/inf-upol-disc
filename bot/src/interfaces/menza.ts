export interface MenzaDataResponse {
    menu: MenzaMeal[]
}

export interface MenzaMeal {
    name: string
    category: string
    count: number
    price: number
}