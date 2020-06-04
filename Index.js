const express = require('express')
const path = require('path')


// create server
const app = express()

app.get('/', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname,'views', 'index.html'))
})

app.get('/films', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname,'views', 'films.html'))
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})