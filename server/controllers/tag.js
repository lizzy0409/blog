// import models
const { tag: TagModel, category: CategoryModel, sequelize } = require('../models')

class TagController {
  static async getTagList(ctx) {
    const data = await TagModel.findAll({
      attributes: ['name', [sequelize.fn('COUNT', sequelize.col('name')), 'count']],
      group: 'name',
      where: {
        articleId: { $not: null }
      }
    })
    // ctx.client(200, 'success', data)
    ctx.body = data
  }

  static async getCategoryList(ctx) {
    const data = await CategoryModel.findAll({
      attributes: ['name', [sequelize.fn('COUNT', sequelize.col('name')), 'count']],
      group: 'name',
      where: {
        articleId: { $not: null }
      }
    })
    // ctx.client(200, 'success', data)
    ctx.body = data
  }
}

module.exports = TagController
