import { connection } from "../database/connection"
import { valuesBookSale } from "../types/bookSalesControllersTypes"
import { boockStockProps } from "../types/stockBoockControllersTypes";

interface returnMessageProps {
    isValidate: boolean,
    motive?: string,
    resolution?: string,
    currentAmount?: number
}

export const validateSale = async (values: valuesBookSale) => {
    return new Promise<returnMessageProps>(async (resolve, reject) => {
        const bookStock = await connection<boockStockProps>('bookStock')
        .where('idBook', values.idBook)
        .select('*')
        .first();

        let returnMessage: returnMessageProps;

        if (bookStock.amount === 0) {
            returnMessage = {
                isValidate: false,
                motive: 'Insufficient amount of books in stock',
                resolution: 'Add books to stock'
            }
            reject(returnMessage);
            return returnMessage
        };

        if (values.amount > bookStock.amount) {
            returnMessage = {
                isValidate: false,
                motive: 'Insufficient amount of books in stock',
                resolution: 'Add books to stock',
            }
            reject(returnMessage);
            return returnMessage;
        }

        if (values.soldPrice < bookStock.factoryPrice) {
            returnMessage = {
                isValidate: false,
                motive: 'Price cannot be sold below factory price',
                resolution: 'Increase book price'
            }
            reject(returnMessage);
            return returnMessage;
        }

        returnMessage = {
            isValidate: true,
            currentAmount: bookStock.amount
        }
        resolve(returnMessage);
        return returnMessage;
    })
}