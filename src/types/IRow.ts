import IDepartment from "./IDepartment";

export default interface IRow {
    id: string;
    name: string;
    departments: Array<IDepartment>
    costPrice: number;
    price: number;
}
