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
  beforeEach((done) => { //Before each test we empty the database
      User.remove({}, (err) => {
        done();
      });
  });

  /*
  * Test the /GET route
  */
  describe('/GET user', () => {
      it('it should create a new user', (done) => {
        chai.request(server)
            .post(config.apiRoot + '/signup')
            .send({
              'username': 'lucas',
              'password': 'lucas'
            })
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
