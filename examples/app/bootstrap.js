import './jquery';
import angular from 'angular';
import app from './app';
import './router';
import './directives/index.js';

angular.element(document).ready(function () {
    angular.bootstrap(document, [app.name, function () {
        angular.element(document).find('html').addClass('ng-app');
    }]);
});
