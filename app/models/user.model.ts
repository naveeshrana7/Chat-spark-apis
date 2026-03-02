import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database/sequelize.service';
import { IUserPayload } from '../interfaces/user.interface';

export class User extends Model<IUserPayload, Optional<IUserPayload, 'id' | 'coin_balance'>> {
    public id!: string;
    public name!: string;
    public gender!: string;
    public coin_balance!: number;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        coin_balance: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);
