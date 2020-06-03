const express = require('express');
const morgan = require('morgan');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.get('/cipher', (req, res) => {
  const text = req.query.text;
  const shift = parseInt(req.query.shift, 10);
  if(!text || isNaN(shift)) {
    return res
      .status(400)
      .send('Must provide text and cipher');
  }
  const textSplit = text.split('').map(character => {
    let newChar = character;
    if(newChar !== ' ') {

      let currAscii = character.charCodeAt(0);
      let newValue = currAscii + shift;
      newChar = String.fromCharCode(newValue);
    }

    return newChar;
  }).join('');
  res.json(textSplit);
});

app.get('/lotto', (req, res) => {
  const myTicket = req.query.arr.map(num => {
    return Number(num);
  });
  if(myTicket.length !== 6) {
    return res
      .status(400)
      .send('You did not provide enough numbers for you lotto entry');
  }
  let counter = 0;
  let lottoNumbers = [];
  let results = '';
  for (let i = 0; i < 6; i ++) {
    lottoNumbers[i] = Math.floor(Math.random() * 20) + 1;
  }
  lottoNumbers.forEach(number => {
    if(myTicket.includes(number)) {
      counter++;
    }
  });
  if(counter === 4) {
    results = 'Congratulations, you win a free ticket';
  }
  else if (counter === 5) {
    results = 'Congratulations! You win $100!';
  }
  else if (counter === 6) {
    results = 'Wow! Unbelievable! You could have won the mega millions!';
  }
  else {
    results = 'Sorry, you lose';
  }
  res.json(results);
});

app.get('/sum', (req, res) => {
  console.log(typeof(req.query.a));
  let { a, b } = req.query;
  if(!a || !b) {
    return res
      .status(400)
      .send('Must provide "a" and "b"');
  }
  if(isNaN(Number(a)) || isNaN(Number(b))) {
    return res
      .status(400)
      .send('"a" and "b" must be numbers');
  }
  const sum = `The sum of ${a} and ${b} is: ${Number(a) + Number(b) } `; 
  res.json(sum);
});



const appList = require('./app-list.js');

app.use(morgan('common'));

app.get('/apps', (req, res) => {
  
  const { sort, genres } = req.query;
  const validSorts = ['Rating', 'App'];
  const validGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];
  if(sort && !validSorts.includes(sort)) {
    return res
      .status(400)
      .json({error: 'Sort query must include either "Rating" or "App"'});
  }

  if(genres && !validGenres.includes(genres)) {
    return res
      .status(400)
      .json({error: 'Please enter a valid genre'});
  }

  let results = [];
  if(genres) {
    appList.forEach(app => {
      if(app.Genres.toLowerCase().includes(genres.toLowerCase())) {
        results.push(app);
      }
    });
   
  }
  else {
    results = appList;
  }


  if (sort) {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }
  res.json(results);
});


module.exports = app;
