
  export interface TableSales {
    id: string;
    sales: { type: string, count: number }[];
    timestamp: Date;
    confirmed: boolean;
    status: string;  // Adding status
    tableNumber: number;  // Adding table number
  }