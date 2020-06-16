const { v4: uuidv4 } = require('uuid')
const path = require('path')
const fs = require('fs')

class Film {
    constructor(title, year, genre, description, img) {
        this.title = title
        this.year = year
        this.genre = genre
        this.description = description
        this.img = img
        this.id = uuidv4()
    }

    toJSON() {
        return ({
            title: this.title,
            year: this.year,
            genre: this.genre,
            description: this.description,
            img: this.img,
            id: this.id
        })
    }

    static async update(currentfilm) {
        const allfilms = await Film.getAll()

        const idx = allfilms.findIndex(c => c.id === currentfilm.id)
        allfilms[idx] = currentfilm    

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'films.json'),
                JSON.stringify(allfilms),
                (err) => {
                    if (err) {
                        reject()
                    } else {
                        resolve()
                    }
                }
            )
        })
    }
// записываем данные в файл 
    async save() {
        const films = await Film.getAll()
        films.push(this.toJSON())

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'films.json'),
                JSON.stringify(films),
                (err) => {
                    if (err) {
                        reject()
                    } else {
                        resolve()
                    }
                }
            )
        })
        
    }

    /* 
    метод позволяет получить все данные из получаемого обьекта. Файл читается из джсона и парсится.
    */
    static getAll() { 
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'films.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(content))
                    }
                }
            )
        })
        
    }

    static async getById(id) { // Получаем инфу о фильме согласно ID. Если параметр айди совпадает с айди в эндпоинте, возвращаем обьект текущего фильма.
// Далее передаём эти данные на Index, где заносим в переменную, с которой забираем каждый ключ.
        const films = await Film.getAll()
        return films.find(c => c.id === id)
    }
}

module.exports = Film