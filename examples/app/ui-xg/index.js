import templateModule from './tplModule';
import directives from './directives';

const name = 'ui.xg';

angular.module(name, [
    templateModule,
    ...directives.map(item => 'ui.xg.' + item)
]);

export default name;
