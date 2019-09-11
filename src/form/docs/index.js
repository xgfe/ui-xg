import basic from './basic';
import basicScript from '!!raw-loader!./basic';
import basicTemplate from './basic.html';

import layout from './layout';
import layoutScript from '!!raw-loader!./layout';
import layoutTemplate from './layout.html';

import check from './check';
import checkScript from '!!raw-loader!./check';
import checkTemplate from './check.html';

import customTpl from './customTpl';
import customTplScript from '!!raw-loader!./customTpl';
import customTplTemplate from './customTpl.html';

export const name = 'form';
export const cnName = '表单';
export { default as readme } from './readme.md';

export const demos = {
    basic: {
        title: '基本用法',
        description: `uix-form标签提供data属性，数据项中提供text,type,key基础配置项即可<br>
        还可以在uix-form中配置冒号，文案的对齐方式，数据项中配置是否必填等信息`,
        controller: basic,
        template: basicTemplate,
        script: basicScript
    },
    layout: {
        title: '布局',
        controller: layout,
        description: '基本布局包含inline,vertical,horizontal三种方式<br>根据需要也可以调整下方按钮的位置，支持设置row,label和div的宽度',
        template: layoutTemplate,
        script: layoutScript
    },
    check: {
        title: '校验',
        description: '设置了necessary则会进行空置校验，publicCheck可设置默认校验方式，支持异步自定义校验',
        controller: check,
        template: checkTemplate,
        script: checkScript
    },
    customTpl: {
        title: '自定义模板',
        description: `自定义模板提供template,templateUrl,templateNamme配置项即可<br>
        自定义模板分两种，一种行内自定义，一种是整行自定义，整行自定义需设置type值为'tpl'`,
        controller: customTpl,
        template: customTplTemplate,
        script: customTplScript
    }
};
