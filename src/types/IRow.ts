import IDepartment from "./IDepartment";

export default interface IRow {
    id: string;
    isDisabled: boolean;
    name: string;
    departments: Array<IDepartment>
    costPrice: number;
    margin: number;
    price: number;
}
