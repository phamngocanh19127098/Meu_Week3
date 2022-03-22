import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _userRole from  "./userRole.js";
import _userTable from  "./userTable.js";

export default function initModels(sequelize) {
  const userRole = _userRole.init(sequelize, DataTypes);
  const userTable = _userTable.init(sequelize, DataTypes);

  userRole.belongsTo(userTable, { as: "id_user_table", foreignKey: "id"});
  userTable.hasOne(userRole, { as: "user_role", foreignKey: "id"});

  return {
    userRole,
    userTable,
  };
}
