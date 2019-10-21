const express = require('express');

const server = express();
server.use(express.json());


const users = ['diego', 'claudio', 'victor'];

server.use((req, res, next) => {
  console.time('request');
 console.log(`Método: ${req.method}; URL: ${req.url};`);

 next();

 console.timeEnd('request');
});

function checkUserExist(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({error: 'User not found on request body'});
  }

  return next();
}

function checkUseInArray (req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: 'User does not exists'});
  }

  req.user = user;
  
  return next();
}

server.get('/users', (req, res) => {
  return res.json(users);
})

server.get('/users/:index',checkUseInArray, (req, res) => {
  return res.json(req.user);
})

server.post('/users',checkUserExist, (req, res) => {
  const {name} = req.body;

  users.push(name);

  return res.json(users);
});

server.put('/users/:index',checkUserExist,checkUseInArray, (req, res) => {
  const { index } = req.params;
  const {name} = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete('/users/:index',checkUseInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.json(users);
});

server.listen(3014);