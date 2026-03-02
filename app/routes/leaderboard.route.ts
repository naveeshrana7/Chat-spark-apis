import { FastifyInstance } from 'fastify';
import { LeaderboardController } from '../controllers/leaderboard.controller';

export async function leaderboardRoutes(fastify: FastifyInstance) {
    fastify.get('/leaderboard', LeaderboardController.getLeaderboard);
    fastify.get('/creator/:id/stats', LeaderboardController.getCreatorStats);
}
