import { FastifyRequest, FastifyReply } from 'fastify';
import { CallService } from '../services/call.service';
import { ICallPayload } from '../interfaces/call.interface';
import { ResponseHelper } from '../helpers/response.helper';
import { MESSAGES } from '../constants/messages.constant';

export class CallController {
    public static async endCall(req: FastifyRequest, reply: FastifyReply) {
        try {
            const body = req.body as ICallPayload;
            
            if (!body.call_id || !body.caller_id || !body.creator_id || body.duration_seconds === undefined || !body.started_at) {
                return ResponseHelper.error(reply, MESSAGES.ERROR.MISSING_FIELDS, 400);
            }

            const call = await CallService.endCall(body);
            return ResponseHelper.success(reply, call, MESSAGES.SUCCESS.CALL_LOG_SAVED, 201);
        } catch (e: unknown) {
            const error = e as Error;
            if (error.message === MESSAGES.ERROR.CALL_LOG_EXISTS) {
                return ResponseHelper.error(reply, error.message, 409);
            }
            console.error('endCall Error:', error);
            return ResponseHelper.error(reply, MESSAGES.ERROR.INTERNAL_SERVER_ERROR, 500);
        }
    }
}
