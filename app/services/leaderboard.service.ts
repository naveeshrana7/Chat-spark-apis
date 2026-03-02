import { Call } from '../models/call.model';
import { sequelize } from './database/sequelize.service';
import { ILeaderboardEntry, ICreatorStats } from '../interfaces/call.interface';
import { CONSTANTS } from '../configs/server.config';
import { Op } from 'sequelize';

export class LeaderboardService {
    public static async getTopCreators(): Promise<ILeaderboardEntry[]> {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const leaderboard = await Call.findAll({
            where: {
                started_at: {
                    [Op.gte]: sevenDaysAgo
                }
            },
            attributes: [
                'creator_id',
                [sequelize.literal('SUM("duration_seconds") / 60.0'), 'totalMinutes']
            ],
            group: ['creator_id'],
            order: [[sequelize.literal('"totalMinutes"'), 'DESC']],
            limit: 10,
            raw: true
        });

        return leaderboard.map((l: unknown) => {
            const item = l as { creator_id: string; totalMinutes: string | number };
            return {
                creator_id: item.creator_id,
                totalMinutes: Number(Number(item.totalMinutes).toFixed(2))
            };
        });
    }

    public static async getCreatorStats(creatorId: string): Promise<ICreatorStats> {
        const stats = await Call.findOne({
            where: { creator_id: creatorId },
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalCalls'],
                [sequelize.literal('COALESCE(SUM("duration_seconds"), 0) / 60.0'), 'totalMinutes']
            ],
            raw: true
        });

        const statsData = (stats as unknown as { totalCalls: string | number; totalMinutes: string | number }) || { totalCalls: 0, totalMinutes: 0 };
        const totalCalls = Number(statsData.totalCalls) || 0;
        const totalMinutes = Number(statsData.totalMinutes) || 0;
        const totalEarnings = totalMinutes * CONSTANTS.EARNINGS_RATE_PER_MIN;

        return {
            creator_id: creatorId,
            totalCalls,
            totalMinutes: Number(totalMinutes.toFixed(2)),
            totalEarnings: Number(totalEarnings.toFixed(2))
        };
    }
}
