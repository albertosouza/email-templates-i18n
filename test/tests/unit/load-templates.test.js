var assert = require('assert');
var ET = require('../../../lib');
var fs = require('fs');
var path = require('path');

var testEmailsFolder = path.resolve('test/emails');
var emailData = {
  user: { displayName: 'Alberto' },
  title: 'NewsLetter',
  text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  siteName: 'https://wejs.org'
};

describe('email-templates-i18n', function () {

  describe('construct', function() {
    it('should set all required variables in new instance');
  });

  describe('getTemplateFolder', function() {
    var et;

    before(function(){
      et = new ET(testEmailsFolder+'/newsLetter');
    });

    it('should get template folder', function(done){
      et.getTemplateFolder(function(err, folder){
        if (err) return done(err);

        assert(folder.indexOf('test/emails/newsLetter') > -1);

        done();
      });
    });
    it('should return error in callback if folder not exists', function (done){
      var et = new ET(testEmailsFolder+'/newsLetterHowDontExits');
      et.getTemplateFolder(function(err, folder){
        assert(!folder);
        assert(err);
        assert.equal(err.code, 'ENOENT');
        done();
      });
    });
  });

  describe('getLocalizedETF', function() {
    var et;

    before(function(){
      et = new ET(testEmailsFolder+'/newsLetter');
    });

    it('should get template folder related to locale', function(done){
      et.getLocalizedETF('pt-br', function (err, folder){
        if (err) return done(err);
        assert(folder.indexOf('test/emails/newsLetter/pt-br') > -1);
        done();
      });
    });
    it('should return error in callback if folder not exists', function(done){
      et.getLocalizedETF('adssaddas', function (err, folder) {
        assert(!folder);
        assert(err);
        assert.equal(err.code, 'ENOENT');
        done();
      });
    });
  });


  describe('resolveTPLFolder', function() {
    var et;

    before(function(){
      et = new ET(testEmailsFolder+'/newsLetter');
    });

    it('should get localized template folder with valid locale', function(done){

      et.resolveTPLFolder('pt-br', function (err, folder){
        if (err) return done(err);
        assert(folder.indexOf('test/emails/newsLetter/pt-br') > -1);
        done();
      });
    });

    it('should get default template folder with not found locale', function(done){

      et.resolveTPLFolder('aa-aa', function (err, folder){
        if (err) return done(err);
        assert(folder.indexOf('test/emails/newsLetter') > -1);
        assert(folder.indexOf('test/emails/newsLetter/pt-br') == -1);
        done();
      });
    });

    it('should get default template folder if locale is null', function(done){

      et.resolveTPLFolder(null, function (err, folder){
        if (err) return done(err);
        assert(folder.indexOf('test/emails/newsLetter') > -1);
        assert(folder.indexOf('test/emails/newsLetter/pt-br') == -1);
        done();
      });
    });

    it('should return error in callback templatePath not exists', function(done){
      var et = new ET(testEmailsFolder+'/addsdadd');

      et.resolveTPLFolder('adssaddas', function (err, folder) {
        assert(!folder);
        assert(err);
        assert.equal(err.code, 'ENOENT');
        done();
      });
    });
  });

  describe('render', function() {
    it('should get template html with valid data', function(done){

      var et = new ET(testEmailsFolder+'/newsLetter');

      et.render(emailData, 'pt-br', function (err, email) {
        if (err) return done(err);

        assert(email.html);
        assert(email.html.indexOf('<body style="background: blue;">') > -1);
        assert(email.html.indexOf('<title>NewsLetter</title>') > -1);
        assert(email.html.indexOf('<p>Oi Alberto,</p>') > -1);

        done();
      });
    });

    it('should get default root template html with invalid locale', function(done){

      var et = new ET(testEmailsFolder+'/newsLetter');

      et.render(emailData, 'aa-bb', function (err, email) {
        if (err) return done(err);

        assert(email.html);
        assert(email.html.indexOf('<body style="background: red;">') > -1);
        assert(email.html.indexOf('<title>NewsLetter</title>') > -1);
        assert(email.html.indexOf('<p>Hi Alberto,</p>') > -1);

        done();
      });
    });

    it('should get default root template if not set locale', function(done){

      var et = new ET(testEmailsFolder+'/newsLetter');

      et.render(emailData, function (err, email) {
        if (err) return done(err);

        assert(email.html);
        assert(email.html.indexOf('<body style="background: red;">') > -1);
        assert(email.html.indexOf('<title>NewsLetter</title>') > -1);
        assert(email.html.indexOf('<p>Hi Alberto,</p>') > -1);

        done();
      });
    });

    it('should get default root template if locale is the default locale', function(done){

      var et = new ET(testEmailsFolder+'/newsLetter');

      et.render(emailData, 'en-us', function (err, email) {
        if (err) return done(err);

        assert(email.html);
        assert(email.html.indexOf('<body style="background: red;">') > -1);
        assert(email.html.indexOf('<title>NewsLetter</title>') > -1);
        assert(email.html.indexOf('<p>Hi Alberto,</p>') > -1);

        done();
      });
    });

    it('should return error if template folder not is found', function(done){
      var et = new ET(testEmailsFolder+'/aaaaabbbbcccc');

      et.render(emailData, 'pt-br', function (err, email) {
        assert(!email);
        assert(err);
        assert.equal(err.code, 'ENOENT');
        done();
      });
    });

    it('should return error if have error in css', function(done){
      var et = new ET(testEmailsFolder+'/newsLetter');

      et.render(emailData, 'af-za', function (err, email) {
        assert(!email);
        assert(err);
        assert.equal(err.message, 'Unexpected } (line 1, char 7)');
        done();
      });
    });
  });

});