export interface ITransactionPayload {
    id?: string;
    user_id: string;
    amount: number;
    type: string;
    reference_id?: string;
    created_at?: Date;
    updated_at?: Date;
}
