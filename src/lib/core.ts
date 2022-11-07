import IDepartment from "../types/IDepartment";
import ITable from "../types/ITable";
import ISection from "../types/ISection";
import {
    calculateSection,
    createDuplicateSection,
    createRowInSection,
    createSection,
    deleteRowFromSection,
    duplicateRowInSection,
    toggleRowInSection,
    updateDepartmentValueInSection,
    updateNameSection,
    updateTask
} from "./sections";
import {createRow, resetRowDepartments } from "./row";
import {calculateAdditionalRow, calculateAdditionalRowPrice, calculateRow} from "./calculations";
import IRow from "../types/IRow";

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

/**
 * toggle state of task to enable or disable
 * @param sectionId
 * @param taskId
 */
export function toggleTaskInSection(this: ITable, sectionId: string, taskId: string) {
    this.sections = this.sections.map((section: ISection) => {
        if (section.id === sectionId) return toggleRowInSection.call(this, section, taskId)

        return section;
    });

    calculateTable.call(this);
}

export function toggleDepartment(this: ITable, depId: number) {
    this.config.departments = this.config.departments.map((department: IDepartment) => {
       if (department.id === depId) return {
           ...department,
       };

       return department;
    });
}

/**
 * save section order after drag and drop event
 * @param sections
 */
export function updateSectionsOrder(this: ITable, sections: Array<ISection>) {
    this.sections = sections;
}

/**
 * save and calculate sections after drag and drop event for some task
 * @param sections
 */
export function updateTasksOrder(this: ITable, sections: Array<ISection>) {
    this.sections = sections.map((section: ISection) => {
        return calculateSection.call(this, {
            ...section,
            tasks: section.tasks.map((row: IRow) => calculateRow.call(this, row)),
            total: calculateRow.call(this, section.total)
        });
    });
}

function calculateSubtotal(this: ITable) {
    const subtotal = resetRowDepartments(this.subtotal);

    this.sections.forEach((section: ISection) =>
        section.total.departments.forEach((dep: IDepartment, d: number) => {
            subtotal.departments[d].value += dep.value * dep.rate
        }))

    subtotal.costPrice = subtotal.departments.reduce((acc, dep) => acc + dep.value, 0);
    subtotal.margin = (subtotal.costPrice * this.config.margin) / 100;
    subtotal.price = subtotal.costPrice + subtotal.margin;
    this.subtotal = subtotal;
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


    this.discount = { ...discountRow, price: calculateAdditionalRowPrice.call(this, discountRow.departments) };
    this.fees = { ...feesRow, price: calculateAdditionalRowPrice.call(this, feesRow.departments) };
    this.taxes = { ...taxesRow, price: calculateAdditionalRowPrice.call(this, taxesRow.departments) };
    this.total = { ...totalRow, price: calculateAdditionalRowPrice.call(this, totalRow.departments) };
}

export function calculateTable(this: ITable) {
    calculateSubtotal.call(this);
    calculateAdditionalRows.call(this);
}
