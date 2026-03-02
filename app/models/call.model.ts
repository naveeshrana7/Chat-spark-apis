import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database/sequelize.service';
import { ICallPayload } from '../interfaces/call.interface';

export class Call extends Model<ICallPayload, Optional<ICallPayload, 'id' | 'status'>> {
    public id!: string;
    public call_id!: string;
    public caller_id!: string;
    public creator_id!: string;
    public duration_seconds!: number;
    public status!: string;
    public started_at!: string;
}

Call.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        call_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        caller_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        creator_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration_seconds: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'completed'
        },
        started_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'calls',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'ended_at'
    }
);

