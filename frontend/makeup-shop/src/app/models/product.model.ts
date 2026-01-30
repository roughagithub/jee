export interface ProductCategory {
  id: number;
  categoryName: string;
}

export interface Product {
  id: number;
  category: ProductCategory;
  sku: string;
  name: string;
  description: string;
  unitPrice: number;
  imageUrl: string;
  active: boolean;
  unitsInStock: number;
  dateCreated: string;
  lastUpdate: string;
}
