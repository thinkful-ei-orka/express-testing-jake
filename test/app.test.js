const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /cipher', () => {
  it('should be 400 if shift is not provided', () => {
    return supertest(app)
      .get('/cipher')
      .query({ text: 'MISTAKE' })
      .expect(400, 'Must provide text and cipher');
  });
  it('should be 400 if text is not provided', () => {
    return supertest(app)
      .get('/cipher')
      .query({ shift: 3 })
      .expect(400, 'Must provide text and cipher');
  });
  it('should return a deciphered string', () => {
    let decipherHello = 'Ifmmp';
    return supertest(app)
      .get('/cipher')
      .expect(200)
      .query({text: 'Hello', shift: 1})
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('string');
        expect(res.body).to.equal(decipherHello);
      });
  });
});

describe('GET /sum', () => {
  it('should be 400 if a or b is not provided', () => {
    return supertest(app)
      .get('/sum')
      .query({ a: 4 })
      .expect(400, 'Must provide "a" and "b"');
  });
  it('should return 400 if a or b is not a number', () => {
    return supertest(app)
      .get('/sum')
      .query({a: 'r', b: 3})
      .expect(400, '"a" and "b" must be numbers');
  });
  it('Should return a string that is the sum of a and b', () => {
    let expectedResult = 'The sum of 3 and 2 is: 5';
    return supertest(app)
      .get('/sum')
      .query({a: 3, b: 2})
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('string');
        expect(res.body).to.include(expectedResult);
      });
  });
});


describe('GET /lotto', () => {
  it('Should return an error if 6 numbers are not provided', () => {
    let lottoNumbers = [1,2,3,4,5];
    return supertest(app)
      .get('/lotto')
      .query({arr: lottoNumbers})
      .expect(400, 'You did not provide enough numbers for you lotto entry');
  });
  it('should return a string that compares the user ticket to a generated lottery ticket', () => {
    let lottoNumbers = [1,2,3,4,5,6];
    let possibleResponses = ['Congratulations, you win a free ticket', 'Congratulations! You win $100!', 'Wow! Unbelievable! You could have won the mega millions!', 'Sorry, you lose'];
    return supertest(app)
      .get('/lotto')
      .query({ arr: lottoNumbers})
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('string');
        expect(res.body).be.oneOf(possibleResponses);
      });
  });
});