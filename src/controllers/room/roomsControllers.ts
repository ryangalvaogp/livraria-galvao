import { Response, Request } from 'express';
import { connection } from '../../database/connection';
import crypto from 'crypto';
import { RoomProps } from '../../types/roomControllersTypes';
import checkAuthorization from '../../utils/checkAuthorization';

export default {
    async index(req: Request, res: Response) {
        const allRooms = await connection<RoomProps>('room').select('*');

        return res.json(allRooms);
    },

    async create(req: Request, res: Response) {
        const { authorization } = req.headers;
        const valuesRoomInsert: RoomProps = {
            id: crypto.randomBytes(4).toString('hex'),
            title: req.body.title,
        };

        try {
            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };
            
            await connection<RoomProps>('room').insert(valuesRoomInsert);

            return res.json({ status: `Room ${valuesRoomInsert.title} has been successfully added` });
        } catch (error) {
            return res.json({
                status: "Error registering room",
                error,
            });
        };
    },

    async showOne(req: Request, res: Response) {
        const { id: idRoom } = req.params;

        try {
            const room = await connection<RoomProps>('room')
                .select('*')
                .where('id', idRoom)
                .first();

            return res.json(room);
        } catch (error) {
            return res.json({
                status: `Error showing room`,
                error,
            });
        };
    },

    async Modify(req: Request, res: Response) {

    },
    async Delete(req: Request, res: Response) {
        const { id: idRoom } = req.params;
        const { authorization } = req.headers;

        try {
            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };
            await connection<RoomProps>('room')
                .where('id', idRoom)
                .delete();

            return res.json({ status: `Successfully deleted room` });
        } catch (error) {
            return res.json({
                status: `Error deleting room`,
                error,
            });
        };
    },
};