export interface Offer {
    id: number;
    category: string;
    title: string;
    photo: string;
    memoryCapacity: number,
    storageSize: number,
    price: string; // type: no calculations are performed
    url: string;
}
