process.env.NODE_ENV = 'test';
let config = require('config');

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
    it('shouldn\'t create a user with no data', (done) => {
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
    it('should create a new user', (done) => {
      chai.request(server)
        .post(config.apiRoot + '/signup')
        .send(credentials)
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.should.have.property('success');
          res.body.success.should.be.true;
          res.body.should.have.property('token');
          res.body.token.should.be.a('string');
          credentials.token = res.body.token;
          done();
        });
    });
  });

    /*
    * Test the /signin route
    */
    describe('/POST signin', () => {
        it('shouldn\'t authenticate a user with wrong credentials', (done) => {
          chai.request(server)
            .post(config.apiRoot + '/signin')
            .send({
                username: credentials.username,
                password: 'Wrong Password'
            })
            .end((err, res) => {
              res.should.have.status(401);
              res.body.should.be.an('object');
              res.body.should.have.property('success');
              res.body.success.should.be.false;
              done();
            });
        });
        it('should authenticate a user with correct credentials', (done) => {
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
