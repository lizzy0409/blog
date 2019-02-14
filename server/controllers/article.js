const {
  article: ArticleModel,
  tag: TagModel,
  category: CategoryModel,
  comment: CommentModel,
  reply: ReplyModel,
  user: UserModel
} = require('../models')

module.exports = {
  // 创建文章
  async create(ctx) {
    const { title, content, categories, tags } = ctx.request.body
    const tagList = tags.map(t => ({ name: t }))
    const categoryList = categories.map(c => ({ name: c }))
    await ArticleModel.create(
      { title, content, tags: tagList, categories: categoryList },
      { include: [TagModel, CategoryModel] }
    )
    ctx.body = { code: 200, message: '成功创建文章' }
  },

  // 修改文章
  async update(ctx) {
    const { articleId, title, content, category, tags } = ctx.request.body
    if (articleId) {
      const tagList = tags.map(tag => ({ name: tag, articleId }))
      await ArticleModel.update({ title, content, category }, { where: { id: articleId } })
      await TagModel.destroy({ where: { articleId } })
      await TagModel.bulkCreate(tagList)

      ctx.body = { code: 200, message: '成功修改文章' }
    } else {
      ctx.body = { code: 403, message: '文章 id 不能为空' }
    }
  },

  // 获取文章详情
  async getArticleById(ctx) {
    const id = ctx.params.id
    const data = await ArticleModel.findOne({
      where: { id },
      include: [
        { model: TagModel, attributes: ['name'] },
        { model: CategoryModel, attributes: ['name'] },
        {
          model: CommentModel,
          attributes: ['id', 'userId', 'content', 'createdAt'],
          include: [
            {
              model: ReplyModel,
              attributes: ['id', 'userId', 'content'],
              include: [{ model: UserModel, as: 'user', attributes: ['username'] }]
            },
            { model: UserModel, as: 'user', attributes: ['username'] }
          ]
        }
      ],
      order: [[CommentModel, 'createdAt', 'DESC']]
    })

    ctx.body = { code: 200, data }
  },

  /**
   * 查询文章列表
   *
   * @param {Number} offset - 当前页码 默认1
   * @param {Number} limit - 限制查询数量 默认 10
   * ...
   */
  async getArticleList(ctx) {
    let { page = 1, pageSize = 10, keyword } = ctx.query,
      offset = (page - 1) * pageSize,
      where = keyword ? { title: { $like: `%${keyword}%` } } : {}

    pageSize = parseInt(pageSize) // 处理 pageSize

    const data = await ArticleModel.findAndCountAll({
      where,
      include: [
        { model: TagModel, attributes: ['name'] },
        { model: CategoryModel, attributes: ['name'] },
        {
          model: CommentModel,
          attributes: ['id'],
          include: [{ model: ReplyModel, attributes: ['id'] }]
        }
      ],
      offset,
      limit: pageSize,
      order: [['createdAt', 'DESC']],
      distinct: true
    })

    ctx.body = { code: 200, ...data }
  },

  // 删除文章
  async delete(ctx) {
    const { articleId } = ctx.request.body
    if (articleId) {
      await TagModel.destroy({ where: { articleId } })
      await ArticleModel.destroy({ where: { id: articleId } })
      ctx.body = { code: 200, message: '成功删除文章' }
    } else {
      ctx.body = { code: 403, message: '文章 id 不能为空' }
    }
  }
}