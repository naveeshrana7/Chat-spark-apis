import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database/sequelize.service';
import { ITransactionPayload } from '../interfaces/transaction.interface';
import { User } from './user.model';

export class Transaction extends Model<ITransactionPayload, Optional<ITransactionPayload, 'id'>> {
    public id!: string;
    public user_id!: string;
    public amount!: number;
    public type!: string;
    public reference_id!: string;
}

Transaction.init(
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
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reference_id: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'transactions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });
