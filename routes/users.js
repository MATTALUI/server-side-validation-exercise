'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/' , (req, res, next) => {
  knex('users')
    .select( 'id', 'firstname', 'lastname', 'username', 'phone', 'email')
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post('/' , (req, res, next) => {
  if (verify(req.body.users)){
    let firstName = req.body.users.firstName;
    let lastName = req.body.users.lastName;
    let username = req.body.users.username;
    let email = req.body.users.email;
    let phone = req.body.users.phone;

    knex('users')
      .insert({
        firstname: firstName,
        lastname: lastName,
        username: username,
        email: email,
        phone: phone
      })
      .returning(['firstname', 'lastname', 'username','phone','email'])
      .then((results) => {
        res.send(results[0]);
      })
      .catch((err) => {
        next(err);
      });
  }else{
    res.sendStatus(400);
  }

});
function verify({firstName, lastName, username, phone, email}){
  let emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let phoneRegEx = /^\d{10}$/;
  if(!firstName || !lastName || !username|| !phone||!email ||!emailRegEx.test(email)||!phoneRegEx.test(phone)||username.length < 6||!/[a-zA-Z]/.test(username[0])||username.search(/[.,@<>(){}]/) != -1){
    console.log('bad info');
    return false
  }
  console.log('good info');
  return true;
}

module.exports = router;
