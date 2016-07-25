console.log('email-templates-i18n is DEPRECATED, '+
  'i18n feature has ben ported to email-template module link: https://github.com/niftylettuce/node-email-templates');
console.log('if you use we.js we-plugin-email update it to v1.1.2+');
/**
 * Localizable email templates main file
 */

var ET = require('email-templates').EmailTemplate;
var fs = require('fs');
var async = require('async');

/**
 * Localizable email templates prototype
 *
 * @param {String} templatePath
 * @param {Object} options  options passed to email-templates, see https://github.com/niftylettuce/node-email-templates
 */
function ETI18N(templatePath, options) {
  this.options = ( options || {} );

  this.templatePath = templatePath;
}
// default locale for root locale
ETI18N.prototype.defaultLocale = 'en-us';

/**
 * Render one template with localized template or default root template
 *
 * @param  {Object}   locals Variables avaible in template
 * @param  {String}   locale Locale, optional
 * @param  {Function} cb     callback run with error or email template object
 */
ETI18N.prototype.render = function render(locals, locale, cb) {
  var self = this;

  if (!cb && typeof locale == 'function') {
    cb = locale; // locale is optional
    locale = null;
  }
  // if are the default locale skip localized locale load
  if (locale == this.defaultLocale) locale = null;
  // alays use template folder names in lowercase
  if (locale) locale = locale.toLowerCase();

  this.resolveTPLFolder(locale, function afterGetTplFolder(err, templateFolder) {
    if (err) return cb(err, null);
    // render the template
    // TODO CACHE it
    var template = new ET(templateFolder, self.options);
    template.render(locals, cb);
  });
};

/**
 * Return the localized email tempalte folder or default email template folder
 *
 * @param  {String}   locale locale or null for get email without locale
 * @param  {Function} cb     callback how run with: erro, folder
 */
ETI18N.prototype.resolveTPLFolder = function resolveTPLFolder(locale, cb) {
  var folder;
  var self = this;

  async.series([
    function getLocalized(done) {
      if (!locale) return done();
      self.getLocalizedETF(locale, function(err, f) {
        folder = f;
        done();
      });
    },
    function getDefault(done) {
      if (folder) return done();
      self.getTemplateFolder(function (err, f) {
        if (err) return done(err);
        folder = f;
        done();
      });
    }
  ], function afterResolveTheTemplateFolder(err) {
    cb(err, folder);
  });
}

/**
 * Get email template folder, this is the default folder with out localizations
 *
 * @param  {Function} done callback run with error,folder
 */
ETI18N.prototype.getTemplateFolder = function getTemplateFolder(done) {
  var self = this;
  fs.lstat(this.templatePath, function afterCheckIfFolderExists(err) {
    if (err) return done(err);
    done(null, self.templatePath);
  });
};

/**
 * Get localized email template folder
 *
 * @param  {String}   locale
 * @param  {Function} done   callback run with error,folder
 */
ETI18N.prototype.getLocalizedETF = function getLocalizedETF(locale, done) {
  var self = this;
  fs.lstat(this.templatePath+'/'+locale, function afterCheckIfFolderExists(err) {
    if (err) return done(err);
    done(null, self.templatePath+'/'+locale);
  });
};

module.exports = ETI18N;