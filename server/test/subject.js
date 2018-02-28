process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let config = require('config');
let Subject = require('../modules/subject/subject_model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
describe('Subjects', () => {

  /*
  * Test the /GET route
  */
  describe('/GET subject', () => {
      it('it should GET an empty list of subjects', (done) => {
        chai.request(server)
            .get(config.apiRoot + '/subject')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
      });
  });

});
