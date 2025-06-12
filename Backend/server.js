const express = require('express')
const appRoute = require('./routes/route')
const app = express()
const port = 4000

app.use(express.json());

app.use('/api',appRoute)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

