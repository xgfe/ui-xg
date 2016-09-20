/**
 * select
 * select directive fork from ui-select[https://github.com/angular-ui/ui-select]
 * Author: yjy972080142@gmail.com
 * Date:2016-03-29
 */
angular.module('ui.xg.select', [])
    .constant('uixSelectConfig', {
        KEY: {
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            SPACE: 32,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            HOME: 36,
            END: 35,
            BACKSPACE: 8,
            DELETE: 46,
            COMMAND: 91,
            MAP: {
                91: 'COMMAND',
                8: 'BACKSPACE',
                9: 'TAB',
                13: 'ENTER',
                16: 'SHIFT',
                17: 'CTRL',
                18: 'ALT',
                19: 'PAUSEBREAK',
                20: 'CAPSLOCK',
                27: 'ESC',
                32: 'SPACE',
                33: 'PAGE_UP',
                34: 'PAGE_DOWN',
                35: 'END',
                36: 'HOME',
                37: 'LEFT',
                38: 'UP',
                39: 'RIGHT',
                40: 'DOWN',
                43: '+',
                44: 'PRINTSCREEN',
                45: 'INSERT',
                46: 'DELETE',
                48: '0',
                49: '1',
                50: '2',
                51: '3',
                52: '4',
                53: '5',
                54: '6',
                55: '7',
                56: '8',
                57: '9',
                59: ';',
                61: '=',
                65: 'A',
                66: 'B',
                67: 'C',
                68: 'D',
                69: 'E',
                70: 'F',
                71: 'G',
                72: 'H',
                73: 'I',
                74: 'J',
                75: 'K',
                76: 'L',
                77: 'M',
                78: 'N',
                79: 'O',
                80: 'P',
                81: 'Q',
                82: 'R',
                83: 'S',
                84: 'T',
                85: 'U',
                86: 'V',
                87: 'W',
                88: 'X',
                89: 'Y',
                90: 'Z',
                96: '0',
                97: '1',
                98: '2',
                99: '3',
                100: '4',
                101: '5',
                102: '6',
                103: '7',
                104: '8',
                105: '9',
                106: '*',
                107: '+',
                109: '-',
                110: '.',
                111: '/',
                112: 'F1',
                113: 'F2',
                114: 'F3',
                115: 'F4',
                116: 'F5',
                117: 'F6',
                118: 'F7',
                119: 'F8',
                120: 'F9',
                121: 'F10',
                122: 'F11',
                123: 'F12',
                144: 'NUMLOCK',
                145: 'SCROLLLOCK',
                186: ';',
                187: '=',
                188: ',',
                189: '-',
                190: '.',
                191: '/',
                192: '`',
                219: '[',
                220: '\\',
                221: ']',
                222: '\''
            },
            isControl: function (evt) {
                var k = evt.which;
                switch (k) {
                    case this.COMMAND:
                    case this.SHIFT:
                    case this.CTRL:
                    case this.ALT:
                        return true;
                }

                return evt.metaKey;
            },
            isFunctionKey: function (k) {
                k = k.which ? k.which : k;
                return k >= 112 && k <= 123;
            },
            isVerticalMovement: function (k) {
                return [this.UP, this.DOWN].indexOf(k) !== -1;
            },
            isHorizontalMovement: function (k) {
                return [this.LEFT, this.RIGHT, this.BACKSPACE, this.DELETE].indexOf(k) !== -1;
            }
        },
        searchEnabled: true,
        sortable: false,
        placeholder: '', // Empty by default, like HTML tag <select>
        refreshDelay: 1000, // In milliseconds
        closeOnSelect: true,
        appendToBody: false
    })
    // 当指令传递参数等发生错误时抛出异常
    .service('uixSelectMinErr', function () {
        var minErr = angular.$$minErr('ui.xg.select');
        return function () {
            var error = minErr.apply(this, arguments);
            var str = '\n?http://errors.angularjs.org/.*';
            var message = error.message.replace(new RegExp(str), '').trim();
            return new Error(message);
        };
    })
    // 添加DOM节点到指定内
    .directive('uixTranscludeAppend', function () {
        return {
            link: function (scope, element, attrs, ctrl, transclude) {
                transclude(scope, function (clone) {
                    element.append(clone);
                });
            }
        };
    })
    // 高亮文本过滤器
    .filter('highlight', function () {
        function escapeRegexp(queryToEscape) {
            return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
        }

        return function (matchItem, query) {
            return query && matchItem
                ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'),
                '<span class="uix-select-highlight">$&</span>')
                : matchItem;
        };
    })
    // 位置偏移
    .factory('uixSelectOffset', ['$document', '$window', function ($document, $window) {
        return function (element) {
            var elem = element[0] || element;
            var elemBCR = elem.getBoundingClientRect();
            return {
                width: Math.round(angular.isNumber(elemBCR.width) ? elemBCR.width : elem.offsetWidth),
                height: Math.round(angular.isNumber(elemBCR.height) ? elemBCR.height : elem.offsetHeight),
                top: Math.round(elemBCR.top + ($window.pageYOffset || $document[0].documentElement.scrollTop)),
                left: Math.round(elemBCR.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft))
            };
        };
    }])
    .controller('uixSelectCtrl', ['$scope', '$element', '$timeout', '$filter', 'uixSelectRepeatParser',
        'uixSelectMinErr', 'uixSelectConfig',
        function ($scope, $element, $timeout, $filter, RepeatParser,
                  uixSelectMinErr, uixSelectConfig) {
            var KEY = uixSelectConfig.KEY;
            var ctrl = this;

            var EMPTY_SEARCH = '';

            ctrl.placeholder = uixSelectConfig.placeholder;
            ctrl.searchEnabled = uixSelectConfig.searchEnabled;
            ctrl.sortable = uixSelectConfig.sortable;
            ctrl.refreshDelay = uixSelectConfig.refreshDelay;

            ctrl.removeSelected = false; //If selected item(s) should be removed from dropdown list
            ctrl.closeOnSelect = true; //Initialized inside uixSelect directive link function
            ctrl.search = EMPTY_SEARCH;

            ctrl.activeIndex = 0; //Dropdown of choices
            ctrl.items = []; //All available choices

            ctrl.open = false;
            ctrl.focus = false;
            ctrl.disabled = false;
            ctrl.selected = null;

            ctrl.focusser = null; //Reference to input element used to handle focus events
            ctrl.resetSearchInput = true;
            ctrl.multiple = null; // Initialized inside uixSelect directive link function
            ctrl.disableChoiceExpression = null; // Initialized inside uixSelectChoices directive link function
            ctrl.tagging = {isActivated: false, fct: null};
            ctrl.taggingTokens = {isActivated: false, tokens: null};
            ctrl.lockChoiceExpression = null; // Initialized inside uixSelectMatch directive link function
            ctrl.clickTriggeredSelect = false;
            ctrl.$filter = $filter;

            ctrl.searchInput = angular.element($element[0].querySelectorAll('input.uix-select-search'));
            if (ctrl.searchInput.length !== 1) {
                throw uixSelectMinErr('searchInput', 'Expected 1 input.uix-select-search but got \'{0}\'.',
                    ctrl.searchInput.length);
            }

            ctrl.isEmpty = function () {
                return angular.isUndefined(ctrl.selected) || ctrl.selected === null || ctrl.selected === '';
            };

            // Most of the time the user does not want to empty the search input when in typeahead mode
            function _resetSearchInput() {
                if (ctrl.resetSearchInput || (angular.isUndefined(ctrl.resetSearchInput) &&
                    uixSelectConfig.resetSearchInput)) {
                    ctrl.search = EMPTY_SEARCH;
                    //reset activeIndex
                    if (ctrl.selected && ctrl.items.length && !ctrl.multiple) {
                        ctrl.activeIndex = ctrl.items.indexOf(ctrl.selected);
                    }
                }
            }

            function _groupsFilter(groups, groupNames) {
                var i, j, result = [];
                for (i = 0; i < groupNames.length; i++) {
                    for (j = 0; j < groups.length; j++) {
                        if (groups[j].name === groupNames[i]) {
                            result.push(groups[j]);
                        }
                    }
                }
                return result;
            }

            // When the user clicks on uix-select, displays the dropdown list
            ctrl.activate = function (initSearchValue, avoidReset) {
                if (!ctrl.disabled && !ctrl.open) {
                    if (!avoidReset) {
                        _resetSearchInput();
                    }

                    $scope.$broadcast('uixSelect:activate');

                    ctrl.open = true;

                    ctrl.activeIndex = ctrl.activeIndex >= ctrl.items.length ? 0 : ctrl.activeIndex;

                    // ensure that the index is set to zero for tagging variants
                    // that where first option is auto-selected
                    if (ctrl.activeIndex === -1 && ctrl.taggingLabel !== false) {
                        ctrl.activeIndex = 0;
                    }

                    // Give it time to appear before focus
                    $timeout(function () {
                        ctrl.search = initSearchValue || ctrl.search;
                        ctrl.searchInput[0].focus();
                    });
                }
            };

            ctrl.findGroupByName = function (name) {
                return ctrl.groups && ctrl.groups.filter(function (group) {
                    return group.name === name;
                })[0];
            };

            ctrl.parseRepeatAttr = function (repeatAttr, groupByExp, groupFilterExp) {
                function updateGroups(items) {
                    var groupFn = $scope.$eval(groupByExp);
                    ctrl.groups = [];
                    angular.forEach(items, function (item) {
                        var groupName = angular.isFunction(groupFn) ? groupFn(item) : item[groupFn];
                        var group = ctrl.findGroupByName(groupName);
                        if (group) {
                            group.items.push(item);
                        }
                        else {
                            ctrl.groups.push({name: groupName, items: [item]});
                        }
                    });
                    if (groupFilterExp) {
                        var groupFilterFn = $scope.$eval(groupFilterExp);
                        if (angular.isFunction(groupFilterFn)) {
                            ctrl.groups = groupFilterFn(ctrl.groups);
                        } else if (angular.isArray(groupFilterFn)) {
                            ctrl.groups = _groupsFilter(ctrl.groups, groupFilterFn);
                        }
                    }
                    ctrl.items = [];
                    ctrl.groups.forEach(function (group) {
                        ctrl.items = ctrl.items.concat(group.items);
                    });
                }

                function setPlainItems(items) {
                    ctrl.items = items;
                }

                ctrl.setItemsFn = groupByExp ? updateGroups : setPlainItems;

                ctrl.parserResult = RepeatParser.parse(repeatAttr);

                ctrl.isGrouped = !!groupByExp;
                ctrl.itemProperty = ctrl.parserResult.itemName;

                ctrl.refreshItems = function (data) {
                    $scope.calculateDropdownPos();
                    data = data || ctrl.parserResult.source($scope);
                    var selectedItems = ctrl.selected;
                    //TODO should implement for single mode removeSelected
                    if ((angular.isArray(selectedItems) && !selectedItems.length) || !ctrl.removeSelected) {
                        ctrl.setItemsFn(data);
                    } else {
                        if (angular.isDefined(data) && data !== null) {
                            var filteredItems = data.filter(function (i) {
                                return selectedItems.indexOf(i) < 0;
                            });
                            ctrl.setItemsFn(filteredItems);
                        }
                    }
                };

                // See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L259
                $scope.$watchCollection(ctrl.parserResult.source, function (items) {
                    if (angular.isUndefined(items) || items === null) {
                        // If the user specifies undefined or null => reset the collection
                        // Special case: items can be undefined if the user did not initialized
                        // i.e $scope.addresses = [] is missing
                        ctrl.items = [];
                    } else {
                        if (!angular.isArray(items)) {
                            throw uixSelectMinErr('items', 'Expected an array but got \'{0}\'.', items);
                        } else {
                            //Remove already selected items (ex: while searching)
                            //TODO Should add a test
                            ctrl.refreshItems(items);
                            //Force scope model value and ngModel value to be out of sync to re-run formatters
                            ctrl.ngModel.$modelValue = null;
                        }
                    }
                });

            };

            var _refreshDelayPromise;

            /**
             * Typeahead mode: lets the user refresh the collection using his own function.
             *
             * See Expose $select.search for external / remote filtering
             * https://github.com/angular-ui/ui-select/pull/31
             */
            ctrl.refresh = function (refreshAttr) {
                if (angular.isDefined(refreshAttr)) {

                    // Debounce
                    // See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L155
                    // FYI AngularStrap typeahead does not have debouncing:
                    // https://github.com/mgcrea/angular-strap/blob/v2.0.0-rc.4/src/typeahead/typeahead.js#L177
                    if (_refreshDelayPromise) {
                        $timeout.cancel(_refreshDelayPromise);
                    }
                    _refreshDelayPromise = $timeout(function () {
                        $scope.$eval(refreshAttr);
                    }, ctrl.refreshDelay);
                }
            };

            ctrl.setActiveItem = function (item) {
                ctrl.activeIndex = ctrl.items.indexOf(item);
            };

            ctrl.isActive = function (itemScope) {
                if (!ctrl.open) {
                    return false;
                }
                var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
                var isActive = itemIndex === ctrl.activeIndex;

                if (!isActive || (itemIndex < 0 && ctrl.taggingLabel !== false) ||
                    (itemIndex < 0 && ctrl.taggingLabel === false)) {
                    return false;
                }

                if (isActive && angular.isDefined(ctrl.onHighlightCallback)) {
                    itemScope.$eval(ctrl.onHighlightCallback);
                }

                return isActive;
            };

            ctrl.isDisabled = function (itemScope) {

                if (!ctrl.open) {
                    return;
                }

                var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
                var isDisabled = false;
                var item;

                if (itemIndex >= 0 && angular.isDefined(ctrl.disableChoiceExpression)) {
                    item = ctrl.items[itemIndex];
                    isDisabled = !!(itemScope.$eval(ctrl.disableChoiceExpression)); // force the boolean value
                    item._uixSelectChoiceDisabled = isDisabled; // store this for later reference
                }

                return isDisabled;
            };


            // When the user selects an item with ENTER or clicks the dropdown
            ctrl.select = function (item, skipFocusser, $event) {
                if (angular.isUndefined(item) || !item._uixSelectChoiceDisabled) {

                    if (!ctrl.items && !ctrl.search) {
                        return;
                    }

                    if (!item || !item._uixSelectChoiceDisabled) {
                        if (ctrl.tagging.isActivated) {
                            // if taggingLabel is disabled, we pull from ctrl.search val
                            if (ctrl.taggingLabel === false) {
                                if (ctrl.activeIndex < 0) {
                                    item = ctrl.tagging.fct === null ? ctrl.search : ctrl.tagging.fct(ctrl.search);
                                    if (!item || angular.equals(ctrl.items[0], item)) {
                                        return;
                                    }
                                } else {
                                    // keyboard nav happened first, user selected from dropdown
                                    item = ctrl.items[ctrl.activeIndex];
                                }
                            } else {
                                // tagging always operates at index zero, taggingLabel === false pushes
                                // the ctrl.search value without having it injected
                                if (ctrl.activeIndex === 0) {
                                    // ctrl.tagging pushes items to ctrl.items, so we only have empty val
                                    // for `item` if it is a detected duplicate
                                    if (angular.isUndefined(item)) {
                                        return;
                                    }

                                    // create new item on the fly if we don't already have one;
                                    // use tagging function if we have one
                                    if (angular.isDefined(ctrl.tagging.fct) &&
                                        ctrl.tagging.fct !== null &&
                                        angular.isString(item)) {
                                        item = ctrl.tagging.fct(ctrl.search);
                                        if (!item) {
                                            return;
                                        }
                                        // if item type is 'string', apply the tagging label
                                    } else if (angular.isString(item)) {
                                        // trim the trailing space
                                        item = item.replace(ctrl.taggingLabel, '').trim();
                                    }
                                }
                            }
                            // search ctrl.selected for dupes potentially caused by tagging and return early if found
                            if (ctrl.selected && angular.isArray(ctrl.selected)) {
                                var len = ctrl.selected.filter(function (selection) {
                                    return angular.equals(selection, item);
                                }).length;
                                if (len > 0) {
                                    ctrl.close(skipFocusser);
                                    return;
                                }
                            }
                        }

                        $scope.$broadcast('uixSelect:select', item);

                        var locals = {};
                        locals[ctrl.parserResult.itemName] = item;

                        $timeout(function () {
                            ctrl.onSelectCallback($scope, {
                                $item: item,
                                $model: ctrl.parserResult.modelMapper($scope, locals)
                            });
                        });

                        if (ctrl.closeOnSelect) {
                            ctrl.close(skipFocusser);
                        }
                        if ($event && $event.type === 'click') {
                            ctrl.clickTriggeredSelect = true;
                        }
                    }
                }
            };

            // Closes the dropdown
            ctrl.close = function (skipFocusser) {
                if (!ctrl.open) {
                    return;
                }
                if (ctrl.ngModel && ctrl.ngModel.$setTouched) {
                    ctrl.ngModel.$setTouched();
                }
                _resetSearchInput();
                ctrl.open = false;

                $scope.$broadcast('uixSelect:close', skipFocusser);

            };

            ctrl.setFocus = function () {
                if (!ctrl.focus) {
                    ctrl.focusInput[0].focus();
                }
            };

            ctrl.clear = function ($event) {
                ctrl.select();
                $event.stopPropagation();
                $timeout(function () {
                    ctrl.focusser[0].focus();
                }, 0, false);
            };

            // Toggle dropdown
            ctrl.toggle = function (evt) {
                if (ctrl.open) {
                    ctrl.close();
                    evt.preventDefault();
                    evt.stopPropagation();
                } else {
                    ctrl.activate();
                }
            };

            ctrl.isLocked = function (itemScope, itemIndex) {
                var isLocked, item = ctrl.selected[itemIndex];

                if (item && angular.isDefined(ctrl.lockChoiceExpression)) {
                    isLocked = !!(itemScope.$eval(ctrl.lockChoiceExpression)); // force the boolean value
                    item._uixSelectChoiceLocked = isLocked; // store this for later reference
                }

                return isLocked;
            };

            var sizeWatch = null;
            ctrl.sizeSearchInput = function () {

                var input = ctrl.searchInput[0],
                    container = ctrl.searchInput.parent().parent()[0],
                    calculateContainerWidth = function () {
                        // Return the container width only if the search input is visible
                        return container.clientWidth * !!input.offsetParent;
                    },
                    updateIfVisible = function (containerWidth) {
                        if (containerWidth === 0) {
                            return false;
                        }
                        var inputWidth = containerWidth - input.offsetLeft - 10;
                        if (inputWidth < 50) {
                            inputWidth = containerWidth;
                        }
                        ctrl.searchInput.css('width', inputWidth + 'px');
                        return true;
                    };

                ctrl.searchInput.css('width', '10px');
                $timeout(function () { //Give tags time to render correctly
                    if (sizeWatch === null && !updateIfVisible(calculateContainerWidth())) {
                        sizeWatch = $scope.$watch(calculateContainerWidth, function (containerWidth) {
                            if (updateIfVisible(containerWidth)) {
                                sizeWatch();
                                sizeWatch = null;
                            }
                        });
                    }
                });
            };

            function _handleDropDownSelection(key) {
                var processed = true;
                switch (key) {
                    case KEY.DOWN:
                        if (!ctrl.open && ctrl.multiple) {
                            ctrl.activate(false, true);//In case its the search input in 'multiple' mode
                        } else if (ctrl.activeIndex < ctrl.items.length - 1) {
                            ctrl.activeIndex++;
                        }
                        break;
                    case KEY.UP:
                        if (!ctrl.open && ctrl.multiple) {
                            ctrl.activate(false, true);//In case its the search input in 'multiple' mode
                        } else if (
                            ctrl.activeIndex > 0 ||
                            (ctrl.search.length === 0 && ctrl.tagging.isActivated && ctrl.activeIndex > -1)
                        ) {
                            ctrl.activeIndex--;
                        }
                        break;
                    case KEY.TAB:
                        if (!ctrl.multiple || ctrl.open) {
                            ctrl.select(ctrl.items[ctrl.activeIndex], true);
                        }
                        break;
                    case KEY.ENTER:
                        if (ctrl.open && (ctrl.tagging.isActivated || ctrl.activeIndex >= 0)) {
                            // Make sure at least one dropdown item is highlighted before adding if not in tagging mode
                            ctrl.select(ctrl.items[ctrl.activeIndex]);
                        } else {
                            ctrl.activate(false, true); //In case its the search input in 'multiple' mode
                        }
                        break;
                    case KEY.ESC:
                        ctrl.close();
                        break;
                    default:
                        processed = false;
                }
                return processed;
            }

            // Bind to keyboard shortcuts
            ctrl.searchInput.on('keydown', function (evt) {

                var key = evt.which;

                // if(~[KEY.ESC,KEY.TAB].indexOf(key)){
                //   //TODO: SEGURO?
                //   ctrl.close();
                // }

                $scope.$apply(function () {

                    var tagged = false;

                    if (ctrl.items.length > 0 || ctrl.tagging.isActivated) {
                        _handleDropDownSelection(key);
                        if (ctrl.taggingTokens.isActivated) {
                            for (var i = 0; i < ctrl.taggingTokens.tokens.length; i++) {
                                if (ctrl.taggingTokens.tokens[i] === KEY.MAP[evt.keyCode]) {
                                    // make sure there is a new value to push via tagging
                                    if (ctrl.search.length > 0) {
                                        tagged = true;
                                    }
                                }
                            }
                            if (tagged) {
                                $timeout(function () {
                                    ctrl.searchInput.triggerHandler('tagged');
                                    var newItem = ctrl.search.replace(KEY.MAP[evt.keyCode], '').trim();
                                    if (ctrl.tagging.fct) {
                                        newItem = ctrl.tagging.fct(newItem);
                                    }
                                    if (newItem) {
                                        ctrl.select(newItem, true);
                                    }
                                });
                            }
                        }
                    }

                });

                if (KEY.isVerticalMovement(key) && ctrl.items.length > 0) {
                    _ensureHighlightVisible();
                }

                if (key === KEY.ENTER || key === KEY.ESC) {
                    evt.preventDefault();
                    evt.stopPropagation();
                }

            });

            // If tagging try to split by tokens and add items
            ctrl.searchInput.on('paste', function (evt) {
                var data = evt.originalEvent.clipboardData.getData('text/plain');
                if (data && data.length > 0 && ctrl.taggingTokens.isActivated && ctrl.tagging.fct) {
                    var items = data.split(ctrl.taggingTokens.tokens[0]); // split by first token only
                    if (items && items.length > 0) {
                        angular.forEach(items, function (item) {
                            var newItem = ctrl.tagging.fct(item);
                            if (newItem) {
                                ctrl.select(newItem, true);
                            }
                        });
                        evt.preventDefault();
                        evt.stopPropagation();
                    }
                }
            });

            ctrl.searchInput.on('tagged', function () {
                $timeout(function () {
                    _resetSearchInput();
                });
            });

            // See https://github.com/ivaynberg/select2/blob/3.4.6/select2.js#L1431
            function _ensureHighlightVisible() {
                var container = angular.element($element[0].querySelectorAll('.uix-select-choices-content'));
                var choices = angular.element(container[0].querySelectorAll('.uix-select-choices-row'));
                if (choices.length < 1) {
                    throw uixSelectMinErr('choices', 'Expected multiple .uix-select-choices-row but got \'{0}\'.',
                        choices.length);
                }

                if (ctrl.activeIndex < 0) {
                    return;
                }

                var highlighted = choices[ctrl.activeIndex];
                var posY = highlighted.offsetTop + highlighted.clientHeight - container[0].scrollTop;
                var height = container[0].offsetHeight;

                if (posY > height) {
                    container[0].scrollTop += posY - height;
                } else if (posY < highlighted.clientHeight) {
                    if (ctrl.isGrouped && ctrl.activeIndex === 0) {
                        container[0].scrollTop = 0; //To make group header visible when going all the way up
                    } else {
                        container[0].scrollTop -= highlighted.clientHeight - posY;
                    }
                }
            }

            $scope.$on('$destroy', function () {
                ctrl.searchInput.off('keyup keydown tagged blur paste');
            });
        }])
    .directive('uixSelect', ['$document', 'uixSelectConfig', 'uixSelectMinErr', 'uixSelectOffset',
        '$parse', '$timeout',
        function ($document, uixSelectConfig, uixSelectMinErr, uixSelectOffset, $parse, $timeout) {
            return {
                restrict: 'EA',
                templateUrl: function (tElement, tAttrs) {
                    return angular.isDefined(tAttrs.multiple)
                        ? 'templates/select-multiple.html' : 'templates/select.html';
                },
                replace: true,
                transclude: true,
                require: ['uixSelect', '^ngModel'],
                scope: true,
                controller: 'uixSelectCtrl',
                controllerAs: '$select',
                compile: function (tElement, tAttrs) {
                    //Multiple or Single depending if multiple attribute presence
                    if (angular.isDefined(tAttrs.multiple)) {
                        tElement.append('<uix-select-multiple/>').removeAttr('multiple');
                    } else {
                        tElement.append('<uix-select-single/>');
                    }

                    return function (scope, element, attrs, ctrls, transcludeFn) {

                        var $select = ctrls[0];
                        var ngModel = ctrls[1];

                        $select.baseTitle = attrs.title || 'Select box';
                        $select.focusserTitle = $select.baseTitle + ' focus';

                        $select.closeOnSelect = (function () {
                            if (angular.isDefined(attrs.closeOnSelect)) {
                                return $parse(attrs.closeOnSelect)();
                            } else {
                                return uixSelectConfig.closeOnSelect;
                            }
                        })();

                        $select.onSelectCallback = $parse(attrs.onSelect);
                        $select.onRemoveCallback = $parse(attrs.onRemove);

                        //Set reference to ngModel from uixSelectCtrl
                        $select.ngModel = ngModel;

                        $select.choiceGrouped = function (group) {
                            return $select.isGrouped && group && group.name;
                        };

                        if (attrs.tabindex) {
                            attrs.$observe('tabindex', function (value) {
                                $select.focusInput.attr('tabindex', value);
                                element.removeAttr('tabindex');
                            });
                        }

                        scope.$watch('searchEnabled', function () {
                            var searchEnabled = scope.$eval(attrs.searchEnabled);
                            $select.searchEnabled = angular.isDefined(searchEnabled)
                                ? searchEnabled : uixSelectConfig.searchEnabled;
                        });

                        scope.$watch('sortable', function () {
                            var sortable = scope.$eval(attrs.sortable);
                            $select.sortable = angular.isDefined(sortable) ? sortable : uixSelectConfig.sortable;
                        });

                        attrs.$observe('disabled', function () {
                            // No need to use $eval() (thanks to ng-disabled) since we already get a boolean instead of a string
                            $select.disabled = angular.isDefined(attrs.disabled)
                                ? attrs.disabled : false;
                        });

                        attrs.$observe('resetSearchInput', function () {
                            // $eval() is needed otherwise we get a string instead of a boolean
                            var resetSearchInput = scope.$eval(attrs.resetSearchInput);
                            $select.resetSearchInput = angular.isDefined(resetSearchInput) ? resetSearchInput : true;
                        });

                        attrs.$observe('tagging', function () {
                            if (angular.isDefined(attrs.tagging)) {
                                // $eval() is needed otherwise we get a string instead of a boolean
                                var taggingEval = scope.$eval(attrs.tagging);
                                $select.tagging = {
                                    isActivated: true,
                                    fct: taggingEval !== true ? taggingEval : null
                                };
                            } else {
                                $select.tagging = {isActivated: false};
                            }
                        });

                        attrs.$observe('taggingLabel', function () {
                            if (angular.isDefined(attrs.tagging)) {
                                // check eval for FALSE, in this case, we disable the labels
                                // associated with tagging
                                if (attrs.taggingLabel === 'false') {
                                    $select.taggingLabel = false;
                                }
                                else {
                                    $select.taggingLabel = angular.isDefined(attrs.taggingLabel)
                                        ? attrs.taggingLabel : '(new)';
                                }
                            }
                        });

                        attrs.$observe('taggingTokens', function () {
                            if (angular.isDefined(attrs.tagging)) {
                                var tokens = angular.isDefined(attrs.taggingTokens)
                                    ? attrs.taggingTokens.split('|') : [',', 'ENTER'];
                                $select.taggingTokens = {isActivated: true, tokens: tokens};
                            }
                        });

                        //Automatically gets focus when loaded
                        if (angular.isDefined(attrs.autofocus)) {
                            $timeout(function () {
                                $select.setFocus();
                            });
                        }

                        //Gets focus based on scope event name (e.g. focus-on='SomeEventName')
                        if (angular.isDefined(attrs.focusOn)) {
                            scope.$on(attrs.focusOn, function () {
                                $timeout(function () {
                                    $select.setFocus();
                                });
                            });
                        }

                        function onDocumentClick(evt) {
                            if (!$select.open) {
                                return;//Skip it if dropdown is close
                            }

                            var contains = false;

                            if (angular.element.contains) {
                                // Firefox 3.6 does not support element.contains()
                                // See Node.contains https://developer.mozilla.org/en-US/docs/Web/API/Node.contains
                                contains = angular.element.contains(element[0], evt.target);
                            } else {
                                contains = element[0].contains(evt.target);
                            }

                            if (!contains && !$select.clickTriggeredSelect) {
                                //Will lose focus only with certain targets
                                var focusableControls = ['input', 'button', 'textarea'];
                                //To check if target is other uix-select
                                var targetScope = angular.element(evt.target).scope();
                                //To check if target is other uix-select
                                var skipFocusser = targetScope && targetScope.$select &&
                                    targetScope.$select !== $select;
                                if (!skipFocusser) {//Check if target is input, button or textarea
                                    skipFocusser = focusableControls.indexOf(evt.target.tagName.toLowerCase()) !== -1;
                                }
                                $select.close(skipFocusser);
                                scope.$digest();
                            }
                            $select.clickTriggeredSelect = false;
                        }

                        // See Click everywhere but here event http://stackoverflow.com/questions/12931369
                        $document.on('click', onDocumentClick);

                        scope.$on('$destroy', function () {
                            $document.off('click', onDocumentClick);
                        });

                        // Move transcluded elements to their correct position in main template
                        transcludeFn(scope, function (clone) {

                            // One day jqLite will be replaced by jQuery and we will be able to write:
                            // var transcludedElement = clone.filter('.my-class')
                            // instead of creating a hackish DOM element:
                            var transcluded = angular.element('<div>').append(clone);
                            var transcludedMatch = angular.element(transcluded[0].querySelectorAll('.uix-select-match'));
                            transcludedMatch.removeAttr('uix-select-match'); //To avoid loop in case directive as attr
                            transcludedMatch.removeAttr('data-uix-select-match'); // Properly handle HTML5 data-attributes
                            if (transcludedMatch.length !== 1) {
                                throw uixSelectMinErr('transcluded', 'Expected 1 .uix-select-match but got \'{0}\'.', transcludedMatch.length);
                            }
                            angular.element(element[0].querySelectorAll('.uix-select-match')).replaceWith(transcludedMatch);

                            var transcludedChoices = angular.element(transcluded[0].querySelectorAll('.uix-select-choices'));
                            transcludedChoices.removeAttr('uix-select-choices'); //To avoid loop in case directive as attr
                            transcludedChoices.removeAttr('data-uix-select-choices'); // Properly handle HTML5 data-attributes
                            if (transcludedChoices.length !== 1) {
                                throw uixSelectMinErr('transcluded', 'Expected 1 .uix-select-choices but got \'{0}\'.', transcludedChoices.length);
                            }
                            angular.element(element[0].querySelectorAll('.uix-select-choices')).replaceWith(transcludedChoices);
                        });

                        // Support for appending the select field to the body when its open
                        var appendToBody = scope.$eval(attrs.appendToBody);
                        if (angular.isDefined(appendToBody) ? appendToBody : uixSelectConfig.appendToBody) {
                            scope.$watch('$select.open', function (isOpen) {
                                if (isOpen) {
                                    positionDropdown();
                                } else {
                                    resetDropdown();
                                }
                            });
                            // Move the dropdown back to its original location when the scope is destroyed. Otherwise
                            // it might stick around when the user routes away or the select field is otherwise removed
                            scope.$on('$destroy', function () {
                                resetDropdown();
                            });
                        }

                        // Hold on to a reference to the .uix-select-container element for appendToBody support
                        var placeholder = null,
                            originalWidth = '';

                        function positionDropdown() {
                            // Remember the absolute position of the element
                            var offset = uixSelectOffset(element);

                            // Clone the element into a placeholder element to take its original place in the DOM
                            placeholder = angular.element('<div class="uix-select-placeholder"></div>');
                            placeholder[0].style.width = offset.width + 'px';
                            placeholder[0].style.height = offset.height + 'px';
                            element.after(placeholder);

                            // Remember the original value of the element width inline style, so it can be restored
                            // when the dropdown is closed
                            originalWidth = element[0].style.width;

                            // Now move the actual dropdown element to the end of the body
                            $document.find('body').append(element);

                            element[0].style.position = 'absolute';
                            element[0].style.left = offset.left + 'px';
                            element[0].style.top = offset.top + 'px';
                            element[0].style.width = offset.width + 'px';
                        }

                        function resetDropdown() {
                            if (placeholder === null) {
                                // The dropdown has not actually been display yet, so there's nothing to reset
                                return;
                            }

                            // Move the dropdown element back to its original location in the DOM
                            placeholder.replaceWith(element);
                            placeholder = null;

                            element[0].style.position = '';
                            element[0].style.left = '';
                            element[0].style.top = '';
                            element[0].style.width = originalWidth;
                        }

                        // Hold on to a reference to the .uix-select-dropdown element for direction support.
                        var dropdown = null,
                            directionUpClassName = 'direction-up';

                        // Support changing the direction of the dropdown if there isn't enough space to render it.
                        scope.$watch('$select.open', function () {
                            scope.calculateDropdownPos();
                        });

                        scope.calculateDropdownPos = function () {
                            if ($select.open) {
                                dropdown = angular.element(element[0].querySelectorAll('.uix-select-dropdown'));
                                if (dropdown === null) {
                                    return;
                                }

                                // Hide the dropdown so there is no flicker until $timeout is done executing.
                                dropdown[0].style.opacity = 0;

                                // Delay positioning the dropdown until all choices have been added so its height is correct.
                                $timeout(function () {
                                    element.removeClass(directionUpClassName);
                                    var offset = uixSelectOffset(element);
                                    var offsetDropdown = uixSelectOffset(dropdown);

                                    var scrollTop = $document[0].documentElement.scrollTop || $document[0].body.scrollTop;
                                    // Determine if the direction of the dropdown needs to be changed.
                                    if (offset.top + offset.height + offsetDropdown.height > scrollTop + $document[0].documentElement.clientHeight) {
                                        dropdown[0].style.position = 'absolute';
                                        dropdown[0].style.top = (offsetDropdown.height * -1) + 'px';
                                        element.addClass(directionUpClassName);
                                    } else {
                                        //Go DOWN
                                        dropdown[0].style.position = '';
                                        dropdown[0].style.top = '';
                                    }

                                    // Display the dropdown once it has been positioned.
                                    dropdown[0].style.opacity = 1;
                                });
                            } else {
                                if (dropdown === null) {
                                    return;
                                }

                                // Reset the position of the dropdown.
                                dropdown[0].style.position = '';
                                dropdown[0].style.top = '';
                                element.removeClass(directionUpClassName);
                            }
                        };
                    };
                }
            };
        }])
    .directive('uixSelectChoices', ['uixSelectConfig', 'uixSelectRepeatParser', 'uixSelectMinErr', '$compile',
        function (uixSelectConfig, RepeatParser, uixSelectMinErr, $compile) {

            return {
                restrict: 'EA',
                require: '^uixSelect',
                replace: true,
                transclude: true,
                templateUrl: 'templates/choices.html',
                compile: function (tElement, tAttrs) {

                    if (!tAttrs.repeat) {
                        throw uixSelectMinErr('repeat', 'Expected \'repeat\' expression.');
                    }

                    return function link(scope, element, attrs, $select, transcludeFn) {

                        // var repeat = RepeatParser.parse(attrs.repeat);
                        var groupByExp = attrs.groupBy;
                        var groupFilterExp = attrs.groupFilter;

                        $select.parseRepeatAttr(attrs.repeat, groupByExp, groupFilterExp); //Result ready at $select.parserResult

                        $select.disableChoiceExpression = attrs.disableChoice;
                        $select.onHighlightCallback = attrs.onHighlight;

                        if (groupByExp) {
                            var groups = angular.element(element[0].querySelectorAll('.uix-select-choices-group'));
                            if (groups.length !== 1) {
                                throw uixSelectMinErr('rows', 'Expected 1 .uix-select-choices-group but got \'{0}\'.', groups.length);
                            }
                            groups.attr('ng-repeat', RepeatParser.getGroupNgRepeatExpression());
                        }

                        var choices = angular.element(element[0].querySelectorAll('.uix-select-choices-row'));
                        if (choices.length !== 1) {
                            throw uixSelectMinErr('rows', 'Expected 1 .uix-select-choices-row but got \'{0}\'.', choices.length);
                        }

                        choices.attr('ng-repeat', RepeatParser.getNgRepeatExpression($select.parserResult.itemName, '$select.items', $select.parserResult.trackByExp, groupByExp))
                            .attr('ng-if', '$select.open') //Prevent unnecessary watches when dropdown is closed
                            .attr('ng-mouseenter', '$select.setActiveItem(' + $select.parserResult.itemName + ')')
                            .attr('ng-click', '$select.select(' + $select.parserResult.itemName + ',false,$event)');

                        var rowsInner = angular.element(element[0].querySelectorAll('.uix-select-choices-row-inner'));
                        if (rowsInner.length !== 1) {
                            throw uixSelectMinErr('rows', 'Expected 1 .uix-select-choices-row-inner but got \'{0}\'.', rowsInner.length);
                        }
                        rowsInner.attr('uix-transclude-append', ''); //Adding uixTranscludeAppend directive to row element after choices element has ngRepeat
                        $compile(element, transcludeFn)(scope); //Passing current transcludeFn to be able to append elements correctly from uixTranscludeAppend

                        scope.$watch('$select.search', function (newValue) {
                            if (newValue && !$select.open && $select.multiple) {
                                $select.activate(false, true);
                            }
                            $select.activeIndex = $select.tagging.isActivated ? -1 : 0;
                            $select.refresh(attrs.refresh);
                        });

                        attrs.$observe('refreshDelay', function () {
                            // $eval() is needed otherwise we get a string instead of a number
                            var refreshDelay = scope.$eval(attrs.refreshDelay);
                            $select.refreshDelay = angular.isDefined(refreshDelay) ? refreshDelay : uixSelectConfig.refreshDelay;
                        });
                    };
                }
            };
        }])
    .directive('uixSelectMatch', ['uixSelectConfig', function (uixSelectConfig) {
        return {
            restrict: 'EA',
            require: '^uixSelect',
            replace: true,
            transclude: true,
            templateUrl: function (tElement) {
                var multi = tElement.parent().attr('multiple');
                return multi ? 'templates/match-multiple.html' : 'templates/match.html';
            },
            link: function (scope, element, attrs, $select) {
                $select.lockChoiceExpression = attrs.lockChoice;
                attrs.$observe('placeholder', function (placeholder) {
                    $select.placeholder = angular.isDefined(placeholder) ? placeholder : uixSelectConfig.placeholder;
                });

                function setAllowClear(allow) {
                    $select.allowClear = (angular.isDefined(allow)) ? (allow === '') ? true : (allow.toLowerCase() === 'true') : false;
                }

                attrs.$observe('allowClear', setAllowClear);
                setAllowClear(attrs.allowClear);

                if ($select.multiple) {
                    $select.sizeSearchInput();
                }

            }
        };
    }])
    .directive('uixSelectMultiple', ['uixSelectConfig', 'uixSelectMinErr', '$timeout',
        function (uixSelectConfig, uixSelectMinErr, $timeout) {
            return {
                restrict: 'EA',
                require: ['^uixSelect', '^ngModel'],

                controller: ['$scope', '$timeout', function ($scope, $timeout) {

                    var ctrl = this,
                        $select = $scope.$select,
                        ngModel;

                    //Wait for link fn to inject it
                    $scope.$evalAsync(function () {
                        ngModel = $scope.ngModel;
                    });

                    ctrl.activeMatchIndex = -1;

                    ctrl.updateModel = function () {
                        ngModel.$setViewValue(Date.now()); //Set timestamp as a unique string to force changes
                        ctrl.refreshComponent();
                    };

                    ctrl.refreshComponent = function () {
                        //Remove already selected items
                        //e.g. When user clicks on a selection, the selected array changes and
                        //the dropdown should remove that item
                        $select.refreshItems();
                        $select.sizeSearchInput();
                    };

                    // Remove item from multiple select
                    ctrl.removeChoice = function (index) {

                        var removedChoice = $select.selected[index];

                        // if the choice is locked, can't remove it
                        if (removedChoice._uixSelectChoiceLocked) {
                            return;
                        }

                        var locals = {};
                        locals[$select.parserResult.itemName] = removedChoice;

                        $select.selected.splice(index, 1);
                        ctrl.activeMatchIndex = -1;
                        $select.sizeSearchInput();

                        // Give some time for scope propagation.
                        $timeout(function () {
                            $select.onRemoveCallback($scope, {
                                $item: removedChoice,
                                $model: $select.parserResult.modelMapper($scope, locals)
                            });
                        });

                        ctrl.updateModel();

                    };

                    ctrl.getPlaceholder = function () {
                        //Refactor single?
                        if ($select.selected.length) {
                            return;
                        }
                        return $select.placeholder;
                    };


                }],
                controllerAs: '$selectMultiple',

                link: function (scope, element, attrs, ctrls) {

                    var $select = ctrls[0];
                    var ngModel = scope.ngModel = ctrls[1];
                    var $selectMultiple = scope.$selectMultiple;
                    var KEY = uixSelectConfig.KEY;
                    //$select.selected = raw selected objects (ignoring any property binding)

                    $select.multiple = true;
                    $select.removeSelected = true;

                    //Input that will handle focus
                    $select.focusInput = $select.searchInput;

                    //From view --> model
                    ngModel.$parsers.unshift(function () {
                        var locals = {},
                            result,
                            resultMultiple = [];
                        for (var j = $select.selected.length - 1; j >= 0; j--) {
                            locals = {};
                            locals[$select.parserResult.itemName] = $select.selected[j];
                            result = $select.parserResult.modelMapper(scope, locals);
                            resultMultiple.unshift(result);
                        }
                        return resultMultiple;
                    });

                    // From model --> view
                    ngModel.$formatters.unshift(function (inputValue) {
                        var data = $select.parserResult.source(scope, {$select: {search: ''}}), //Overwrite $search
                            locals = {},
                            result;
                        if (!data) {
                            return inputValue;
                        }
                        var resultMultiple = [];

                        function checkFnMultiple(list, value) {
                            if (!list || !list.length) {
                                return;
                            }
                            for (var index = list.length - 1; index >= 0; index--) {
                                locals[$select.parserResult.itemName] = list[index];
                                result = $select.parserResult.modelMapper(scope, locals);
                                if ($select.parserResult.trackByExp) {
                                    var matches = /\.(.+)/.exec($select.parserResult.trackByExp);
                                    if (matches.length > 0 && result[matches[1]] === value[matches[1]]) {
                                        resultMultiple.unshift(list[index]);
                                        return true;
                                    }
                                }
                                if (angular.equals(result, value)) {
                                    resultMultiple.unshift(list[index]);
                                    return true;
                                }
                            }
                            return false;
                        }

                        if (!inputValue) {
                            return resultMultiple;//If ngModel was undefined
                        }
                        for (var k = inputValue.length - 1; k >= 0; k--) {
                            //Check model array of currently selected items
                            if (!checkFnMultiple($select.selected, inputValue[k])) {
                                //Check model array of all items available
                                if (!checkFnMultiple(data, inputValue[k])) {
                                    //If not found on previous lists, just add it directly to resultMultiple
                                    resultMultiple.unshift(inputValue[k]);
                                }
                            }
                        }
                        return resultMultiple;
                    });

                    //Watch for external model changes
                    scope.$watchCollection(function () {
                        return ngModel.$modelValue;
                    }, function (newValue, oldValue) {
                        if (oldValue !== newValue) {
                            ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
                            $selectMultiple.refreshComponent();
                        }
                    });

                    ngModel.$render = function () {
                        // Make sure that model value is array
                        if (!angular.isArray(ngModel.$viewValue)) {
                            // Have tolerance for null or undefined values
                            if (angular.isUndefined(ngModel.$viewValue) || ngModel.$viewValue === null) {
                                $select.selected = [];
                            } else {
                                throw uixSelectMinErr('multiarr', 'Expected model value to be array but got \'{0}\'', ngModel.$viewValue);
                            }
                        }
                        $select.selected = ngModel.$viewValue;
                        scope.$evalAsync(); //To force $digest
                    };

                    scope.$on('uixSelect:select', function (event, item) {
                        $select.selected.push(item);
                        $selectMultiple.updateModel();
                    });

                    scope.$on('uixSelect:activate', function () {
                        $selectMultiple.activeMatchIndex = -1;
                    });

                    scope.$watch('$select.disabled', function (newValue, oldValue) {
                        // As the search input field may now become visible, it may be necessary to recompute its size
                        if (oldValue && !newValue) {
                            $select.sizeSearchInput();
                        }
                    });

                    $select.searchInput.on('keydown', function (evt) {
                        var key = evt.which;
                        scope.$apply(function () {
                            var processed = false;
                            // var tagged = false; //Checkme
                            if (KEY.isHorizontalMovement(key)) {
                                processed = _handleMatchSelection(key);
                            }
                            if (processed && key !== KEY.TAB) {
                                //TODO Check si el tab selecciona aun correctamente
                                //Crear test
                                evt.preventDefault();
                                evt.stopPropagation();
                            }
                        });
                    });
                    function _getCaretPosition(el) {
                        if (angular.isNumber(el.selectionStart)) {
                            return el.selectionStart;
                            // selectionStart is not supported in IE8 and we don't want hacky workarounds so we compromise
                        } else {
                            return el.value.length;
                        }

                    }

                    // Handles selected options in "multiple" mode
                    function _handleMatchSelection(key) {
                        var caretPosition = _getCaretPosition($select.searchInput[0]),
                            length = $select.selected.length,
                        // none  = -1,
                            first = 0,
                            last = length - 1,
                            curr = $selectMultiple.activeMatchIndex,
                            next = $selectMultiple.activeMatchIndex + 1,
                            prev = $selectMultiple.activeMatchIndex - 1,
                            newIndex = curr;

                        if (caretPosition > 0 || ($select.search.length && key === KEY.RIGHT)) {
                            return false;
                        }

                        $select.close();

                        function getNewActiveMatchIndex() {
                            var res;
                            switch (key) {
                                case KEY.LEFT:
                                    // Select previous/first item
                                    if ($selectMultiple.activeMatchIndex !== -1) {
                                        res = prev;
                                    } else {// Select last item
                                        res = last;
                                    }
                                    break;
                                case KEY.RIGHT:
                                    // Open drop-down
                                    if ($selectMultiple.activeMatchIndex === -1 || curr === last) {
                                        $select.activate();
                                        res = false;
                                    } else {// Select next/last item
                                        res = next;
                                    }
                                    break;
                                case KEY.BACKSPACE:
                                    // Remove selected item and select previous/first
                                    if ($selectMultiple.activeMatchIndex !== -1) {
                                        $selectMultiple.removeChoice(curr);
                                        res = prev;
                                    } else {
                                        res = last;// Select last item
                                    }
                                    break;
                                case KEY.DELETE:
                                    // Remove selected item and select next item
                                    if ($selectMultiple.activeMatchIndex !== -1) {
                                        $selectMultiple.removeChoice($selectMultiple.activeMatchIndex);
                                        res = curr;
                                    } else {
                                        res = false;
                                    }
                            }
                            return res;
                        }

                        newIndex = getNewActiveMatchIndex();

                        if (!$select.selected.length || newIndex === false) {
                            $selectMultiple.activeMatchIndex = -1;
                        } else {
                            $selectMultiple.activeMatchIndex = Math.min(last, Math.max(first, newIndex));
                        }

                        return true;
                    }

                    $select.searchInput.on('keyup', function (evt) {

                        if (!KEY.isVerticalMovement(evt.which)) {
                            scope.$evalAsync(function () {
                                $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
                            });
                        }
                        // Push a "create new" item into array if there is a search string
                        if ($select.tagging.isActivated && $select.search.length > 0) {

                            // return early with these keys
                            if (evt.which === KEY.TAB || KEY.isControl(evt) || KEY.isFunctionKey(evt) || evt.which === KEY.ESC || KEY.isVerticalMovement(evt.which)) {
                                return;
                            }
                            // always reset the activeIndex to the first item when tagging
                            $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
                            // taggingLabel === false bypasses all of this
                            if ($select.taggingLabel === false) {
                                return;
                            }

                            var items = angular.copy($select.items);
                            var stashArr = angular.copy($select.items);
                            var newItem;
                            var item;
                            var hasTag = false;
                            var dupeIndex = -1;
                            var tagItems;
                            var tagItem;

                            // case for object tagging via transform `$select.tagging.fct` function
                            if ($select.tagging.fct !== null || angular.isDefined($select.tagging.fct)) {
                                tagItems = $select.$filter('filter')(items, {'isTag': true});
                                if (tagItems.length > 0) {
                                    tagItem = tagItems[0];
                                }
                                // remove the first element, if it has the `isTag` prop we generate a new one with each keyup, shaving the previous
                                if (items.length > 0 && tagItem) {
                                    hasTag = true;
                                    items = items.slice(1, items.length);
                                    stashArr = stashArr.slice(1, stashArr.length);
                                }
                                newItem = $select.tagging.fct($select.search);
                                newItem.isTag = true;
                                // verify the the tag doesn't match the value of an existing item
                                var len = stashArr.filter(function (origItem) {
                                    return angular.equals(origItem, $select.tagging.fct($select.search));
                                }).length;
                                if (len > 0) {
                                    return;
                                }
                                newItem.isTag = true;
                                // handle newItem string and stripping dupes in tagging string context
                            } else {
                                // find any tagging items already in the $select.items array and store them
                                tagItems = $select.$filter('filter')(items, function (item) {
                                    return item.match($select.taggingLabel);
                                });
                                if (tagItems.length > 0) {
                                    tagItem = tagItems[0];
                                }
                                item = items[0];
                                // remove existing tag item if found (should only ever be one tag item)
                                if (item && items.length > 0 && tagItem) {
                                    hasTag = true;
                                    items = items.slice(1, items.length);
                                    stashArr = stashArr.slice(1, stashArr.length);
                                }
                                newItem = $select.search + ' ' + $select.taggingLabel;
                                if (_findApproxDupe($select.selected, $select.search) > -1) {
                                    return;
                                }
                                // verify the the tag doesn't match the value of an existing item from
                                // the searched data set or the items already selected
                                if (_findCaseInsensitiveDupe(stashArr.concat($select.selected))) {
                                    // if there is a tag from prev iteration, strip it / queue the change
                                    // and return early
                                    if (hasTag) {
                                        items = stashArr;
                                        scope.$evalAsync(function () {
                                            $select.activeIndex = 0;
                                            $select.items = items;
                                        });
                                    }
                                    return;
                                }
                                if (_findCaseInsensitiveDupe(stashArr)) {
                                    // if there is a tag from prev iteration, strip it
                                    if (hasTag) {
                                        $select.items = stashArr.slice(1, stashArr.length);
                                    }
                                    return;
                                }
                            }
                            if (hasTag) {
                                dupeIndex = _findApproxDupe($select.selected, newItem);
                            }
                            // dupe found, shave the first item
                            if (dupeIndex > -1) {
                                items = items.slice(dupeIndex + 1, items.length - 1);
                            } else {
                                items = [];
                                items.push(newItem);
                                items = items.concat(stashArr);
                            }
                            scope.$evalAsync(function () {
                                $select.activeIndex = 0;
                                $select.items = items;
                            });
                        }
                    });
                    function _findCaseInsensitiveDupe(arr) {
                        if (angular.isUndefined(arr) || arr === null || angular.isUndefined($select.search) || $select.search === null) {
                            return false;
                        }
                        return arr.filter(function (origItem) {
                            if (angular.isUndefined($select.search.toUpperCase()) || angular.isUndefined(origItem)) {
                                return false;
                            }
                            return origItem.toUpperCase() === $select.search.toUpperCase();
                        }).length > 0;
                    }

                    function _findApproxDupe(haystack, needle) {
                        var dupeIndex = -1;
                        if (angular.isArray(haystack)) {
                            var tempArr = angular.copy(haystack);
                            for (var i = 0; i < tempArr.length; i++) {
                                // handle the simple string version of tagging
                                // search the array for the match
                                if (($select.tagging.fct === null || angular.isUndefined($select.tagging.fct)) && tempArr[i] + ' ' + $select.taggingLabel === needle) {
                                    dupeIndex = i;
                                    // handle the object tagging implementation
                                } else {
                                    var mockObj = tempArr[i];
                                    mockObj.isTag = true;
                                    if (angular.equals(mockObj, needle)) {
                                        dupeIndex = i;
                                    }
                                }
                            }
                        }
                        return dupeIndex;
                    }

                    $select.searchInput.on('blur', function () {
                        $timeout(function () {
                            $selectMultiple.activeMatchIndex = -1;
                        });
                    });

                }
            };
        }])
    .directive('uixSelectSingle', ['uixSelectConfig', '$timeout', '$compile', function (uixSelectConfig, $timeout, $compile) {
        return {
            restrict: 'EA',
            require: ['^uixSelect', '^ngModel'],
            link: function (scope, element, attrs, ctrls) {
                var KEY = uixSelectConfig.KEY;
                var $select = ctrls[0];
                var ngModel = ctrls[1];

                //From view --> model
                ngModel.$parsers.unshift(function (inputValue) {
                    var locals = {},
                        result;
                    locals[$select.parserResult.itemName] = inputValue;
                    result = $select.parserResult.modelMapper(scope, locals);
                    return result;
                });

                //From model --> view
                ngModel.$formatters.unshift(function (inputValue) {
                    var data = $select.parserResult.source(scope, {$select: {search: ''}}), //Overwrite $search
                        locals = {},
                        result;
                    if (data) {
                        var checkFnSingle = function (d) {
                            locals[$select.parserResult.itemName] = d;
                            result = $select.parserResult.modelMapper(scope, locals);
                            return result === inputValue;
                        };
                        //If possible pass same object stored in $select.selected
                        if ($select.selected && checkFnSingle($select.selected)) {
                            return $select.selected;
                        }
                        for (var i = data.length - 1; i >= 0; i--) {
                            if (checkFnSingle(data[i])) {
                                return data[i];
                            }
                        }
                    }
                    return inputValue;
                });

                //Update viewValue if model change
                scope.$watch('$select.selected', function (newValue) {
                    if (ngModel.$viewValue !== newValue) {
                        ngModel.$setViewValue(newValue);
                    }
                });

                ngModel.$render = function () {
                    $select.selected = ngModel.$viewValue;
                };

                scope.$on('uixSelect:select', function (event, item) {
                    $select.selected = item;
                });

                scope.$on('uixSelect:close', function (event, skipFocusser) {
                    $timeout(function () {
                        $select.focusser.prop('disabled', false);
                        if (!skipFocusser) {
                            $select.focusser[0].focus();
                        }
                    }, 0, false);
                });

                var focusser = angular.element(
                    '<input ng-disabled=\'$select.disabled\' class=\'uix-select-focusser uix-select-offscreen\' ' +
                    'type=\'text\' aria-label=\'{{ $select.focusserTitle }}\' aria-haspopup=\'true\' ' +
                    'role=\'button\' />'
                );

                scope.$on('uixSelect:activate', function () {
                    focusser.prop('disabled', true); //Will reactivate it on .close()
                });

                $compile(focusser)(scope);
                $select.focusser = focusser;

                //Input that will handle focus
                $select.focusInput = focusser;

                element.parent().append(focusser);
                focusser.bind('focus', function () {
                    scope.$evalAsync(function () {
                        $select.focus = true;
                    });
                });
                focusser.bind('blur', function () {
                    scope.$evalAsync(function () {
                        $select.focus = false;
                    });
                });
                focusser.bind('keydown', function (evt) {

                    if (evt.which === KEY.BACKSPACE) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        $select.select();
                        scope.$apply();
                        return;
                    }

                    if (evt.which === KEY.TAB || KEY.isControl(evt) || KEY.isFunctionKey(evt) || evt.which === KEY.ESC) {
                        return;
                    }

                    if (evt.which === KEY.DOWN || evt.which === KEY.UP || evt.which === KEY.ENTER || evt.which === KEY.SPACE) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        $select.activate();
                    }

                    scope.$digest();
                });

                focusser.bind('keyup input', function (evt) {

                    if (evt.which === KEY.TAB || KEY.isControl(evt) || KEY.isFunctionKey(evt) || evt.which === KEY.ESC || evt.which === KEY.ENTER || evt.which === KEY.BACKSPACE) {
                        return;
                    }

                    $select.activate(focusser.val()); //User pressed some regular key, so we pass it to the search input
                    focusser.val('');
                    scope.$digest();

                });


            }
        };
    }])
    .directive('uixSelectSort', ['$timeout', 'uixSelectMinErr', function ($timeout, uixSelectMinErr) {
        return {
            require: '^uixSelect',
            link: function (scope, element, attrs, $select) {
                if (scope[attrs.uixSelectSort] === null) {
                    throw uixSelectMinErr('sort', 'Expected a list to sort');
                }

                var options = angular.extend({
                    axis: 'horizontal'
                }, scope.$eval(attrs.uixSelectSortOptions));

                var axis = options.axis,
                    draggingClassName = 'dragging',
                    droppingClassName = 'dropping',
                    droppingBeforeClassName = 'dropping-before',
                    droppingAfterClassName = 'dropping-after';

                scope.$watch(function () {
                    return $select.sortable;
                }, function (val) {
                    if (val) {
                        element.attr('draggable', true);
                    } else {
                        element.removeAttr('draggable');
                    }
                });

                element.on('dragstart', function (evt) {
                    element.addClass(draggingClassName);

                    (evt.dataTransfer || evt.originalEvent.dataTransfer).setData('text/plain', scope.$index);
                });

                element.on('dragend', function () {
                    element.removeClass(draggingClassName);
                });

                var move = function (from, to) {
                    /*jshint validthis: true */
                    this.splice(to, 0, this.splice(from, 1)[0]);
                };

                var dragOverHandler = function (evt) {
                    evt.preventDefault();

                    var offset = axis === 'vertical'
                        ? evt.offsetY || evt.layerY || (evt.originalEvent ? evt.originalEvent.offsetY : 0)
                        : evt.offsetX || evt.layerX || (evt.originalEvent ? evt.originalEvent.offsetX : 0);

                    if (offset < (this[axis === 'vertical' ? 'offsetHeight' : 'offsetWidth'] / 2)) {
                        element.removeClass(droppingAfterClassName);
                        element.addClass(droppingBeforeClassName);

                    } else {
                        element.removeClass(droppingBeforeClassName);
                        element.addClass(droppingAfterClassName);
                    }
                };

                var dropTimeout;

                var dropHandler = function (evt) {
                    evt.preventDefault();

                    var droppedItemIndex = parseInt((evt.dataTransfer || evt.originalEvent.dataTransfer).getData('text/plain'), 10);

                    // prevent event firing multiple times in firefox
                    $timeout.cancel(dropTimeout);
                    dropTimeout = $timeout(function () {
                        _dropHandler(droppedItemIndex);
                    }, 20);
                };

                function _dropHandler(droppedItemIndex) {
                    var theList = scope.$eval(attrs.uixSelectSort),
                        itemToMove = theList[droppedItemIndex],
                        newIndex = null;

                    if (element.hasClass(droppingBeforeClassName)) {
                        if (droppedItemIndex < scope.$index) {
                            newIndex = scope.$index - 1;
                        } else {
                            newIndex = scope.$index;
                        }
                    } else if (droppedItemIndex < scope.$index) {
                        newIndex = scope.$index;
                    } else {
                        newIndex = scope.$index + 1;
                    }

                    move.apply(theList, [droppedItemIndex, newIndex]);

                    scope.$apply(function () {
                        scope.$emit('uixSelectSort:change', {
                            array: theList,
                            item: itemToMove,
                            from: droppedItemIndex,
                            to: newIndex
                        });
                    });

                    element.removeClass(droppingClassName);
                    element.removeClass(droppingBeforeClassName);
                    element.removeClass(droppingAfterClassName);

                    element.off('drop', dropHandler);
                }

                element.on('dragenter', function () {
                    if (element.hasClass(draggingClassName)) {
                        return;
                    }

                    element.addClass(droppingClassName);

                    element.on('dragover', dragOverHandler);
                    element.on('drop', dropHandler);
                });

                element.on('dragleave', function (evt) {
                    if (evt.target !== element) {
                        return;
                    }
                    element.removeClass(droppingClassName);
                    element.removeClass(droppingBeforeClassName);
                    element.removeClass(droppingAfterClassName);

                    element.off('dragover', dragOverHandler);
                    element.off('drop', dropHandler);
                });
            }
        };
    }])
    .service('uixSelectRepeatParser', ['uixSelectMinErr', '$parse', function (uixSelectMinErr, $parse) {
        var self = this;

        /**
         * Example:
         * expression = "address in addresses | filter: {street: $select.search} track by $index"
         * itemName = "address",
         * source = "addresses | filter: {street: $select.search}",
         * trackByExp = "$index",
         */
        self.parse = function (expression) {

            var match = expression.match(/^\s*(?:([\s\S]+?)\s+as\s+)?([\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

            if (!match) {
                throw uixSelectMinErr('iexp', 'Expected expression in form of \'_item_ in _collection_[ track by _id_]\' but got \'{0}\'.',
                    expression);
            }

            return {
                itemName: match[2], // (lhs) Left-hand side,
                source: $parse(match[3]),
                trackByExp: match[4],
                modelMapper: $parse(match[1] || match[2])
            };

        };

        self.getGroupNgRepeatExpression = function () {
            return '$group in $select.groups';
        };

        self.getNgRepeatExpression = function (itemName, source, trackByExp, grouped) {
            var expression = itemName + ' in ' + (grouped ? '$group.items' : source);
            if (trackByExp) {
                expression += ' track by ' + trackByExp;
            }
            return expression;
        };
    }]);
