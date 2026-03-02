import { FastifyReply } from 'fastify';

export class ResponseHelper {
    public static success(reply: FastifyReply, data: unknown, message?: string, statusCode: number = 200) {
        return reply.status(statusCode).send({
            success: true,
            ...(message && { message }),
            data
        });
    }

    public static error(reply: FastifyReply, error: string, statusCode: number = 500) {
        return reply.status(statusCode).send({
            success: false,
            error
        });
    }
}
