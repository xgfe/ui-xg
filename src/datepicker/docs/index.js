import script from './script';
import rawScript from '!!raw-loader!./script';
import indexTemplate from './index.html';

import fullTime from './fullTime';
import rawFullTime from '!!raw-loader!./fullTime';
import fullTimeTemplate from './fullTime.html';

export const name = 'datepicker';
export const cnName = '日期选择框';
export { default as readme } from './readme.md';

export const demos = {
    basic: {
        title: '基本用法',
        controller: script,
        template: indexTemplate,
        script: rawScript
    },
    fullTime: {
        title: '使用年月日作为minDate和maxDate的比较值',
        controller: fullTime,
        template: fullTimeTemplate,
        script: rawFullTime
    }
};
