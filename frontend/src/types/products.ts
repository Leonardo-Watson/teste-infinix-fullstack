export type Product = {
    id: number;
    name: string;
    price: string;
    in_stock: boolean;
    category?: string | null;
};

export type ProductCreatePayload = {
    name: string;
    price: string;
    in_stock: boolean;
    category_id?: number | null;
};
