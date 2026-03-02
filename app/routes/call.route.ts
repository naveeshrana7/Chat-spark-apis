import { FastifyInstance } from 'fastify';
import { CallController } from '../controllers/call.controller';

export async function callRoutes(fastify: FastifyInstance) {
    fastify.post('/call/end', CallController.endCall);
}
