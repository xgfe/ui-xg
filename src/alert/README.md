This directive can be used both to generate alerts from static and dynamic model data (using the `ng-repeat` directive).

###fugu-alert settings
- `close` $ *(Default: `false`)* -Define close button if this attribute exists. A callback function that gets fired when an `alert` is closed. If the attribute exists, a close button is displayed as well.You can also define it `true` which it means to use a default callback.

- `close-func` *(Default: `function`)* - Define a callback function that close button will use.

- `close-text` *(Default: `none`)* - Replace icon with a text for close.This attribute requires the presence of the `close` attribute.

- `has-icon` *(Default: `none`)* - Add a icon before the tips,it varies with the change of `type`.

- `dismiss-on-timeout` *(Default: `none`)* - Takes the number of milliseconds that specify the timeout duration, after which the alert will be closed. This attribute requires the presence of the `close` attribute.

- `template-url` *(Default: `alert/templates/alert.html`)* - Add the ability to override the template used in the component.

- `type` *(Default: `warning`)* - Defines the type of the alert. 