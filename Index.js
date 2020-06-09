const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')

// подключаем express через обьект app
const app = express()

// Настраиваем конфигурацию дял обьекта hbs. Hbs такой движок, который добавляет больше функций в стандартные файлы html.Например layouts.
const hbs = exphbs.create({
    defaultLayout: 'main', //задаём название главному "слою".
    extname: 'hbs' // расширение всех файлов, что передаются. Для удобства.
})

// ДАлее идёт соеденение hbs и express
app.engine('hbs', hbs.engine) // В этой строчке регистрируем hbs движок
// далее мы устанавливаем настройки для hbs и express. Устанваливаем движок для использования и устанавливаем папку, в которой хранятся все hbs странички
app.set('view engine', 'hbs') // параметры видимый движок и его название(как при регистрации выше)
app.set('views', 'views') //тут папку(по умолчанию views, но на всякий прописываем)

/* гет запрос - это когда мы пытаемся зайти на страницу с роутом, указаным первым параметром. После чего респонс делает метод файлсенд, а именно
отправляет нам нужный html файл. Прописывает путь. ГЕТ запрос, это пользователь запрашивает файл, а мы его выдаём по требованию.*/
app.get('/', (req, res) => {
    res.status(200)
    // res.sendFile(path.join(__dirname,'views', 'index.html')) 
    // с помощью hbs делаем это через метод рендер, и сенд файл нам не нужен
    res.render('index', {
        title: 'Фильмы'
    })

app.use(express.static('public'))

})
// тут обрабатываем такой же гет запрос на только на страницу с списком всех фильмов
app.get('/addfilm', (req, res) => {
    res.status(200)
    // res.sendFile(path.join(__dirname,'views', 'films.html'))
    res.render('addfilm', {
        title: 'Добавить фильм'
    })
})

// создаём порт и включаем сервер. Просто конструкция для запуска сервера, пока не пойму всех принципов, что тут юзаются
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})