import IRow from "./IRow";
import ISection from "./ISection";
import {IConfig} from "./IConfig";

export default interface ITable {
    sections: Array<ISection>;
    subtotal: IRow;
    discount: IRow;
    fees: IRow;
    taxes: IRow;
    total: IRow;
    config: IConfig;
}
