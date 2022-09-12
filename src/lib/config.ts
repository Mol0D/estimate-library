import {IConfig} from "../types/IConfig";
import ITable from "../types/ITable";
import {calculateTable} from "./core";

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
    };

    if (this.total) calculateTable.call(this);
};

