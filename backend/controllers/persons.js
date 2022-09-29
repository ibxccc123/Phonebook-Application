const personsRouter = require('express').Router()
const Person = require('../models/person')

/*app.get('/', (request, response) => {
  response.send('<h1>Hello World! "wa" - Ina</h1>')
})*/

/*app.get('/info', (request, response, next) => {
  Person.count().then(count => {
    response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
  })
    .catch(error => next(error))
})*/


personsRouter.get('/', (request, response, next) => {
  Person.find({})
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

personsRouter.get('/:id', (request, response, next) => {
  //Callback function required to return JSON object of person due to that findById is asynchronous
  //Do not use const person = ... , if (...), as findById is asynchronous 
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } 
    else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(function() {
      response.status(204).end()
    })
    .catch(error => next(error))
})

/*const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }*/
  
personsRouter.post('/', (request, response, next) => {
  const body = request.body

  Person.findOne({ name : body.name })
    .then(person => {
      if(person){
        return response.status(400).json({ 
          error: `${body.name} is already in database` 
        })
      }
      else{
        const person = new Person({
          name: body.name,
          number: body.number
        })
        
        person.save()
          .then(savedPerson => {
            response.json(savedPerson)
          })
          .catch(error => next(error))
      }
    })
    .catch(error => next(error))
})

personsRouter.put('/:id', (request, response, next) => {
  const {name, number} = request.body

  Person.findByIdAndUpdate(request.params.id, {name, number}, {new : true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

module.exports = personsRouter