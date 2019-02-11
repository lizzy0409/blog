const router = require('koa-router')()
const examplesRouter = require('./examples')
const ArticleRouter = require('./article')
const TagController = require('../controllers/tag')
const CategoryController = require('../controllers/category')

router.use('/examples', examplesRouter.routes())
router.use('/article', ArticleRouter.routes())

// 获取所有标签以及每个标签的总数
router.get('/getTags', TagController.getTags)
//根据标签的名字获取文章
router.get('/tags/:name/articles', TagController.getArticlesByTag)


// 获取所有分类以及分类的总数
router.get('/getCategories', CategoryController.getCategories)

router.get('/', async ctx => {
  ctx.body = 'hello koa2'
})

module.exports = router
