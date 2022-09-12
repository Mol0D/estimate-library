import IRow from "../types/IRow";
import { v4 as uuidv4 } from 'uuid';
import IDepartment from "../types/IDepartment";
import {
    addDepartmentToRow,
    calculateRow,
    createRow,
    deleteDepartmentFromRow, duplicateRow,
    updateDepartmentInRow,
    updateRowName
} from ".//row";
import ISection from "../types/ISection";

export function createSection (departments: Array<IDepartment>, sectionName: string): ISection  {
    return {
        id: uuidv4(),
        name: sectionName || '',
        tasks: [createRow(departments)],
        total: createRow(departments, 'Subtotal'),
    }
}

export const createRowInSection = (section: ISection, departments: Array<IDepartment>): ISection => {
    return calculateSection({
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

export const duplicateRowInSection = (section: ISection, rowId: string): ISection => {
    const duplicatedRowIndex = section.tasks.findIndex(row => row.id === rowId);
    const duplicatedTask = section.tasks[duplicatedRowIndex];
    section.tasks.splice(duplicatedRowIndex, 0, duplicateRow(duplicatedTask));

    return calculateSection(section);
}

export const deleteRowFromSection = (section: ISection, rowId: string): ISection => {
    return calculateSection({
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

export const addDepartmentToSection = (section: ISection, department: IDepartment): ISection => {
    return calculateSection({
        ...section,
        tasks: section.tasks.map((task: IRow) => addDepartmentToRow(task, department)),
        total: addDepartmentToRow(section.total, department),
    })
}

export const deleteDepartmentFromSection = (section: ISection, depId: number): ISection => {
    return calculateSection({
        ...section,
        tasks: section.tasks.map((task: IRow) => deleteDepartmentFromRow(task, depId)),
        total: deleteDepartmentFromRow(section.total, depId),
    })
}

export const updateDepartmentValueInSection = (section: ISection, rowId: string, depId: number, value: number): ISection => {
    return calculateSection({
        ...section,
        tasks: section.tasks.map((task: IRow) => {
            if (task.id === rowId) return updateDepartmentInRow(task, depId, value);

            return task
        })
    })
}

export const calculateSection = (section: ISection): ISection => {
    const total = section.total;

    section.tasks.forEach((task: IRow) => {
        total.departments.forEach((_: IDepartment, d: number) => total.departments[d].value = 0);

        task.departments.forEach((dep: IDepartment, d: number) => total.departments[d].value += dep.value)
    });

    return {
        ...section,
        total: calculateRow(total),
    }
}
