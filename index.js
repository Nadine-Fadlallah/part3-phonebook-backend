require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.static('build'))
app.use(express.json())
const cors = require('cors')
app.use(cors())
const Person = require('./models/person')
const morgan = require('morgan')
const { response } = require('express')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/info', (request, response) => {
    Person.countDocuments({})
        .then(docCount => {
            response.send(`<div>
    <p>Phonebook has info for ${docCount} people </p > 
    <p>${Date()} </p>
    </div > `)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })

})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person)
                response.json(person)
            else
                response.status(404).end()
        })
        .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedNote => response.json(updatedNote.toJSON()))
        .catch(error => next(error))

})
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(404).json({
            error: 'name is missing!'
        }
        )
    }
    else if (!body.number) {
        return response.status(404).json({
            error: 'number is missing!'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => response.json(savedPerson))

})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//Now we are using the port defined in environment variable PORT or port 3001 if the environment variable PORT is undefined. 
//Heroku configures application port based on the environment variable. 
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
