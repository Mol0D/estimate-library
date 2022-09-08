import { v4 as uuidv4 } from 'uuid';
import IRow from "../types/row";
import IDepartment from "../types/department";

export const createRow = (departments: Array<IDepartment>, name: string = 'Row'): IRow => {
    return {
        id: uuidv4(),
        name,
        departments,
        costPrice: 0,
        price: 0,
    }
}

export const duplicateRow = (row: IRow): IRow => ({
    ...row,
    id: uuidv4(),
});

export const updateRowName = (row: IRow, newName: string): IRow => ({
    ...row,
    name: newName,
})

export const addDepartmentToRow = (row: IRow, department: IDepartment): IRow => calculateRow({
    ...row,
    departments: [...row.departments, department]
});

export const updateDepartmentInRow = (row: IRow, depId: number, value: number): IRow => calculateRow({
    ...row,
    departments: row.departments.map((item: IDepartment) => {
        if (item.id === depId) {
            return {
                ...item,
                value,
            }
        }

        return item;
    }),
});

export const deleteDepartmentFromRow = (row: IRow, depId: number): IRow => calculateRow({
    ...row,
    departments: row.departments.filter(item => item.id !== depId),
});

export const calculateRow = (row: IRow): IRow => {
    const costPrice = row.departments.reduce((acc, dep) => acc + (dep.rate * dep.value), 0);

    const price = costPrice + (costPrice * 0.1); // hardcode

    return {
        ...row,
        costPrice,
        price,
    }
}

export const resetRowDepartments = (row: IRow): IRow => {
    return {
        ...row,
        departments: row.departments.map((dep: IDepartment) => ({ ...dep, value: 0}))
    }
}
