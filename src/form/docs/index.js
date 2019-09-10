import basic from './basic';
import basicScript from '!!raw-loader!./basic';
import basicTemplate from './basic.html';

export const name = 'form';
export const cnName = '表单';
export { default as readme } from './readme.md';

export const demos = {
    basic: {
        title: '基本用法',
        controller: basic,
        template: basicTemplate,
        script: basicScript
    }
};
