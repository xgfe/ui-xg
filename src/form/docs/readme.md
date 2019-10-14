# 表单 Form

提供一种配置化的表单布局和校验方式


## Usage

``` html
<uix-form data="vm.data"></uix-form>
```
```js
data = [{
            key: 'email',
            text: 'email',
            type: 'input',
        }, {
            key: 'condition',
            text: '自定义校验',
            type: 'input',
            value: '',
            immediateCheck: true,
            validor: (val) => {
                return $q((resolve)=> {
                    if (val==1) {
                        resolve({message: '请重新输入', type: 'error'});
                    }
                    resolve(true);
                })
                
            }
        }]
```
## Restrict
- 'E'

## Arguments

### uixForm 参数
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 表单数据 | Array | [] |
| colon | 是否展示冒号，设置值为"true"，即可展示 | String | - |
| textalign | 左侧文案对齐方式 | String[left,right] | Left |
| layout | 布局 | String[horizontal,vertical,inline] | horizontal |
| show-btn | 下方是否展示按钮 | Boolean | true |
| button-inline | 按钮行内展示，默认展示在下方，设置值为"true"，可行内展示 | String | - |
| confirm-text | 左侧按钮文案 | String | 提交 |
| on-confirm | 左侧按钮点击事件 | Function | - |
| cancel-button | 是否展示右侧按钮 | String | - |
| cancel-text | 右侧按钮文案 | String | 取消 |
| on-cancel | 右侧按钮点击事件 | Function | - |
| reset-data | 右侧按钮点击是否重置,仅在配置了右侧按钮时生效 | String | - |
| check-all | 点击左侧按钮是否校验全部数据 | String | - |
| final-value | 数据结果集key,value分别为data中每个配置项的key,value | Object | {} |
| on-final-value-ready | final-value赋值成功后的回调 | Function | - |
| disabled | 左侧按钮是否disabled | Boolean | False |

### data中每个数据项 描述
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 键名，对应于uixform属性final-value中的key | String | - |
| text | label中展示的文案 | String | - |
| type | 表单项类型，可选值：'input','select','multipleSelect','checkbox','radio','datepicker','dateRange'，特殊一类type值是'tpl',当设置type为‘tpl’时,代表一整行都是自定义模板生成 | String | - |
| value | 数据项值，可设置默认展示值 | String/Object | - |
| necessary | 是否必填,如果此项为true,则点击提交按钮会进行空值校验，如果校验不通过则提交按钮置灰 | Boolean | False |
| disabled | 禁用 | Boolean | False |
| placeholder | placeholder | String | - |
| dateFormat | 日期格式化,仅在type为'datepicker','dateRange'情况下生效 | String | - |
| clearBtn | 日期组件展示清除按钮，仅在type为'datepicker','dateRange'情况下生效 | Boolean | False |
| showTime | 是否可以选择时间，仅在type为'datepicker','dateRange'情况下生效 | Boolean | False |
| rowWidth | 行宽，只对vertical布局有效 | Number | 6 |
| labelWidth | label栅格化列数，horizontal和vertical布局生效 | Number | horizontal：2，vertical：6 |
| colWidth | div栅格化列数 | Number | inline:3,horizontal:4,vertical:8 |
| options | 单选多选下拉框列表[{desc:'',value:''}] | Array | - |
| optionKey | 单选多选下拉框列表,指定展示文案的key，默认为'desc' |  |  |
| checkTiming | 校验触发条件,可选值为：change，blur，focus | [] | - |
| relatedCheckKeys | 关联校验，配置关联项的key值，eg:项目a的更改触发b校验，则在a中设置此配置项值为b的key值即可 | [] | - |
| publicCheck | 默认常用校验规则可选范围,'emailReg'，'validCharacterReg'，'letterNumberReg'，'mobileRegTwelveNum'具体可参考regUtil文件 | array | - |
| validor | 自定义校验方法,异步,校验通过返回true，校验不通过返回{isPassed: true/false,message:'',type:''},type可选值为error,warning,success | Function |  |
| tipInfo | 提示文案，用于展示报错信息，可手动设置{message:'',type:''} | {} | - |
| tooltip | label旁边的tip,eg:tooltip: {message: 'tooltip message',color: '#ff552e',icon: 'glyphicon glyphicon-ok-sign'}默认为红色问号提示 | Object | - |
| inputLimit | 只对type=input有效，input输入限制,不满足limit设置的将不能输入 | {} | - |
| limit | 只对type=input有效，inputLimit属性，可选值：number, letter,letterNumber | String | - |
| limitReg | 只对type=input有效，输入限制的正则表达式，只能输入满足匹配条件的字符 |  |  |
| maxlength | 只对type=input有效，inputLimit属性 输入最大长度 | Number | - |
| limitInfo | 只对type=input有效，获取焦点时的输入提示，失去焦点即消失，eg: {message: '只能输入字母', type: 'warning'},type值可选'error','warning','success' |  |  |
| template | 自定义模板字符串 | String | - |
| templateUrl | 自定义模板ID | String | - |
| templateName | 自定义模板名称，当使用自定义模板时此项必填，且名称在当前uixForm组件中唯一 | String | - |
| onChange | ng-change 事件 | Function | -tooltip |
| onFocus | ng-focus 事件 |  |  |
| onBlur | ng-blur 事件 |  |  |