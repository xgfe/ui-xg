// 注册所有模板
import { putTemplate } from '../utils';
import templates from './templates';

const name = 'ui.xg.tpls';
const templateModule = angular.module(name, []);

let templateFactory = putTemplate(templateModule);

templates.forEach(({ filename, template }) => {
    templateFactory(filename, template);
});

export default name;
