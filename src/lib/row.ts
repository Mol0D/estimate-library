import { v4 as uuidv4 } from 'uuid';
import IRow from "../types/IRow";
import IDepartment from "../types/IDepartment";
import ITable from "../types/ITable";
import { calculateRow } from "./calculations";

export const createRow = (departments: Array<IDepartment>, name: string = 'Row'): IRow => {
    return {
        id: uuidv4(),
        isDisabled: false,
        name,
        departments,
        costPrice: 0,
        margin: 0,
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

export function addDepartmentToRow (this: ITable, row: IRow, department: IDepartment): IRow {
    return calculateRow.call(this,{
        ...row,
        departments: [...row.departments, department]
    })
}

export function updateDepartmentInRow (this: ITable, row: IRow, depId: number, value: number): IRow {
    return calculateRow.call(this,{
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
    })
}

export function deleteDepartmentFromRow (this: ITable, row: IRow, depId: number): IRow {
    return calculateRow.call(this,{
        ...row,
        departments: row.departments.filter(item => item.id !== depId),
    });
}

export function toggleDepartmentInRow (this: ITable, row: IRow, depId: number): IRow {
    return {
        ...row,
        departments: row.departments.map((department: IDepartment) => {
            if (department.id === depId) {
                return {
                    ...department,
                    isDisabled: !department.isDisabled
                }
            }

            return department;
        })
    }
}

export function toggleRow (this: ITable, row: IRow): IRow {
  return calculateRow.call(this, {
      ...row,
      isDisabled: !row.isDisabled,
  });
};

export const resetRowDepartments = (row: IRow): IRow => {
    return {
        ...row,
        departments: row.departments.map((dep: IDepartment) => ({ ...dep, value: 0}))
    }
}
