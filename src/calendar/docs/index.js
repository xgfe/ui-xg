import basic from './basic';
import filter from './filter';

import rawBasic from '!!raw-loader!./basic';
import rawFilter from '!!raw-loader!./filter';

import basicTemplate from './basic.html';
import filterTemplate from './filter.html';

export const name = 'calendar';
export const cnName = '日历';
export { default as readme } from './readme.md';

export const demos = {
    basic: {
        title: '基本用法',
        controller: basic,
        template: basicTemplate,
        script: rawBasic
    },
    filter: {
        title: '过滤日期',
        description: '可以定义方法，使部分日期不可选',
        controller: filter,
        template: filterTemplate,
        script: rawFilter
    }
};
