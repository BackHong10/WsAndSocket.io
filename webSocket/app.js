const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const path = require('path')
const session = require('express-session')
const nunjucks = require('nunjucks')
const dotenv = require('dotenv')
const indexRouter = require('./routes')
const {webSocket} = require('./socket/socket')
const mongoose = require('mongoose')
const ColorHash = require('color-hash').default
dotenv.config()

const app = express()

app.set('port', process.env.PORT || 8005)
app.set('view engine','html')
nunjucks.configure('views', {
    express : app,
    watch: true
})

const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  });

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname,'public')))
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(sessionMiddleware)

app.use((req, res, next) => {
    if (!req.session.color) {
      const colorHash = new ColorHash();
      req.session.color = colorHash.hex(req.sessionID);
      console.log(req.session.color, req.sessionID);
    }
    next();
  });


app.use('/', indexRouter)



app.use((req,res,next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
    error.status = 404
    next(error)
})

app.use((err,req,res,next) => {
    res.locals.message = err.message
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}
    res.status(err.status || 500)
    res.render('error')
})

mongoose.set('debug', true)


mongoose.connect("mongodb://localhost:27017/admin", {
    dbName: 'chat'
}).then(() => {
    console.log("데이터베이스 연결에 성공하였습니다.")
})

const server = app.listen(app.get('port'), () => {
    console.log("서버가 실행되었습니다.")
})

webSocket(server,app,sessionMiddleware)
