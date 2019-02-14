module.exports = (sequelize, dataTypes) => {
  const User = sequelize.define(
    'user',
    {
      // id sequelize 默认创建...
      id: {
        type: dataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: dataTypes.STRING(50),
        // primaryKey: true,
        allowNull: false,
        unique: true
      },
      password: {
        type: dataTypes.STRING,
        allowNull: false,
        comment: '通过 bcrypt 加密后的密码'
      },
      auth: {
        type: dataTypes.TINYINT,
        defaultValue: 2,
        comment: '用户权限：1 - admin, 2 - 普通用户'
      }
    },
    {
      timestamps: false // 不创建 createAt / updateAt 字段
    }
  )
  
  User.associate = models => {
    User.hasMany(models.comment)
    User.hasMany(models.reply)
  }

  return User
}
