import { FastifyRequest, FastifyReply } from 'fastify';
import { LeaderboardService } from '../services/leaderboard.service';
import { ResponseHelper } from '../helpers/response.helper';
import { MESSAGES } from '../constants/messages.constant';

export class LeaderboardController {
    public static async getLeaderboard(req: FastifyRequest, reply: FastifyReply) {
        try {
            const leaderboard = await LeaderboardService.getTopCreators();
            return ResponseHelper.success(reply, leaderboard);
        } catch (e: unknown) {
            const error = e as Error;
            console.error('getLeaderboard Error:', error);
            return ResponseHelper.error(reply, MESSAGES.ERROR.INTERNAL_SERVER_ERROR, 500);
        }
    }

    public static async getCreatorStats(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const stats = await LeaderboardService.getCreatorStats(id);
            return ResponseHelper.success(reply, stats);
        } catch (e: unknown) {
            const error = e as Error;
            console.error('getCreatorStats Error:', error);
            return ResponseHelper.error(reply, MESSAGES.ERROR.INTERNAL_SERVER_ERROR, 500);
        }
    }
}
