import { connection } from "../database/connection"
import { valuesBookSale } from "../types/bookSalesControllersTypes"
import { valuesProductSale } from "../types/productSalesControllersType";
import { ProductStockCrud } from "../types/productStockControllersTypes";
import { boockStockProps } from "../types/stockBoockControllersTypes";

interface returnMessageProps {
    isValidate: boolean,
    motive?: string,
    resolution?: string,
    currentAmount?: number
}

type keyValidationProps = 'books' | 'product'

export const validateSale = async (key: keyValidationProps, values: valuesBookSale | valuesProductSale) => {
    return new Promise<returnMessageProps>(async (resolve, reject) => {

        let stock;
        let returnMessage: returnMessageProps;

        switch (key) {
            case 'books':
                stock = await connection<boockStockProps>('bookStock')//@ts-expect-error
                    .where('idBook', values.idBook)
                    .select('*')
                    .first();
                break;

            case 'product':
                stock = await connection<ProductStockCrud>('productsStock')//@ts-expect-error
                    .where('idProduct', values.idProduct)
                    .select('*')
                    .first();
                break;
        }


        if (stock.amount === 0) {
            returnMessage = {
                isValidate: false,
                motive: `Insufficient amount of ${key} in stock`,
                resolution: `Add ${key} to stock`,
            }
            reject(returnMessage);
            return returnMessage
        };

        if (values.amount > stock.amount) {
            returnMessage = {
                isValidate: false,
                motive: `Insufficient amount of ${key} in stock`,
                resolution: `Add ${key} to stock`,
            }
            reject(returnMessage);
            return returnMessage;
        }

        if (values.soldPrice < stock.factoryPrice) {
            returnMessage = {
                isValidate: false,
                motive: 'Price cannot be sold below factory price',
                resolution: `Increase ${key} price`
            }
            reject(returnMessage);
            return returnMessage;
        }

        returnMessage = {
            isValidate: true,
            currentAmount: stock.amount
        }
        resolve(returnMessage);
        return returnMessage;
    })
}