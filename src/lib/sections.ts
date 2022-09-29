import IRow from "../types/IRow";
import { v4 as uuidv4 } from 'uuid';
import IDepartment from "../types/IDepartment";
import {
    addDepartmentToRow,
    createRow,
    deleteDepartmentFromRow,
    duplicateRow,
    resetRowDepartments, toggleRow,
    updateDepartmentInRow,
    updateRowName
} from "./row";
import ISection from "../types/ISection";
import { calculateRow } from "./calculations";
import ITable from "../types/ITable";

export function createSection (departments: Array<IDepartment>, sectionName: string): ISection  {
    return {
        id: uuidv4(),
        name: sectionName || '',
        tasks: [createRow(departments)],
        total: createRow(departments, 'Subtotal'),
    }
}

export function createRowInSection (this: ITable, section: ISection, departments: Array<IDepartment>): ISection {
    return calculateSection.call(this,{
        ...section,
        tasks: [ ...section.tasks, createRow(departments)]
    });
}

export const createDuplicateSection = (section: ISection): ISection => {
    return {
        ...section,
        id: uuidv4(),
    }
}

export function duplicateRowInSection (this:ITable, section: ISection, rowId: string): ISection {
    const duplicatedRowIndex = section.tasks.findIndex(row => row.id === rowId);
    const duplicatedTask = section.tasks[duplicatedRowIndex];
    section.tasks.splice(duplicatedRowIndex, 0, duplicateRow(duplicatedTask));

    return calculateSection.call(this, section);
}

export function deleteRowFromSection (this:ITable, section: ISection, rowId: string): ISection {
    return calculateSection.call(this,{
        ...section,
        tasks: section.tasks.filter((task: IRow) => task.id !== rowId)
    })
}

export const updateNameSection = (section: ISection, name: string): ISection => {
    return {
        ...section,
        name
    }
};

export const updateTask = (section: ISection, rowId: string, name: string): ISection => {
    return {
        ...section,
        tasks: section.tasks.map((task: IRow) => {
            if(task.id === rowId) return updateRowName(task, name);

            return task
        })
    }
}

export function addDepartmentToSection (this: ITable, section: ISection, department: IDepartment): ISection {
    return calculateSection.call(this,{
        ...section,
        tasks: section.tasks.map((task: IRow) => addDepartmentToRow.call(this, task, department)),
        total: addDepartmentToRow.call(this, section.total, department),
    })
}

export function deleteDepartmentFromSection (this:ITable, section: ISection, depId: number): ISection {
    return calculateSection.call(this,{
        ...section,
        tasks: section.tasks.map((task: IRow) => deleteDepartmentFromRow.call(this, task, depId)),
        total: deleteDepartmentFromRow.call(this, section.total, depId),
    })
}

export function updateDepartmentValueInSection (this: ITable, section: ISection, rowId: string, depId: number, value: number): ISection {
    return calculateSection.call(this, {
        ...section,
        tasks: section.tasks.map((task: IRow) => {
            if (task.id === rowId) return updateDepartmentInRow.call(this, task, depId, value);

            return task
        })
    })
}

export function toggleRowInSection (this: ITable, section: ISection, rowId: string): ISection {
    return calculateSection.call(this, {
        ...section,
        tasks: section.tasks.map((task: IRow) => {
            if (task.id === rowId) return toggleRow.call(this, task);

            return task;
        })
    })
};

export function calculateSection (this: ITable, section: ISection): ISection {
    const total = resetRowDepartments(section.total);

    section.tasks.forEach((task: IRow) => {
        if (!task.isDisabled) task.departments.forEach((dep: IDepartment, d: number) => total.departments[d].value += dep.value);
    });

    return {
        ...section,
        total: calculateRow.call(this, total),
    }
}
