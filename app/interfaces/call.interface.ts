export interface ICallPayload {
    id?: string;
    call_id: string;
    caller_id: string;
    creator_id: string;
    duration_seconds: number;
    status?: string;
    started_at: string;
}

export interface ILeaderboardEntry {
    creator_id: string;
    totalMinutes: number;
}

export interface ICreatorStats {
    creator_id: string;
    totalCalls: number;
    totalMinutes: number;
    totalEarnings: number;
}

