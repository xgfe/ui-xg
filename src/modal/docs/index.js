import script from './script';

import rawScript from '!!raw-loader!./script';

import indexTemplate from './index.html';
export const name = 'modal';
export const cnName = '对话框';
export { default as readme } from './readme.md';

export const demos = {
    basic: {
        title: '基本用法',
        controller: script,
        template: indexTemplate,
        script: rawScript
    }
};
