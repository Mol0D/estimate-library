import IRow from "./IRow";

export default interface ISection {
    id: string;
    name: string;
    tasks: Array<IRow>;
    total: IRow;
}
