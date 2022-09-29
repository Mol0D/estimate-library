import {
    createTable,
    updateTaskDepValue,
    addSection,
    deleteSection,
    addRow,
    deleteRow,
    duplicateSection,
    duplicateRow,
    updateSectionName,
    updateRowName, toggleTaskInSection,
} from "./lib/core";
import {IConfig} from "./types/IConfig";
import {setConfig} from "./lib/config";
import IEstimate from "./types/IEstimate";

function Table (config?: Partial<IConfig>): IEstimate {
    const table = Object.create(Table.prototype);

    table.setConfig(config);

    return table;
}

Table.prototype.createTable = createTable;
Table.prototype.addSection = addSection;
Table.prototype.deleteSection = deleteSection;
Table.prototype.addRow = addRow;
Table.prototype.deleteRow = deleteRow;
Table.prototype.duplicateSection = duplicateSection;
Table.prototype.duplicateRow = duplicateRow;
Table.prototype.updateSectionName = updateSectionName;
Table.prototype.updateRowName = updateRowName;
Table.prototype.updateTaskValue = updateTaskDepValue;
Table.prototype.setConfig = setConfig;
Table.prototype.toggleTaskInSection = toggleTaskInSection;

export default Table;
