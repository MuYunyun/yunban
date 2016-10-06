# mocha-test

A custom element for running [mocha](https://mochajs.org/) and [chai](http://chaijs.com/) chai tests, where each HTML file is a separate test suite.

```html
<html>
<head>
  <title>My test suite</title>
  <link rel="import" href="path/to/mocha-test/mocha-test.html">
</head>
<body>
  <mocha-test>
    <template>
      <script>
        describe('Running tests', function(){
          it('has never been this easy!', function(){
            assert.ok(true);
          });
        });
      </script>
    </template>
  </mocha-test>
</body>
</html>
```

## Install

Install with either NPM or Bower:

```shell
npm install mocha-test --save-dev
```

```shell
bower install mocha-test --save-dev
```

## Usage

Use [webcomponentsjs](https://github.com/webcomponents/webcomponentsjs) to polyfill the web component APIs in incompatible browsers.  Then use the `<mocha-test>` tag.

By default mocha-test assumes it is running within `node_modules` or `bower_components` and will find **mocha** and **chai** in sibling folders.

### mocha-path and chai-path

If you have put mocha-test.html somewhere else, or your versions of mocha/chai are in non-standard locations you can customize their path with these attributes:

```html
<mocha-test mocha-path="./lib/mocha" chai-path="./lib/chai">
  ...
</mocha-test>
```

Note that this is the path to the mocha/chai **folder**, not their JavaScript files.

### ui

This attribute lets you control which user-interface is used. Either **bdd**, **tdd** or **exports** are valid options. **bdd** is the default.

```html
<mocha-test ui="tdd">...</mocha-test>
```

## License

BSD 2 Clause
