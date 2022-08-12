export interface MenzaDataResponse {
    fromDay: string;
    toDay: string;
    items: number;
    menu: MenzaMeal[];
}

export interface MenzaMeal {
    name: string;
    category: string;
    special: string[];
    count: number;
    price: number;
}