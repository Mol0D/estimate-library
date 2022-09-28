import IDepartment from "../types/IDepartment";
import ITable from "../types/ITable";
import ISection from "../types/ISection";
import {
    createDuplicateSection,
    createRowInSection,
    createSection,
    deleteRowFromSection,
    duplicateRowInSection,
    updateDepartmentValueInSection,
    updateNameSection,
    updateTask
} from "./sections";
import { createRow, resetRowDepartments } from "./row";
import {calculateAdditionalRow, calculateRow} from "./calculations";

/**
 * create table from scratch with config parameters
 */
export function createTable (this: ITable) {
    const { defaultSectionName, departments } = this.config

    this.sections = [createSection(departments, defaultSectionName)];
    this.subtotal = createRow(departments, 'Subtotal');
    this.discount = createRow(departments, 'Discount');
    this.fees = createRow(departments, 'Fees');
    this.taxes = createRow(departments, 'Taxes')
    this.total = createRow(departments, 'Total');
}

/**
 * add new section to the bottom of table
 */
export function addSection (this: ITable) {
    this.sections.push(createSection(this.config.departments, this.config.defaultSectionName));
}

/**
 * delete section from current table
 * @param sectionId
 */
export function deleteSection (this: ITable, sectionId: string) {
    this.sections = this.sections.filter(section => section.id !== sectionId);

    calculateTable.call(this);
}

/**
 * add new row to section
 * @param sectionId
 */
export function addRow (this: ITable, sectionId: string) {
    this.sections = this.sections.map(section => {
        if(section.id === sectionId) return createRowInSection.call(this, section, this.config.departments);

        return section;
    })
}

/**
 * delete row from section
 * @param sectionId
 * @param rowId
 */
export function deleteRow(this: ITable, sectionId: string, rowId: string) {
    this.sections = this.sections.map(section => {
        if(section.id === sectionId) return deleteRowFromSection.call(this, section, rowId);

        return section;
    })

    calculateTable.call(this);
}

/**
 * duplicate already existed section
 * @param duplicateSectionId
 */
export function duplicateSection(this: ITable, duplicateSectionId: string) {
    const duplicatedSectionIndex = this.sections.findIndex(section => section.id === duplicateSectionId);
    const duplicatedSection = this.sections[duplicatedSectionIndex];

    this.sections.splice(duplicatedSectionIndex, 0, createDuplicateSection(duplicatedSection));

    calculateTable.call(this);
}

/**
 * duplicate already existed row
 * @param sectionId
 * @param duplicateRowId
 */
export function duplicateRow(this: ITable, sectionId: string, duplicateRowId: string) {
    this.sections = this.sections.map(section => {
        if (section.id === sectionId) return duplicateRowInSection.call(this, section, duplicateRowId);

        return section;
    });

    calculateTable.call(this);
}

/**
 * update current section name
 * @param sectionId
 * @param name
 */
export function updateSectionName(this: ITable, sectionId: string, name: string) {
    this.sections = this.sections.map((section: ISection) => {
        if(section.id === sectionId) return updateNameSection(section, name);

        return section;
    })
}

/**
 * update current row name
 * @param sectionId
 * @param rowId
 * @param name
 */
export function updateRowName(this: ITable, sectionId: string, rowId: string, name: string) {
    this.sections = this.sections.map((section: ISection) => {
        if (section.id === sectionId) return updateTask(section, rowId, name);

        return section;
    })
}

/**
 * update value of department in task
 * @param sectionId
 * @param taskId
 * @param depId
 * @param value
 */
export function updateTaskDepValue(this: ITable, sectionId: string, taskId: string, depId: number, value: number){
    this.sections = this.sections.map((section: ISection) => {
        if (section.id === sectionId) return updateDepartmentValueInSection.call(this, section, taskId, depId, value)

       return section;
    });

    calculateTable.call(this);
}

function calculateSubtotal(this: ITable) {
    const subtotal = resetRowDepartments(this.subtotal);

    this.sections.forEach((section: ISection) =>
        section.total.departments.forEach((dep: IDepartment, d: number) => {
            subtotal.departments[d].value += dep.value
        }))

    this.subtotal = calculateRow.call(this, subtotal);
}

function calculateAdditionalRows(this: ITable) {
    const discountRow = resetRowDepartments(this.discount);
    const feesRow = resetRowDepartments(this.fees);
    const taxesRow = resetRowDepartments(this.taxes);
    const totalRow = resetRowDepartments(this.total);

    this.subtotal.departments.forEach((dep: IDepartment, d: number) => {
        const { discount, fees, total, tax } = calculateAdditionalRow.call(this, dep.value);

        discountRow.departments[d].value = discount;
        feesRow.departments[d].value = fees;
        taxesRow.departments[d].value = tax;
        totalRow.departments[d].value = total
    });


    this.discount = calculateRow.call(this, discountRow);
    this.fees = calculateRow.call(this, feesRow);
    this.taxes = calculateRow.call(this, taxesRow);
    this.total = calculateRow.call(this, totalRow);
}

export function calculateTable(this: ITable) {
    calculateSubtotal.call(this);
    calculateAdditionalRows.call(this);
}
