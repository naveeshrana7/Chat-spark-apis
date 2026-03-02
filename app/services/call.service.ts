import { Call } from '../models/call.model';
import { ICallPayload } from '../interfaces/call.interface';
import { MESSAGES } from '../constants/messages.constant';

export class CallService {
    public static async endCall(payload: ICallPayload): Promise<Call> {
        try {
            const call = await Call.create(payload as import("sequelize").Optional<ICallPayload, "id" | "status">);
            console.log('respose from call', call);
            return call;
        } catch (e: unknown) {
            const error = e as Error;
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error(MESSAGES.ERROR.CALL_LOG_EXISTS);
            }
            throw error;
        }
    }
}
