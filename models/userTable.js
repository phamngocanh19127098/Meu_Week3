import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class userTable extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "user_tables_email_key"
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    verified: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "0"
    }
  }, {
    sequelize,
    tableName: 'user_tables',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "user_tables_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "user_tables_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
