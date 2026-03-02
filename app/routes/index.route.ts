import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { leaderboardRoutes } from './leaderboard.route';
import { callRoutes } from './call.route';

export async function registerCors(server: FastifyInstance) {
    await server.register(cors);
}

export async function registerNamespace(server: FastifyInstance) {
    server.register(leaderboardRoutes);
    server.register(callRoutes);
}
