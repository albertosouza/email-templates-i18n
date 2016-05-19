# email-templates-i18n [![npm version](https://badge.fury.io/js/email-templates-i18n.svg)](https://badge.fury.io/js/email-templates-i18n) [![Build Status](https://travis-ci.org/albertosouza/email-templates-i18n.svg?branch=master)](https://travis-ci.org/albertosouza/email-templates-i18n) [![Coverage Status](https://coveralls.io/repos/github/albertosouza/email-templates-i18n/badge.svg?branch=master)](https://coveralls.io/github/albertosouza/email-templates-i18n?branch=master)

Localizable email templates, extends node.js email-templates with suport to subfolder for localization

email-templates repository: https://github.com/niftylettuce/node-email-templates 

## Installation

```sh
$ npm install --save email-templates-i18n
```

## Template folder structure:
```
templates/
templates/newsletter/
// defalt locale templates are stored in root folder and by default is en-us:
templates/newsletter/html.{{ext}}
templates/newsletter/style.{{ext}}
// for add en-ca locale:
templates/newsletter/en-ca/html.{{ext}}
templates/newsletter/en-ca/style.{{ext}}
```

This module have suport to all templates avaible in *email-templates* npm module

## Usage

Usage is same as https://github.com/niftylettuce/node-email-templates but in render function we have the locale extra param:

```js
var EmailTemplate = require('email-templates-i18n');

var template = new EmailTemplate(templateDir);
template.render({},'en-ca', function(err, email){
    console.log(err, email);
});
```

#### With email-template options

```js
var EmailTemplate = require('email-templates-i18n');

var template = new EmailTemplate(templateDir, {
    juiceOptions: {
        preserveMediaQueries: false,
        removeStyleTags: false
    }
});

template.render({},'en-ca', function(err, email){
    console.log(err, email)
});
```

#### See tests for more usage options

## Notes

Code exported from We.js (we-core) to be compatible with any framework

## License

Apache-2.0 © [albertosouza](http://albertosouza.net/)

[npm-image]: https://badge.fury.io/js/email-templates-i18n.svg
[npm-url]: https://npmjs.org/package/email-templates-i18n
[travis-image]: https://travis-ci.org/albertosouza/email-templates-i18n.svg?branch=master
[travis-url]: https://travis-ci.org/albertosouza/email-templates-i18n
[daviddm-image]: https://david-dm.org/albertosouza/email-templates-i18n.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/albertosouza/email-templates-i18n
[coveralls-image]: https://coveralls.io/repos/albertosouza/email-templates-i18n/badge.svg
[coveralls-url]: https://coveralls.io/r/albertosouza/email-templates-i18n
