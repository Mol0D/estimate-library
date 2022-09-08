import IRow from "./row";

export default interface ISection {
    id: string;
    name: string;
    tasks: Array<IRow>;
    total: IRow;
}
