const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0.nmcyg.mongodb.net/Person?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,
})

//personSchema.path('_id')

const generateRandomId = () => {
    return Math.floor(Math.random() * Math.floor(10000));
}

const Person = mongoose.model('Person', personSchema)

const personName = process.argv[3]
const personNumber = process.argv[4]

if (personNumber && personName) {
    const person = new Person({
        name: personName,
        number: personNumber,
        id: generateRandomId()
    })
    person.save().then(result => {
        console.log(`Added ${result.name} ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}
else {
    console.log('phonebook:')
    Person.find().then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}