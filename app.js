var globby = require('globby');

globby(['**/*', '!src/**/*']).then(function (paths) {
    paths.forEach(function (path) {
        if (path.indexOf('bower_components') === -1 && path.indexOf('node_modules') === -1) {
            console.log(path);
        }
    });
});
