import ITable from "../types/ITable";
import IRow from "../types/IRow";
import IDepartment from "../types/IDepartment";

const getMargin = (costPrice: number, discountPercent: number) => normalizePrice(costPrice * divIn100(discountPercent));

const getDiscount = (subtotal: number, discountPercent: number) =>
    normalizePrice(subtotal * divIn100(discountPercent));

const getFees = (subtotal: number, discount:number, feesPercent: number) =>
    normalizePrice((subtotal - discount) * divIn100(feesPercent))

const getTax = (
    subtotal: number,
    discount: number,
    fees: number,
    taxPercent: number) => normalizePrice((subtotal - discount + fees) * divIn100(taxPercent));

const getTotal = (
    subtotal: number,
    discount: number,
    fees: number,
    tax: number
) => normalizePrice(subtotal - discount + fees + tax);

const divIn100 = (n: number) => n / 100;

const normalizePrice = (n: number) => +n.toFixed(2);

export function calculateRow(this: ITable, row: IRow): IRow {
    const costPrice = row.departments.reduce((acc, dep) => acc + normalizePrice(dep.rate * (dep.isDisabled ? 0 : dep.value)), 0);
    const margin = getMargin(costPrice, this.config.margin);
    const price = costPrice + margin;

    return {
        ...row,
        costPrice,
        margin,
        price,
    }
}

export function calculateAdditionalRow(this: ITable, subtotal: number) {
    const discount = getDiscount(subtotal, this.config.discount);
    const fees = getFees(subtotal, discount, this.config.fees);
    const tax = getTax(subtotal, discount, fees, this.config.taxes);
    const total = getTotal(subtotal, discount, fees, tax);

    return {
        discount,
        fees,
        tax,
        total,
    }
}

export function calculateAdditionalRowPrice(this: ITable, departments: Array<IDepartment>): number {
    return departments.reduce((acc, dep) => (acc + dep.value), 0)
}

