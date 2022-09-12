import ITable from "./ITable";
import {IConfig} from "./IConfig";

export default interface IEstimate extends ITable {
    createTable: () => void;
    addSection: () => void;
    deleteSection: (sectionId: string) => void;
    addRow: (sectionId: string) => void;
    deleteRow: (sectionId: string, rowId: string) => void;
    duplicateSection: (duplicateSectionId: string) => void;
    duplicateRow: (sectionId: string, duplicateRowId: string) => void;
    updateSectionName: (sectionId: string, name: string) => void;
    updateRowName: (sectionId: string, rowId: string, name: string) => void;
    updateTaskValue: (sectionId: string, taskId: string, depId: number, value: number) => void;
    setConfig: (this: ITable, config?: Partial<IConfig>) => void;
}
