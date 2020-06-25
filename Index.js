const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const Film = require('./models/film') // экспортируем класс Film из файл film.js
const fs = require('fs')
const { extname } = require('path')

// подключаем express через обьект app
const app = express()


// Настраиваем конфигурацию дял обьекта hbs. Hbs такой движок, который добавляет больше функций в стандартные файлы html.Например layouts.
const hbs = exphbs.create({
    defaultLayout: 'main', //задаём название главному "слою".
    extname: 'hbs', // расширение всех файлов, что передаются. Для удобства.
    handlebars: allowInsecurePrototypeAccess(Handlebars),
})

// ДАлее идёт соеденение hbs и express
app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    extname:'hbs',
    defaultLayout: 'main'
})) // В этой строчке регистрируем hbs движок

// далее мы устанавливаем настройки для hbs и express. Устанавливаем движок для использования и устанавливаем папку, в которой хранятся все hbs страницы
app.set('view engine', 'hbs') // параметры видимый движок и его название(как при регистрации выше)
app.set('views', 'views') //тут папку(по умолчанию views, но на всякий прописываем)
app.use(express.static('public')) // делаем папку "паблик" публичной, так наши стили css будут отображаться.
app.use(express.urlencoded({extended: true})) // делаем декодинг получаем данных з формы, теперь они с формата undefined становятся обьектом

/* гет запрос - это когда мы пытаемся зайти на страницу с роутом, указаным первым параметром. После чего респонс делает метод файлсенд, а именно
отправляет нам нужный html файл. Прописывает путь. ГЕТ запрос, это пользователь запрашивает файл, а мы его выдаём по требованию.*/
app.get('/', async (req, res) => {
    const allfilms = await Film.find()
    res.status(200)
    // res.sendFile(path.join(__dirname,'views', 'index.html')) 
    // с помощью hbs делаем это через метод рендер, и сенд файл нам не нужен
    res.render('index', {
        title: 'Фильмы',
        allfilms
    })
})
// тут обрабатываем такой же гет запрос на только на страницу с списком всех фильмов
app.get('/addfilm', (req, res) => {
    res.status(200)
    // res.sendFile(path.join(__dirname,'views', 'films.html'))
    res.render('addfilm', {
        title: 'Добавить фильм'
    })
})

// обрабатываем POST запрос. После нажатия кнопки "отправить", мы передаём данные методом "пост". Они записываются в обьект, по своим полям "name"
//  GET это получаем страницу, при переходе на неё. Сервер одаёт данны пользователю, при посте ползватеь передаёт данные серверу.
app.post('/addfilm', async (req, res) => { 
    const film = new Film({// создаём переменную с информацией о текущем фильме
        title: req.body.title,
        year: req.body.year,
        genre: req.body.genre,
        description: req.body.description,
        img: req.body.img
    })

    try {
        await film.save()
        res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})


app.get('/:id', async (req, res) => { // С помощью двоеточия указывается динамические параметры. ID каждого фильма является эндпоинтом для страницы каждого фильма
    try {
        const currentFilm = await Film.findById(req.params.id)
        res.status(200)
        res.render('filmID', {
            title: `Фильм ${currentFilm.title}`, // тайтл через динамику теущего фильма, а также передаём сам обьект в рендер
            currentFilm
        })
    } catch (e) {
        console.log(e)
    }
})

app.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const currentFilm = await Film.findById(req.params.id)
    res.render('edit', {
        title: `Редактировать ${currentFilm.title}`,
        currentFilm
    })
})
app.post('/edit', async (req, res) => {
    const {id} = req.body
    delete req.body.id
    await Film.findByIdAndUpdate(id, req.body)
    res.redirect('/')
})

app.post('/delete', async (req, res) => {
    try {
        await Film.deleteOne ({_id: req.body.id})
        res.redirect('/')
    } catch (e) {
        console.log(e)
    }
    
})

// создаём порт и включаем сервер
const PORT = process.env.PORT || 3000


async function start() {
    try {
        const url = 'mongodb+srv://Artem:FjlDjcFxjLa25zo8@filmscluster-lf2d7.mongodb.net/lumers'
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on PORT ${process.env.PORT}`)
        })
    } catch(e) {
        console.log(e)
    }

} 

start()