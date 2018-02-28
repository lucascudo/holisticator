process.env.NODE_ENV = 'test';

let config = require('config');
let User = require('../modules/user/user_model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
describe('Subjects', () => {
    let token = '';
    let testSubject = {
        id: 'test',
        name: 'test'
    };

    before((done) => {
        const newUser = new User({
          username: 'test',
          password: 'test'
        });
        // save the user
        newUser.save((err) => {
            if (!err) {
                token = newUser.generateToken();
            }
            done(err);
        });
    });

    describe('/POST subject', () => {
        it('shouldn\'t create a subject without giving a token', (done) => {
            chai.request(server)
            .post(config.apiRoot + '/subject')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an('object');
                done();
            });
        });
        it('shouldn\'t create an incomplete subject', (done) => {
            chai.request(server)
            .post(config.apiRoot + '/subject')
            .set({'Authorization': token})
            .send({
                id: 'test',
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('success');
                res.body.success.should.be.false;
                done();
            });
        });
        it('should create a new subject', (done) => {
            chai.request(server)
            .post(config.apiRoot + '/subject')
            .set({'Authorization': token})
            .send(testSubject)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('success');
                res.body.success.should.be.true;
                res.body.should.have.property('subject');
                res.body.subject.should.be.a('object');
                res.body.subject.should.have.property('id');
                res.body.subject.id.should.be.equals(testSubject.id);
                res.body.subject.should.have.property('name');
                res.body.subject.name.should.be.equals(testSubject.name);
                done();
            });
        });
    });

    describe('/GET subject', () => {
        it('should GET list of subjects', (done) => {
          chai.request(server)
              .get(config.apiRoot + '/subject')
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.equals(1);
                  done();
              });
        });
        it('should GET a subject', (done) => {
            chai.request(server)
            .get(config.apiRoot + '/subject/' + testSubject.id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('success');
                res.body.success.should.be.true;
                res.body.should.have.property('subject');
                res.body.subject.should.be.a('object');
                res.body.subject.should.have.property('id');
                res.body.subject.id.should.be.equals(testSubject.id);
                res.body.subject.should.have.property('name');
                res.body.subject.name.should.be.equals(testSubject.name);
                done();
            });
        });
    });

    describe('/PUT subject', () => {
        const updatedSubject = { name: 'updated test' };
        it('shouldn\'t update a subject without giving a token', (done) => {
          chai.request(server)
              .put(config.apiRoot + '/subject/' + testSubject.id)
              .send(updatedSubject)
              .end((err, res) => {
                  res.should.have.status(401);
                  done();
              });
        });
        it('should update a subject', (done) => {
            chai.request(server)
            .put(config.apiRoot + '/subject/' + testSubject.id)
            .set('Authorization', token)
            .send(updatedSubject)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('success');
                res.body.success.should.be.true;
                res.body.should.have.property('subject');
                res.body.subject.should.be.a('object');
                res.body.subject.should.have.property('name');
                res.body.subject.name.should.be.equals(updatedSubject.name);
                done();
            });
        });
    });

    describe('/DELETE subject', () => {
        const updatedSubject = { name: 'updated test' };
        it('shouldn\'t delete a subject without giving a token', (done) => {
          chai.request(server)
              .delete(config.apiRoot + '/subject/' + testSubject.id)
              .end((err, res) => {
                  res.should.have.status(401);
                  done();
              });
        });
        it('should delete a subject', (done) => {
            chai.request(server)
            .delete(config.apiRoot + '/subject/' + testSubject.id)
            .set('Authorization', token)
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
