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
}

module.exports = Film