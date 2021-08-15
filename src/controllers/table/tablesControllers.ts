import { Response, Request } from 'express';
import { connection } from '../../database/connection';
import crypto from 'crypto';
import { TableProps } from '../../types/tablesControllers';
import checkAuthorization from '../../utils/checkAuthorization';

export default {
    async index(req: Request, res: Response) {
        const allTables = await connection<TableProps>('table').select('*');

        return res.json(allTables);
    },

    async create(req: Request, res: Response) {
        const { roomid: roomId } = req.headers;
        const { authorization } = req.headers;
        const values: TableProps = req.body;

        const id = crypto.randomBytes(4).toString('hex');

        const valuesTableInsert: TableProps = {
            id,
            title: values.title,
            capacity: values.capacity,
            roomId,
        };

        try {
            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };
            await connection<TableProps>('table').insert(valuesTableInsert);

            return res.json({ status: `Table ${valuesTableInsert.title} has been successfully added` });
        } catch (error) {
            return res.json({
                status: "Error registering table",
                error,
            });
        };
    },

    async showOne(req: Request, res: Response) {
        const { id: idTable } = req.params;

        try {
            const table = await connection<TableProps>('table')
                .select('*')
                .where('id', idTable)
                .first();

            return res.json(table);
        } catch (error) {
            return res.json({
                status: `Error showing table`,
                error
            });
        };
    },

    async showAllTablesInTheRoom(req: Request, res: Response) {
        const { id: roomId } = req.params;

        try {
            const tables = await connection<TableProps>('table')
                .select('*')
                .where('roomId', roomId);

            return res.json(tables);
        } catch (error) {
            return res.json({
                status: `Error showing tables`,
                error
            });
        };
    },

    async Modify(req: Request, res: Response) {

    },

    async Delete(req: Request, res: Response) {
        const { id: idTable } = req.params;
        const { authorization } = req.headers;

        try {
            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };
            await connection<TableProps>('table')
                .where('id', idTable)
                .delete();

            return res.json({ status: `Successfully deleted table` });
        } catch (error) {
            return res.json({
                status: `Error deleting table`,
                error
            });
        };
    },
};