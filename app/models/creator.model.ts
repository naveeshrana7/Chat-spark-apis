import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database/sequelize.service';
import { ICreatorPayload } from '../interfaces/creator.interface';
import { User } from './user.model';

export class Creator extends Model<ICreatorPayload, Optional<ICreatorPayload, 'id' | 'tier' | 'status' | 'total_earnings'>> {
    public id!: string;
    public user_id!: string;
    public tier!: string;
    public status!: string;
    public total_earnings!: number;
}

Creator.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        tier: {
            type: DataTypes.STRING,
            defaultValue: 'Standard'
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'offline'
        },
        total_earnings: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        }
    },
    {
        sequelize,
        tableName: 'creators',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

// Define associations
User.hasOne(Creator, { foreignKey: 'user_id' });
Creator.belongsTo(User, { foreignKey: 'user_id' });
