import IDepartment from "./IDepartment";

export interface IConfig {
    defaultRowName: string;
    defaultSectionName: string;
    margin: number;
    fees: number;
    discount: number;
    taxes: number;
    departments: Array<IDepartment>;
}
