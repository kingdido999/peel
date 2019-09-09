const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const KoaBody = require('koa-body')
const serve = require('koa-static')
const views = require('koa-views')
const util = require('util')
const readability = require('node-readability')
const read = util.promisify(readability)

const app = new Koa()
app.use(serve('assets'))
app.use(views(path.join(__dirname, '/views'), { extension: 'pug' }))
app.use(KoaBody())

const router = new Router()

router.get('/', async ctx => {
  const { url } = ctx.request.query

  if (url && url !== '') {
    console.log(`URL: ${url}`)

    const article = await read(url)
    const { title, content } = article

    article.close()

    await ctx.render('article', {
      url,
      title,
      content
    })
  } else if (url === undefined) {
    ctx.redirect('/?url=')
  } else {
    await ctx.render('index')
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

const PORT = 3333
app.listen(PORT)
console.log(`Listening on port: ${PORT}`)
