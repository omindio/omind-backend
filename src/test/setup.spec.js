import dotenv from 'dotenv'; 
dotenv.config();

//components
//import { UserComponent } from '@components';

process.env.NODE_ENV = 'test';

//import server from '../server';

let chai = require('chai');
let chaiHttp = require('chai-http');

import app from '../app';

let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
    //beforeEach((done) => { //Before each test we empty the database
      //  Book.remove({}, (err) => { 
        //   done();           
        //});        
    //});
/*
  * Test the /GET route
  */
  describe('/GET users', () => {
      it('it should GET all the users', (done) => {
        chai.request(app)
            .get('/users')
            .end((err, res) => {
                  res.should.have.status(200);
                  //res.body.should.be.a('array');
                  //res.body.length.should.be.eql(0);
              done();
            });
      });
  });

});