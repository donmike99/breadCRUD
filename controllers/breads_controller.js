const express = require('express')
const breads = express.Router()
const BreadData = JSON.parse(require('../models/breadData.js'))
const Bread = require('../models/breads')

// INDEX
breads.get('/', (req, res) => {
    Bread.find()
      .then((response) => {
        console.log(response)
        res.render('index',
          {
            breads: response,
            title: 'Index Page'
          }
        )
      })
})

// CREATE
breads.post('/', (req, res) => {
  if (!req.body.image) {
    req.body.image = undefined
  }
  if(req.body.hasGluten === 'on') {
    req.body.hasGluten = true
  } else {
    req.body.hasGluten = false
  }
  Bread.create(req.body)
    .then(newBread => {
      res.redirect('/breads')
    })
    .catch(err => {
      if (err && err.name == 'ValidationError') {
        let message = 'Validation Error: '
        console.log("Error.errors:", err.errors)
        for (var field in err.errors) {
            message += `${field} was ${err.errors[field].value}. `
            message += `${err.errors[field].message}`
        }
        console.log('Validation error message', message)
        res.render('new', { message, body: req.body })
      }
      else {
          res.render('404')
      }
    })
})

// NEW
breads.get('/new', (req, res) => {
  res.render('new')
})

// EDIT
breads.get('/:id/edit', (req, res) => {
  Bread.findById(req.params.id)
      .then(foundBread => {
          console.log(foundBread)
          res.render('edit', {
              bread: foundBread
          })
      })
      .catch(err => {
        console.log(err)
        res.render("404")
      })
})

// SHOW
breads.get('/:id', (req, res) => {
  Bread.findById(req.params.id)
      .then(foundBread => {
          // console.log(foundBread)
          res.render('show', {
              bread: foundBread
          })
      })
      .catch(err => {
        console.log(err)
        res.render("404")
      })
})

// breads.get('/:arrayIndex', (req, res) => {
//   if (BreadData[req.params.arrayIndex]) {
//     res.render('show', {
//       bread: BreadData[req.params.arrayIndex],
//       index: req.params.arrayIndex
//     })
//   } else {
//     res.render('404')
//   }
// })

// UPDATE
breads.put('/:id', (req, res) => {
  if(req.body.hasGluten === 'on'){
    req.body.hasGluten = true
  } else {
    req.body.hasGluten = false
  }

  Bread.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, lean: true })
    .then(updatedBread => {
      console.log("updated:", updatedBread)
      res.redirect(`/breads/${req.params.id}`)
    })
    .catch(err => {
      if (err && err.name == 'ValidationError') {
        let message = 'Validation Error: '
        console.log("Error.errors:", err.errors)
        for (var field in err.errors) {
            message += `${field} was ${err.errors[field].value}. `
            message += `${err.errors[field].message}`
        }
        console.log('Validation error message', message)
        res.render('edit', { message, bread: {...req.body, id: req.params.id }})
      }
      else {
          res.render('404')
      }
    })
})

// DELETE
breads.delete('/:id', (req, res) => {
  Bread.findByIdAndDelete(req.params.id)
    .then(deletedBread => {
      res.status(303).redirect('/breads')
    })
    .catch(err => {
      console.log(err)
      res.render("404")
    })
})

module.exports = breads
