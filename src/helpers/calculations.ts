import ITable from "../types/table";

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

