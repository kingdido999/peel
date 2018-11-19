const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const KoaBody = require('koa-body')
const views = require('koa-views')
const util = require('util')
const readability = require('node-readability')
const read = util.promisify(readability)

const app = new Koa()
app.use(views(path.join(__dirname, '/views')))
app.use(KoaBody())

const router = new Router()

router.get('/', async ctx => {
  await ctx.render('index')
})

router.post('/', async ctx => {
  const { url } = ctx.request.body
  console.log(`URL: ${url}`)

  const article = await read(url)
  const { title, content } = article

  ctx.response.body = {
    title,
    content
  }

  article.close()
  console.log('Done.')
})

app.use(router.routes())
app.use(router.allowedMethods())

const PORT = 3333
app.listen(PORT)
console.log(`Listening on port: ${PORT}`)
