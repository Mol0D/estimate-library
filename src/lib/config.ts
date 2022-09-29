import {IConfig} from "../types/IConfig";
import ITable from "../types/ITable";
import {calculateTable} from "./core";
import IDepartment from "../types/IDepartment";
import {calculateRow} from "./calculations";
import {calculateSection} from "./sections";
import ISection from "../types/ISection";
import IRow from "../types/IRow";
import {toggleDepartmentInRow} from "./row";

export const initialConfig = (): IConfig => ({
    defaultRowName: 'New Row',
    defaultSectionName: 'New section',
    margin: 0,
    fees: 0,
    discount: 0,
    taxes: 0,
    departments: [],
});

export function setConfig (this: ITable, config?: Partial<IConfig>) {
    this.config = {
        ...initialConfig(),
        ...config,
        departments: config?.departments!.map((department: IDepartment) => ({
            ...department,
            isDisabled: false,
        })) || [],
    };

    if (this.total) calculateTable.call(this);
};

export function updateConfig (this: ITable, config: Partial<IConfig>) {
    this.config = {
        ...this.config,
        ...config,
        departments: [...this.config.departments, ...config?.departments!.map((department: IDepartment) => ({
            ...department,
            isDisabled: false,
        }))]
    };


};

export function toggleDepartment (this: ITable, depId: number) {
   this.config.departments = this.config.departments.map((department: IDepartment) => {
       if (department.id === depId) {
           return {
               ...department,
               isDisabled: !department.isDisabled
           }
       }

       return department;
   });

   this.sections = this.sections.map((section: ISection) => {
       return calculateSection.call(this, {
           ...section,
           tasks: section.tasks.map((row: IRow) => calculateRow.call(this, toggleDepartmentInRow.call(this, row, depId))),
           total: calculateRow.call(this, toggleDepartmentInRow.call(this, section.total, depId))
       });
   });
   this.subtotal = toggleDepartmentInRow.call(this, this.subtotal, depId);
   this.discount = toggleDepartmentInRow.call(this, this.discount, depId);
   this.fees = toggleDepartmentInRow.call(this, this.fees, depId);
   this.taxes = toggleDepartmentInRow.call(this, this.taxes, depId);
   this.total = toggleDepartmentInRow.call(this, this.total, depId);

    calculateTable.call(this);
};
