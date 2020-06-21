const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const Film = require('./models/film') // экспортируем класс Film из файл film.js
const fs = require('fs')

// подключаем express через обьект app
const app = express()

// Настраиваем конфигурацию дял обьекта hbs. Hbs такой движок, который добавляет больше функций в стандартные файлы html.Например layouts.
const hbs = exphbs.create({
    defaultLayout: 'main', //задаём название главному "слою".
    extname: 'hbs' // расширение всех файлов, что передаются. Для удобства.
})

// ДАлее идёт соеденение hbs и express
app.engine('hbs', hbs.engine) // В этой строчке регистрируем hbs движок
// далее мы устанавливаем настройки для hbs и express. Устанавливаем движок для использования и устанавливаем папку, в которой хранятся все hbs страницы
app.set('view engine', 'hbs') // параметры видимый движок и его название(как при регистрации выше)
app.set('views', 'views') //тут папку(по умолчанию views, но на всякий прописываем)
app.use(express.static('public')) // делаем папку "паблик" публичной, так наши стили css будут отображаться.
app.use(express.urlencoded({extended: true})) // делаем декодинг получаем данных з формы, теперь они с формата undefined становятся обьектом

/* гет запрос - это когда мы пытаемся зайти на страницу с роутом, указаным первым параметром. После чего респонс делает метод файлсенд, а именно
отправляет нам нужный html файл. Прописывает путь. ГЕТ запрос, это пользователь запрашивает файл, а мы его выдаём по требованию.*/
app.get('/', async (req, res) => {
    const allfilms = await Film.getAll()
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
    const filmInfo = new Film(req.body.title, req.body.year, req.body.genre, req.body.description, req.body.img) // создаём переменную с информацией о текущем фильме
    await filmInfo.save()
    res.redirect('/')
})


app.get('/:id', async (req, res) => { // С помощью двоеточия указывается динамические параметры. ID каждого фильма является эндпоинтом для страницы каждого фильма
    try {
        const currentFilm = await Film.getById(req.params.id)
        res.status(200)
        res.render('filmID', {
            title: `${currentFilm.title}`, // тайтл через динамику теущего фильма, а также передаём сам обьект в рендер
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
    const currentFilm = await Film.getById(req.params.id)
    res.render('edit', {
        title: `Редактировать ${currentFilm.title}`,
        currentFilm
    })
})
app.post('/edit', async (req, res) => {
    await Film.update(req.body)
    const currentFilm = await Film.getById(req.params.id)
    res.redirect('/')
})

app.get('/:id/delete', async (req, res) => {
    const currentFilm = await Film.getById(req.params.id)
    Film.delete(currentFilm)
    res.redirect('/')
})

// создаём порт и включаем сервер. Просто конструкция для запуска сервера, пока не пойму всех принципов, что тут юзаются
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})