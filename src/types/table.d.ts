import IRow from "./row";
import ISection from "./section";
import {IConfig} from "./config";

export default interface ITable {
    sections: Array<ISection>;
    subtotal: IRow;
    discount: IRow;
    fees: IRow;
    taxes: IRow;
    total: IRow;
    config: IConfig;
}
