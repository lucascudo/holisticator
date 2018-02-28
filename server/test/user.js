process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let config = require('config');
let User = require('../modules/user/user_model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
describe('Users', () => {

  let credentials = {
    'username': 'lucas',
    'password': 'lucas'
  };

  /*
  * Test the /signup route
  */
  describe('/POST signup', () => {
    it('it should not create a user with no data', (done) => {
      chai.request(server)
        .post(config.apiRoot + '/signup')
        .send()
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.should.have.property('success');
          res.body.success.should.be.false;
          done();
        });
    });
    it('it should create a new user', (done) => {
      chai.request(server)
        .post(config.apiRoot + '/signup')
        .send(credentials)
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.should.have.property('success');
          res.body.success.should.be.true;
          done();
        });
    });
  });

    /*
    * Test the /signin route
    */
    describe('/POST signin', () => {
      it('it should authenticate a user', (done) => {
        chai.request(server)
          .post(config.apiRoot + '/signin')
          .send(credentials)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('success');
            res.body.success.should.be.true;
            done();
          });
      });
    });

});
