/* eslint-disable wrap-iife */
/* eslint-disable angular/di-unused */
/**
 * 数据表格 - datatable
 * 数据表格指令
 * 主要用于展示大量结构化数据。
 * 支持排序、固定列、固定表头、分页、自定义操作、单选多选等复杂功能。
 *
 * Author: yjy972080142@gmail.com
 * Date:2019-08-13
 */
(function () {
    (function (global, factory) {
        global.ResizeObserver = factory();
    }(window, (function () {
        'use strict';

        /**
         * A collection of shims that provide minimal functionality of the ES6 collections.
         *
         * These implementations are not meant to be used outside of the ResizeObserver
         * modules as they cover only a limited range of use cases.
         */
        /* eslint-disable require-jsdoc, valid-jsdoc */
        var MapShim = (function () {
            if (typeof Map !== 'undefined') {
                return Map;
            }

            /**
             * Returns index in provided array that matches the specified key.
             *
             * @param {Array<Array>} arr
             * @param {*} key
             * @returns {number}
             */
            function getIndex(arr, key) {
                var result = -1;

                arr.some(function (entry, index) {
                    if (entry[0] === key) {
                        result = index;

                        return true;
                    }

                    return false;
                });

                return result;
            }

            return (function () {
                function anonymous() {
                    this.__entries__ = [];
                }

                var prototypeAccessors = { size: { configurable: true } };

                /**
                 * @returns {boolean}
                 */
                prototypeAccessors.size.get = function () {
                    return this.__entries__.length;
                };

                /**
                 * @param {*} key
                 * @returns {*}
                 */
                anonymous.prototype.get = function (key) {
                    var index = getIndex(this.__entries__, key);
                    var entry = this.__entries__[index];

                    return entry && entry[1];
                };

                /**
                 * @param {*} key
                 * @param {*} value
                 * @returns {void}
                 */
                anonymous.prototype.set = function (key, value) {
                    var index = getIndex(this.__entries__, key);

                    if (~index) {
                        this.__entries__[index][1] = value;
                    } else {
                        this.__entries__.push([key, value]);
                    }
                };

                /**
                 * @param {*} key
                 * @returns {void}
                 */
                anonymous.prototype.delete = function (key) {
                    var entries = this.__entries__;
                    var index = getIndex(entries, key);

                    if (~index) {
                        entries.splice(index, 1);
                    }
                };

                /**
                 * @param {*} key
                 * @returns {void}
                 */
                anonymous.prototype.has = function (key) {
                    return !!~getIndex(this.__entries__, key);
                };

                /**
                 * @returns {void}
                 */
                anonymous.prototype.clear = function () {
                    this.__entries__.splice(0);
                };

                /**
                 * @param {Function} callback
                 * @param {*} [ctx=null]
                 * @returns {void}
                 */
                anonymous.prototype.forEach = function (callback, ctx) {
                    var this$1 = this;
                    if (ctx === void 0) ctx = null;

                    for (var i = 0, list = this$1.__entries__; i < list.length; i += 1) {
                        var entry = list[i];

                        callback.call(ctx, entry[1], entry[0]);
                    }
                };

                Object.defineProperties(anonymous.prototype, prototypeAccessors);

                return anonymous;
            }());
        })();

        /**
         * Detects whether window and document objects are available in current environment.
         */
        var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

        // Returns global object of a current environment.
        var global$1 = (function () {
            if (typeof global !== 'undefined' && global.Math === Math) {
                return global;
            }

            if (typeof self !== 'undefined' && self.Math === Math) {
                return self;
            }

            if (typeof window !== 'undefined' && window.Math === Math) {
                return window;
            }

            // eslint-disable-next-line no-new-func
            return Function('return this')();
        })();

        /**
         * A shim for the requestAnimationFrame which falls back to the setTimeout if
         * first one is not supported.
         *
         * @returns {number} Requests' identifier.
         */
        var requestAnimationFrame$1 = (function () {
            if (typeof requestAnimationFrame === 'function') {
                // It's required to use a bounded function because IE sometimes throws
                // an "Invalid calling object" error if rAF is invoked without the global
                // object on the left hand side.
                return requestAnimationFrame.bind(global$1);
            }

            return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
        })();

        // Defines minimum timeout before adding a trailing call.
        var trailingTimeout = 2;

        /**
         * Creates a wrapper function which ensures that provided callback will be
         * invoked only once during the specified delay period.
         *
         * @param {Function} callback - Function to be invoked after the delay period.
         * @param {number} delay - Delay after which to invoke callback.
         * @returns {Function}
         */
        var throttle = function (callback, delay) {
            var leadingCall = false,
                trailingCall = false,
                lastCallTime = 0;

            /**
             * Invokes the original callback function and schedules new invocation if
             * the "proxy" was called during current request.
             *
             * @returns {void}
             */
            function resolvePending() {
                if (leadingCall) {
                    leadingCall = false;

                    callback();
                }

                if (trailingCall) {
                    proxy();
                }
            }

            /**
             * Callback invoked after the specified delay. It will further postpone
             * invocation of the original function delegating it to the
             * requestAnimationFrame.
             *
             * @returns {void}
             */
            function timeoutCallback() {
                requestAnimationFrame$1(resolvePending);
            }

            /**
             * Schedules invocation of the original function.
             *
             * @returns {void}
             */
            function proxy() {
                var timeStamp = Date.now();

                if (leadingCall) {
                    // Reject immediately following calls.
                    if (timeStamp - lastCallTime < trailingTimeout) {
                        return;
                    }

                    // Schedule new call to be in invoked when the pending one is resolved.
                    // This is important for "transitions" which never actually start
                    // immediately so there is a chance that we might miss one if change
                    // happens amids the pending invocation.
                    trailingCall = true;
                } else {
                    leadingCall = true;
                    trailingCall = false;

                    setTimeout(timeoutCallback, delay);
                }

                lastCallTime = timeStamp;
            }

            return proxy;
        };

        // Minimum delay before invoking the update of observers.
        var REFRESH_DELAY = 20;

        // A list of substrings of CSS properties used to find transition events that
        // might affect dimensions of observed elements.
        var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];

        // Check if MutationObserver is available.
        var mutationObserverSupported = typeof MutationObserver !== 'undefined';

        /**
         * Singleton controller class which handles updates of ResizeObserver instances.
         */
        var ResizeObserverController = function () {
            this.connected_ = false;
            this.mutationEventsAdded_ = false;
            this.mutationsObserver_ = null;
            this.observers_ = [];

            this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
            this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
        };

        /**
         * Adds observer to observers list.
         *
         * @param {ResizeObserverSPI} observer - Observer to be added.
         * @returns {void}
         */


        /**
         * Holds reference to the controller's instance.
         *
         * @private {ResizeObserverController}
         */


        /**
         * Keeps reference to the instance of MutationObserver.
         *
         * @private {MutationObserver}
         */

        /**
         * Indicates whether DOM listeners have been added.
         *
         * @private {boolean}
         */
        ResizeObserverController.prototype.addObserver = function (observer) {
            if (!~this.observers_.indexOf(observer)) {
                this.observers_.push(observer);
            }

            // Add listeners if they haven't been added yet.
            if (!this.connected_) {
                this.connect_();
            }
        };

        /**
         * Removes observer from observers list.
         *
         * @param {ResizeObserverSPI} observer - Observer to be removed.
         * @returns {void}
         */
        ResizeObserverController.prototype.removeObserver = function (observer) {
            var observers = this.observers_;
            var index = observers.indexOf(observer);

            // Remove observer if it's present in registry.
            if (~index) {
                observers.splice(index, 1);
            }

            // Remove listeners if controller has no connected observers.
            if (!observers.length && this.connected_) {
                this.disconnect_();
            }
        };

        /**
         * Invokes the update of observers. It will continue running updates insofar
         * it detects changes.
         *
         * @returns {void}
         */
        ResizeObserverController.prototype.refresh = function () {
            var changesDetected = this.updateObservers_();

            // Continue running updates if changes have been detected as there might
            // be future ones caused by CSS transitions.
            if (changesDetected) {
                this.refresh();
            }
        };

        /**
         * Updates every observer from observers list and notifies them of queued
         * entries.
         *
         * @private
         * @returns {boolean} Returns "true" if any observer has detected changes in
         *  dimensions of it's elements.
         */
        ResizeObserverController.prototype.updateObservers_ = function () {
            // Collect observers that have active observations.
            var activeObservers = this.observers_.filter(function (observer) {
                return observer.gatherActive(), observer.hasActive();
            });

            // Deliver notifications in a separate cycle in order to avoid any
            // collisions between observers, e.g. when multiple instances of
            // ResizeObserver are tracking the same element and the callback of one
            // of them changes content dimensions of the observed target. Sometimes
            // this may result in notifications being blocked for the rest of observers.
            activeObservers.forEach(function (observer) { return observer.broadcastActive(); });

            return activeObservers.length > 0;
        };

        /**
         * Initializes DOM listeners.
         *
         * @private
         * @returns {void}
         */
        ResizeObserverController.prototype.connect_ = function () {
            // Do nothing if running in a non-browser environment or if listeners
            // have been already added.
            if (!isBrowser || this.connected_) {
                return;
            }

            // Subscription to the "Transitionend" event is used as a workaround for
            // delayed transitions. This way it's possible to capture at least the
            // final state of an element.
            document.addEventListener('transitionend', this.onTransitionEnd_);

            window.addEventListener('resize', this.refresh);

            if (mutationObserverSupported) {
                this.mutationsObserver_ = new MutationObserver(this.refresh);

                this.mutationsObserver_.observe(document, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                });
            } else {
                document.addEventListener('DOMSubtreeModified', this.refresh);

                this.mutationEventsAdded_ = true;
            }

            this.connected_ = true;
        };

        /**
         * Removes DOM listeners.
         *
         * @private
         * @returns {void}
         */
        ResizeObserverController.prototype.disconnect_ = function () {
            // Do nothing if running in a non-browser environment or if listeners
            // have been already removed.
            if (!isBrowser || !this.connected_) {
                return;
            }

            document.removeEventListener('transitionend', this.onTransitionEnd_);
            window.removeEventListener('resize', this.refresh);

            if (this.mutationsObserver_) {
                this.mutationsObserver_.disconnect();
            }

            if (this.mutationEventsAdded_) {
                document.removeEventListener('DOMSubtreeModified', this.refresh);
            }

            this.mutationsObserver_ = null;
            this.mutationEventsAdded_ = false;
            this.connected_ = false;
        };

        /**
         * "Transitionend" event handler.
         *
         * @private
         * @param {TransitionEvent} event
         * @returns {void}
         */
        ResizeObserverController.prototype.onTransitionEnd_ = function (ref) {
            var propertyName = ref.propertyName; if (propertyName === void 0) propertyName = '';

            // Detect whether transition may affect dimensions of an element.
            var isReflowProperty = transitionKeys.some(function (key) {
                return !!~propertyName.indexOf(key);
            });

            if (isReflowProperty) {
                this.refresh();
            }
        };

        /**
         * Returns instance of the ResizeObserverController.
         *
         * @returns {ResizeObserverController}
         */
        ResizeObserverController.getInstance = function () {
            if (!this.instance_) {
                this.instance_ = new ResizeObserverController();
            }

            return this.instance_;
        };

        ResizeObserverController.instance_ = null;

        /**
         * Defines non-writable/enumerable properties of the provided target object.
         *
         * @param {Object} target - Object for which to define properties.
         * @param {Object} props - Properties to be defined.
         * @returns {Object} Target object.
         */
        var defineConfigurable = (function (target, props) {
            for (var i = 0, list = Object.keys(props); i < list.length; i += 1) {
                var key = list[i];

                Object.defineProperty(target, key, {
                    value: props[key],
                    enumerable: false,
                    writable: false,
                    configurable: true
                });
            }

            return target;
        });

        /**
         * Returns the global object associated with provided element.
         *
         * @param {Object} target
         * @returns {Object}
         */
        var getWindowOf = (function (target) {
            // Assume that the element is an instance of Node, which means that it
            // has the "ownerDocument" property from which we can retrieve a
            // corresponding global object.
            var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;

            // Return the local global object if it's not possible extract one from
            // provided element.
            return ownerGlobal || global$1;
        });

        // Placeholder of an empty content rectangle.
        var emptyRect = createRectInit(0, 0, 0, 0);

        /**
         * Converts provided string to a number.
         *
         * @param {number|string} value
         * @returns {number}
         */
        function toFloat(value) {
            return parseFloat(value) || 0;
        }

        /**
         * Extracts borders size from provided styles.
         *
         * @param {CSSStyleDeclaration} styles
         * @param {...string} positions - Borders positions (top, right, ...)
         * @returns {number}
         */
        function getBordersSize(styles) {
            var positions = [], len = arguments.length - 1;
            while (len-- > 0) positions[len] = arguments[len + 1];

            return positions.reduce(function (size, position) {
                var value = styles['border-' + position + '-width'];

                return size + toFloat(value);
            }, 0);
        }

        /**
         * Extracts paddings sizes from provided styles.
         *
         * @param {CSSStyleDeclaration} styles
         * @returns {Object} Paddings box.
         */
        function getPaddings(styles) {
            var positions = ['top', 'right', 'bottom', 'left'];
            var paddings = {};

            for (var i = 0, list = positions; i < list.length; i += 1) {
                var position = list[i];

                var value = styles['padding-' + position];

                paddings[position] = toFloat(value);
            }

            return paddings;
        }

        /**
         * Calculates content rectangle of provided SVG element.
         *
         * @param {SVGGraphicsElement} target - Element content rectangle of which needs
         *      to be calculated.
         * @returns {DOMRectInit}
         */
        function getSVGContentRect(target) {
            var bbox = target.getBBox();

            return createRectInit(0, 0, bbox.width, bbox.height);
        }

        /**
         * Calculates content rectangle of provided HTMLElement.
         *
         * @param {HTMLElement} target - Element for which to calculate the content rectangle.
         * @returns {DOMRectInit}
         */
        function getHTMLElementContentRect(target) {
            // Client width & height properties can't be
            // used exclusively as they provide rounded values.
            var clientWidth = target.clientWidth;
            var clientHeight = target.clientHeight;

            // By this condition we can catch all non-replaced inline, hidden and
            // detached elements. Though elements with width & height properties less
            // than 0.5 will be discarded as well.
            //
            // Without it we would need to implement separate methods for each of
            // those cases and it's not possible to perform a precise and performance
            // effective test for hidden elements. E.g. even jQuery's ':visible' filter
            // gives wrong results for elements with width & height less than 0.5.
            if (!clientWidth && !clientHeight) {
                return emptyRect;
            }

            var styles = getWindowOf(target).getComputedStyle(target);
            var paddings = getPaddings(styles);
            var horizPad = paddings.left + paddings.right;
            var vertPad = paddings.top + paddings.bottom;

            // Computed styles of width & height are being used because they are the
            // only dimensions available to JS that contain non-rounded values. It could
            // be possible to utilize the getBoundingClientRect if only it's data wasn't
            // affected by CSS transformations let alone paddings, borders and scroll bars.
            var width = toFloat(styles.width),
                height = toFloat(styles.height);

            // Width & height include paddings and borders when the 'border-box' box
            // model is applied (except for IE).
            if (styles.boxSizing === 'border-box') {
                // Following conditions are required to handle Internet Explorer which
                // doesn't include paddings and borders to computed CSS dimensions.
                //
                // We can say that if CSS dimensions + paddings are equal to the "client"
                // properties then it's either IE, and thus we don't need to subtract
                // anything, or an element merely doesn't have paddings/borders styles.
                if (Math.round(width + horizPad) !== clientWidth) {
                    width -= getBordersSize(styles, 'left', 'right') + horizPad;
                }

                if (Math.round(height + vertPad) !== clientHeight) {
                    height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
                }
            }

            // Following steps can't be applied to the document's root element as its
            // client[Width/Height] properties represent viewport area of the window.
            // Besides, it's as well not necessary as the <html> itself neither has
            // rendered scroll bars nor it can be clipped.
            if (!isDocumentElement(target)) {
                // In some browsers (only in Firefox, actually) CSS width & height
                // include scroll bars size which can be removed at this step as scroll
                // bars are the only difference between rounded dimensions + paddings
                // and "client" properties, though that is not always true in Chrome.
                var vertScrollbar = Math.round(width + horizPad) - clientWidth;
                var horizScrollbar = Math.round(height + vertPad) - clientHeight;

                // Chrome has a rather weird rounding of "client" properties.
                // E.g. for an element with content width of 314.2px it sometimes gives
                // the client width of 315px and for the width of 314.7px it may give
                // 314px. And it doesn't happen all the time. So just ignore this delta
                // as a non-relevant.
                if (Math.abs(vertScrollbar) !== 1) {
                    width -= vertScrollbar;
                }

                if (Math.abs(horizScrollbar) !== 1) {
                    height -= horizScrollbar;
                }
            }

            return createRectInit(paddings.left, paddings.top, width, height);
        }

        /**
         * Checks whether provided element is an instance of the SVGGraphicsElement.
         *
         * @param {Element} target - Element to be checked.
         * @returns {boolean}
         */
        var isSVGGraphicsElement = (function () {
            // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
            // interface.
            if (typeof SVGGraphicsElement !== 'undefined') {
                return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
            }

            // If it's so, then check that element is at least an instance of the
            // SVGElement and that it has the "getBBox" method.
            // eslint-disable-next-line no-extra-parens
            return function (target) { return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === 'function'; };
        })();

        /**
         * Checks whether provided element is a document element (<html>).
         *
         * @param {Element} target - Element to be checked.
         * @returns {boolean}
         */
        function isDocumentElement(target) {
            return target === getWindowOf(target).document.documentElement;
        }

        /**
         * Calculates an appropriate content rectangle for provided html or svg element.
         *
         * @param {Element} target - Element content rectangle of which needs to be calculated.
         * @returns {DOMRectInit}
         */
        function getContentRect(target) {
            if (!isBrowser) {
                return emptyRect;
            }

            if (isSVGGraphicsElement(target)) {
                return getSVGContentRect(target);
            }

            return getHTMLElementContentRect(target);
        }

        /**
         * Creates rectangle with an interface of the DOMRectReadOnly.
         * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
         *
         * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
         * @returns {DOMRectReadOnly}
         */
        function createReadOnlyRect(ref) {
            var x = ref.x;
            var y = ref.y;
            var width = ref.width;
            var height = ref.height;

            // If DOMRectReadOnly is available use it as a prototype for the rectangle.
            var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
            var rect = Object.create(Constr.prototype);

            // Rectangle's properties are not writable and non-enumerable.
            defineConfigurable(rect, {
                x: x, y: y, width: width, height: height,
                top: y,
                right: x + width,
                bottom: height + y,
                left: x
            });

            return rect;
        }

        /**
         * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
         * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
         *
         * @param {number} x - X coordinate.
         * @param {number} y - Y coordinate.
         * @param {number} width - Rectangle's width.
         * @param {number} height - Rectangle's height.
         * @returns {DOMRectInit}
         */
        function createRectInit(x, y, width, height) {
            return { x: x, y: y, width: width, height: height };
        }

        /**
         * Class that is responsible for computations of the content rectangle of
         * provided DOM element and for keeping track of it's changes.
         */
        var ResizeObservation = function (target) {
            this.broadcastWidth = 0;
            this.broadcastHeight = 0;
            this.contentRect_ = createRectInit(0, 0, 0, 0);

            this.target = target;
        };

        /**
         * Updates content rectangle and tells whether it's width or height properties
         * have changed since the last broadcast.
         *
         * @returns {boolean}
         */


        /**
         * Reference to the last observed content rectangle.
         *
         * @private {DOMRectInit}
         */


        /**
         * Broadcasted width of content rectangle.
         *
         * @type {number}
         */
        ResizeObservation.prototype.isActive = function () {
            var rect = getContentRect(this.target);

            this.contentRect_ = rect;

            return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
        };

        /**
         * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
         * from the corresponding properties of the last observed content rectangle.
         *
         * @returns {DOMRectInit} Last observed content rectangle.
         */
        ResizeObservation.prototype.broadcastRect = function () {
            var rect = this.contentRect_;

            this.broadcastWidth = rect.width;
            this.broadcastHeight = rect.height;

            return rect;
        };

        var ResizeObserverEntry = function (target, rectInit) {
            var contentRect = createReadOnlyRect(rectInit);

            // According to the specification following properties are not writable
            // and are also not enumerable in the native implementation.
            //
            // Property accessors are not being used as they'd require to define a
            // private WeakMap storage which may cause memory leaks in browsers that
            // don't support this type of collections.
            defineConfigurable(this, { target: target, contentRect: contentRect });
        };

        var ResizeObserverSPI = function (callback, controller, callbackCtx) {
            this.activeObservations_ = [];
            this.observations_ = new MapShim();

            if (typeof callback !== 'function') {
                throw new TypeError('The callback provided as parameter 1 is not a function.');
            }

            this.callback_ = callback;
            this.controller_ = controller;
            this.callbackCtx_ = callbackCtx;
        };

        /**
         * Starts observing provided element.
         *
         * @param {Element} target - Element to be observed.
         * @returns {void}
         */


        /**
         * Registry of the ResizeObservation instances.
         *
         * @private {Map<Element, ResizeObservation>}
         */


        /**
         * Public ResizeObserver instance which will be passed to the callback
         * function and used as a value of it's "this" binding.
         *
         * @private {ResizeObserver}
         */

        /**
         * Collection of resize observations that have detected changes in dimensions
         * of elements.
         *
         * @private {Array<ResizeObservation>}
         */
        ResizeObserverSPI.prototype.observe = function (target) {
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }

            // Do nothing if current environment doesn't have the Element interface.
            if (typeof Element === 'undefined' || !(Element instanceof Object)) {
                return;
            }

            if (!(target instanceof getWindowOf(target).Element)) {
                throw new TypeError('parameter 1 is not of type "Element".');
            }

            var observations = this.observations_;

            // Do nothing if element is already being observed.
            if (observations.has(target)) {
                return;
            }

            observations.set(target, new ResizeObservation(target));

            this.controller_.addObserver(this);

            // Force the update of observations.
            this.controller_.refresh();
        };

        /**
         * Stops observing provided element.
         *
         * @param {Element} target - Element to stop observing.
         * @returns {void}
         */
        ResizeObserverSPI.prototype.unobserve = function (target) {
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }

            // Do nothing if current environment doesn't have the Element interface.
            if (typeof Element === 'undefined' || !(Element instanceof Object)) {
                return;
            }

            if (!(target instanceof getWindowOf(target).Element)) {
                throw new TypeError('parameter 1 is not of type "Element".');
            }

            var observations = this.observations_;

            // Do nothing if element is not being observed.
            if (!observations.has(target)) {
                return;
            }

            observations.delete(target);

            if (!observations.size) {
                this.controller_.removeObserver(this);
            }
        };

        /**
         * Stops observing all elements.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.disconnect = function () {
            this.clearActive();
            this.observations_.clear();
            this.controller_.removeObserver(this);
        };

        /**
         * Collects observation instances the associated element of which has changed
         * it's content rectangle.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.gatherActive = function () {
            var this$1 = this;

            this.clearActive();

            this.observations_.forEach(function (observation) {
                if (observation.isActive()) {
                    this$1.activeObservations_.push(observation);
                }
            });
        };

        /**
         * Invokes initial callback function with a list of ResizeObserverEntry
         * instances collected from active resize observations.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.broadcastActive = function () {
            // Do nothing if observer doesn't have active observations.
            if (!this.hasActive()) {
                return;
            }

            var ctx = this.callbackCtx_;

            // Create ResizeObserverEntry instance for every active observation.
            var entries = this.activeObservations_.map(function (observation) {
                return new ResizeObserverEntry(observation.target, observation.broadcastRect());
            });

            this.callback_.call(ctx, entries, ctx);
            this.clearActive();
        };

        /**
         * Clears the collection of active observations.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.clearActive = function () {
            this.activeObservations_.splice(0);
        };

        /**
         * Tells whether observer has active observations.
         *
         * @returns {boolean}
         */
        ResizeObserverSPI.prototype.hasActive = function () {
            return this.activeObservations_.length > 0;
        };

        // Registry of internal observers. If WeakMap is not available use current shim
        // for the Map collection as it has all required methods and because WeakMap
        // can't be fully polyfilled anyway.
        var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();

        /**
         * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
         * exposing only those methods and properties that are defined in the spec.
         */
        var ResizeObserver = function (callback) {
            if (!(this instanceof ResizeObserver)) {
                throw new TypeError('Cannot call a class as a function.');
            }
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }

            var controller = ResizeObserverController.getInstance();
            var observer = new ResizeObserverSPI(callback, controller, this);

            observers.set(this, observer);
        };

        // Expose public methods of ResizeObserver.
        ['observe', 'unobserve', 'disconnect'].forEach(function (method) {
            ResizeObserver.prototype[method] = function () {
                return (ref = observers.get(this))[method].apply(ref, arguments);
                var ref;
            };
        });

        var index = (function () {
            // Export existing implementation if available.
            if (typeof global$1.ResizeObserver !== 'undefined') {
                return global$1.ResizeObserver;
            }

            global$1.ResizeObserver = ResizeObserver;

            return ResizeObserver;
        })();

        return index;

    })));
})();
(function () {
    // set forTableHead to true when convertToRows, false in normal cases like table.vue
    const getDataColumns = (cols, forTableHead = false) => {
        const columns = cols;
        const result = [];
        columns.forEach((column) => {
            if (column.children) {
                if (forTableHead) {
                    result.push(column);
                }
                result.push.apply(result, getDataColumns(column.children, forTableHead));
            } else {
                result.push(column);
            }
        });
        return result;
    };
    const getRandomStr = function (len = 32) {
        const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        const maxPos = $chars.length;
        let str = '';
        for (let i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    };
    const convertColumnOrder = (columns, fixedType) => {
        let list = [];
        columns.forEach((col) => {
            if (fixedType) {
                if (col.fixed && col.fixed === fixedType) {
                    list.push(col);
                }
            } else {
                list.push(col);
            }
        });
        return list;
    };
    function getScrollBarSize() {
        // eslint-disable-next-line angular/document-service
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.height = '200px';

        // eslint-disable-next-line angular/document-service
        const outer = document.createElement('div');
        const outerStyle = outer.style;

        outerStyle.position = 'absolute';
        outerStyle.top = 0;
        outerStyle.left = 0;
        outerStyle.pointerEvents = 'none';
        outerStyle.visibility = 'hidden';
        outerStyle.width = '200px';
        outerStyle.height = '150px';
        outerStyle.overflow = 'hidden';

        outer.appendChild(inner);

        // eslint-disable-next-line angular/document-service
        document.body.appendChild(outer);

        const widthContained = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        let widthScroll = inner.offsetWidth;

        if (widthContained === widthScroll) {
            widthScroll = outer.clientWidth;
        }

        // eslint-disable-next-line angular/document-service
        document.body.removeChild(outer);

        return widthContained - widthScroll;
    }

    angular.module('ui.xg.datatable', [])
        .constant('uixDatatableConfig', {
            loadingText: '数据加载中',
            emptyText: '数据为空',
            errorText: '加载失败',
            emptyDataHeight: 350 // 没有数据时，提示文案占据高度
        })
        .provider('uixDatatable', ['uixDatatableConfig', function (uixDatatableConfig) {
            let statusText = {
                loading: uixDatatableConfig.loadingText,
                empty: uixDatatableConfig.emptyText,
                error: uixDatatableConfig.errorText
            };
            this.setStatusText = function (options) {
                statusText = angular.extend(statusText, options);
            };
            this.$get = function () {
                return {
                    getStatusText: function (type) {
                        if (angular.isDefined(type)) {
                            return statusText[type];
                        }
                        return statusText;
                    }
                };
            };
        }])
        .controller('uixDatatableCtrl', ['$scope', '$timeout', '$element', 'uixDatatableConfig', '$templateCache', '$compile',
            function ($scope, $timeout, $element, uixDatatableConfig, $templateCache, $compile) {
                const $table = this;
                $table.columnsWidth = {}; // 列宽
                $table.bodyStyle = {};
                $table.currentChecked = null;
                $table.selections = {};
                $table.isSelectedAll = false;
                $table.scrollBarWidth = getScrollBarSize();
                $table.showVerticalScrollBar = false;
                $table.showHorizontalScrollBar = false;

                $table.headerHeight = 0; // initial header height
                $table.containerHeight = null;

                $table.scrollX = null; // 滚动宽度

                let compileScope = $scope.$parent.$new();
                compileScope.$table = $table;
                function findEl(selector) {
                    return angular.element($element[0].querySelector(selector));
                }

                function makeRebuildData() {
                    return $scope.data.map((row, index) => {
                        const newRow = angular.copy(row);
                        newRow._index = index;
                        newRow._isHover = false;
                        newRow._isExpand = false;
                        newRow.disabled = !!row.disabled;
                        if ($scope.rowClassName && angular.isFunction($scope.rowClassName)) {
                            newRow._rowClassName = $scope.rowClassName({
                                $row: newRow,
                                $rowIndex: index
                            });
                        }
                        if (row.checked) {
                            $table.currentChecked = index;
                            $table.selections[index] = true;
                        }
                        return newRow;
                    });
                }
                $scope.$watch('$table.currentChecked', (newIndex, oldIndex) => {
                    if (newIndex !== null && $scope.onCurrentChange) {
                        let newRow = $table.rebuildData[newIndex];
                        let oldRow = $table.rebuildData[oldIndex];
                        $scope.onCurrentChange({
                            $newRow: newRow,
                            $oldRow: oldRow,
                            $newIndex: newIndex,
                            $oldIndex: oldIndex,
                        });
                    }
                });
                $scope.$watch('$table.selections', (newVal, oldVal) => {
                    let currentSelect = [];
                    let oldSelect = [];
                    for (let index in newVal) {
                        if (newVal[index]) {
                            currentSelect.push($table.rebuildData[index]);
                        }
                    }
                    for (let index in oldVal) {
                        if (oldVal[index]) {
                            oldSelect.push($table.rebuildData[index]);
                        }
                    }
                    if ($scope.onSelectionChange) {
                        $table.isSelectedAll = currentSelect.length >= $table.rebuildData.length;
                        $scope.onSelectionChange({
                            $newRows: currentSelect,
                            $oldRows: oldSelect
                        });
                    }
                }, true);

                $table.handleSelectAll = () => {
                    $table.rebuildData.forEach((row, index) => {
                        if (row.disabled) {
                            return;
                        }
                        $table.selections[index] = $table.isSelectedAll;
                    });
                };

                $table.handleMouseIn = (event, row) => {
                    event.stopPropagation();
                    if ($table.disabledHover) {
                        return;
                    }
                    if (row._isHover) {
                        return;
                    }
                    row._isHover = true;
                };
                $table.handleMouseOut = (event, row) => {
                    event.stopPropagation();
                    if ($table.disabledHover) {
                        return;
                    }
                    row._isHover = false;
                };
                $table.handleClickRow = (event, row) => {
                    event.stopPropagation();
                    if ($scope.onRowClick) {
                        $scope.onRowClick({
                            $row: row,
                            $rowIndex: row._index
                        });
                    }
                    // 禁用通过点击行选择
                    if ($table.disabledRowClickSelect) {
                        return;
                    }
                    if (row.disabled) {
                        return;
                    }
                    // 单选
                    $table.currentChecked = row._index;
                    // 多选
                    $table.selections[row._index] = !$table.selections[row._index];
                };
                $table.handleSelect = ($event) => {
                    $event.stopPropagation();
                };
                $table.handleSortByHead = (column) => {
                    if (column.sortable) {
                        const type = column._sortType;
                        if (type === 'normal') {
                            $table.handleSort(column, 'asc');
                        } else if (type === 'asc') {
                            $table.handleSort(column, 'desc');
                        } else {
                            $table.handleSort(column, 'normal');
                        }
                    }
                };
                $table.handleSort = (column, type, event) => {
                    if (event) {
                        event.stopPropagation();
                    }
                    if (column._sortType === type) {
                        type = 'normal';
                    }
                    if ($table.multiSort) {
                        column._sortType = type;
                        if (angular.isFunction($scope.onColumnsSort)) {
                            let sorts = $table.allDataColumns
                                .filter(col => col.sortable)
                                .map((column) => {
                                    return {
                                        column,
                                        key: column.key,
                                        order: column._sortType
                                    };
                                });
                            $scope.onColumnsSort({
                                $sorts: sorts
                            });
                        }
                    } else {
                        $table.allDataColumns.forEach((col) => {
                            col._sortType = 'normal';
                        });
                        column._sortType = type;
                        const key = column.key;
                        if (angular.isFunction($scope.onSortChange)) {
                            $scope.onSortChange({
                                $column: column,
                                $key: key,
                                $order: type
                            });
                        }
                    }
                };
                // 清空排序效果
                $table.clearSort = () => {
                    $table.allDataColumns.forEach((col) => {
                        col._sortType = 'normal';
                    });
                };

                // 展开行响应事件，对外可调用
                $table.handleRowExpand = (row) => {
                    if (!row) {
                        return;
                    }
                    let rowIndex = row._index;
                    row._isExpand = !row._isExpand;
                    $timeout(() => {
                        let currentRow = findEl('.uix-datatable-main-body table')
                            .find('.uix-datatable-expand-row').get(rowIndex);
                        if (currentRow) {
                            let expandHeight = currentRow.offsetHeight;
                            if ($table.isLeftFixed) {
                                findEl('.uix-datatable-left-body table')
                                    .find('.uix-datatable-expand-row')
                                    .eq(rowIndex).css({
                                        height: expandHeight + 'px'
                                    });
                            }
                            if ($table.isRightFixed) {
                                findEl('.uix-datatable-right-body table')
                                    .find('.uix-datatable-expand-row')
                                    .eq(rowIndex).css({
                                        height: expandHeight + 'px'
                                    });
                            }
                        }
                    }, 0);
                };

                $table.handlePageChange = () => {
                    if ($scope.onPageChange) {
                        let pageNo = parseInt($table.pagination.pageNo, 10);
                        let pageSize = parseInt($table.pagination.pageSize, 10);
                        $scope.onPageChange({
                            $pageNo: pageNo,
                            $pageSize: pageSize,
                        });
                    }
                };

                function handleMainBodyScroll(event) {
                    let scrollTop = event.target.scrollTop;
                    let scrollLeft = event.target.scrollLeft;
                    findEl('.uix-datatable-main-table .uix-datatable-thead').css({
                        transform: `translateX(-${scrollLeft}px)`
                    });

                    if ($table.isLeftFixed) {
                        findEl('.uix-datatable-left-body')[0].scrollTop = scrollTop;
                    }
                    if ($table.isRightFixed) {
                        findEl('.uix-datatable-right-body')[0].scrollTop = scrollTop;
                    }

                    updateFixedTableShadow();
                }
                function handleFixedBodyScroll(event) {
                    let scrollTop = event.target.scrollTop;
                    findEl('.uix-datatable-main-body')[0].scrollTop = scrollTop;
                    if ($table.isLeftFixed) {
                        findEl('.uix-datatable-left-body')[0].scrollTop = scrollTop;
                    }
                    if ($table.isRightFixed) {
                        findEl('.uix-datatable-right-body')[0].scrollTop = scrollTop;
                    }
                }

                $table.updateContainerByStatus = () => {
                    // 数据为空
                    if ($table.isEmpty || $table.isError || $table.isLoading) {
                        $table.containerHeight = `${uixDatatableConfig.emptyDataHeight}px`;
                    } else {
                        $table.containerHeight = null;
                    }
                };

                function handleResize() {
                    calcColumnsWidth();
                    updateFixedTableShadow();
                    $scope.$digest();
                    $timeout(() => {
                        $table.updateHorizontalScroll();
                        $table.updateVerticalScroll();
                        updateFixedRowHeight();
                        updateFixedHeadHeight();
                    }, 0);
                }

                function bindScrollEvents() {
                    findEl('.uix-datatable-main-body').on('scroll', handleMainBodyScroll);
                    findEl('.uix-datatable-left-body').on('scroll', handleFixedBodyScroll);
                    findEl('.uix-datatable-right-body').on('scroll', handleFixedBodyScroll);
                }
                function unBindScrollEvents() {
                    findEl('.uix-datatable-main-body').off('scroll', handleMainBodyScroll);
                    findEl('.uix-datatable-left-body').on('scroll', handleFixedBodyScroll);
                    findEl('.uix-datatable-right-body').on('scroll', handleFixedBodyScroll);
                }

                function bindResizeEvents() {
                    angular.element(window).on('resize', handleResize);
                    // 处理外部容器发生变化时的回调
                    $table.resizeObserver = new ResizeObserver(() => {
                        handleResize();
                    });
                    $table.resizeObserver.observe($element.get(0));
                }
                function unbindResizeEvents() {
                    angular.element(window).off('resize', handleResize);
                    $table.resizeObserver.disconnect();
                }

                // 更新阴影
                function updateFixedTableShadow() {
                    let scrollLeft = findEl('.uix-datatable-main-body')[0].scrollLeft;
                    let leftClass = 'uix-datatable-scroll-left';
                    let rightClass = 'uix-datatable-scroll-right';
                    if (scrollLeft === 0) {
                        $element.addClass(leftClass);
                        if ($element[0].offsetWidth >= $table.tableWidth) { // 无滚动条
                            $element.addClass(rightClass);
                        } else {
                            $element.removeClass(rightClass);
                        }
                    } else if (scrollLeft >= $table.tableWidth - $element[0].offsetWidth) {
                        $element.addClass(rightClass).removeClass(leftClass);
                    } else {
                        $element.removeClass(leftClass).removeClass(rightClass);
                    }
                }

                function calcColumnsWidth() {
                    let tableWidth = $element[0].offsetWidth - 1;
                    if ($table.scrollX && tableWidth < $table.scrollX) {
                        tableWidth = $table.scrollX;
                    }
                    let columnsWidth = {};
                    let sumMinWidth = 0;
                    let hasWidthColumns = [];
                    let noWidthColumns = [];
                    let maxWidthColumns = [];
                    let noMaxWidthColumns = [];
                    $table.allDataColumns.forEach((col) => {
                        if (col.width) {
                            hasWidthColumns.push(col);
                        } else {
                            noWidthColumns.push(col);
                            if (col.minWidth) {
                                sumMinWidth += col.minWidth;
                            }
                            if (col.maxWidth) {
                                maxWidthColumns.push(col);
                            } else {
                                noMaxWidthColumns.push(col);
                            }
                        }
                        col._width = null;
                    });
                    let unUsableWidth = hasWidthColumns.map(cell => cell.width).reduce((prev, next) => prev + next, 0);
                    let usableWidth = tableWidth - unUsableWidth - sumMinWidth - ($table.showVerticalScrollBar ? $table.scrollBarWidth : 0) - 1;
                    let usableLength = noWidthColumns.length;
                    let columnWidth = 0;
                    if (usableWidth > 0 && usableLength > 0) {
                        columnWidth = parseInt(usableWidth / usableLength, 10);
                    }

                    for (let i = 0; i < $table.allDataColumns.length; i++) {
                        const column = $table.allDataColumns[i];
                        let width = columnWidth + (column.minWidth ? column.minWidth : 0);
                        if (column.width) {
                            width = column.width;
                        } else {
                            if (column._width) {
                                width = column._width;
                            } else {
                                if (column.minWidth > width) {
                                    width = column.minWidth;
                                } else if (column.maxWidth < width) {
                                    width = column.maxWidth;
                                }

                                if (usableWidth > 0) {
                                    usableWidth -= width - (column.minWidth ? column.minWidth : 0);
                                    usableLength--;
                                    if (usableLength > 0) {
                                        columnWidth = parseInt(usableWidth / usableLength, 10);
                                    } else {
                                        columnWidth = 0;
                                    }
                                } else {
                                    columnWidth = 0;
                                }
                            }
                        }
                        column._width = width;
                        columnsWidth[column._index] = {
                            width: width
                        };
                    }
                    if (usableWidth > 0) {
                        usableLength = noMaxWidthColumns.length;
                        columnWidth = parseInt(usableWidth / usableLength, 10);
                        for (let i = 0; i < noMaxWidthColumns.length; i++) {
                            const column = noMaxWidthColumns[i];
                            let width = column._width + columnWidth;
                            if (usableLength > 1) {
                                usableLength--;
                                usableWidth -= columnWidth;
                                columnWidth = parseInt(usableWidth / usableLength, 10);
                            } else {
                                columnWidth = 0;
                            }
                            column._width = width;
                            columnsWidth[column._index] = {
                                width: width
                            };
                        }
                    }
                    $table.tableWidth = $table.allDataColumns
                        .map(cell => cell._width)
                        .reduce((item, prev) => item + prev, 0) + 1;
                    $table.columnsWidth = columnsWidth;
                }

                function prepareColumns(columns) {
                    return columns.filter(column => !column.hidden).map(column => {
                        if ('children' in column) {
                            prepareColumns(column.children);
                        }
                        column.__id = getRandomStr(6);
                        column.width = parseFloat(column.width, 10);
                        column._width = column.width ? column.width : '';
                        column._sortType = 'normal';

                        if ('sortType' in column) {
                            column._sortType = column.sortType;
                        }

                        if (angular.isDefined(column.headerTemplate) || angular.isDefined(column.headerTemplateUrl)) {
                            column.__renderHeadType = 'template';
                            column.__headTemplate = column.headerTemplate || $templateCache.get(column.headerTemplateUrl) || '';
                        } else if (angular.isFunction(column.headerFormat)) {
                            column.__renderHeadType = 'format';
                        } else if (column.type === 'expand') {
                            column.__renderHeadType = 'expand';
                        } else if (column.type === 'selection') {
                            column.__renderHeadType = 'selection';
                        } else {
                            column.__renderHeadType = 'normal';
                        }
                        return column;
                    });
                }
                function makeColumnRows(colsWithId) {
                    const originColumns = colsWithId;
                    let maxLevel = 1;
                    const traverse = (column, parent) => {
                        if (parent) {
                            column.level = parent.level + 1;
                            if (maxLevel < column.level) {
                                maxLevel = column.level;
                            }
                        }
                        if (column.children) {
                            let colSpan = 0;
                            column.children.forEach((subColumn) => {
                                traverse(subColumn, column);
                                colSpan += subColumn.colSpan;
                            });
                            column.colSpan = colSpan;
                        } else {
                            column.colSpan = 1;
                        }
                    };

                    originColumns.forEach((column) => {
                        column.level = 1;
                        traverse(column);
                    });

                    const rows = [];
                    for (let i = 0; i < maxLevel; i++) {
                        rows.push([]);
                    }

                    const allColumns = getDataColumns(originColumns, true);

                    allColumns.forEach((column) => {
                        if (!column.children) {
                            column.rowSpan = maxLevel - column.level + 1;
                        } else {
                            column.rowSpan = 1;
                        }
                        rows[column.level - 1].push(column);
                    });

                    let left = [];
                    let right = [];
                    // 从所有的表头行中找到固定表头
                    // 需要要求固定列的表头不管是否有多级，必须设置fixed
                    for (let rowIndex in rows) {
                        if (rows[rowIndex].length) {
                            rows[rowIndex].forEach(item => {
                                if (item.fixed) {
                                    if (item.fixed === 'left') {
                                        left[rowIndex] = left[rowIndex] || [];
                                        left[rowIndex].push(item);
                                    }
                                    if (item.fixed === 'right') {
                                        right[rowIndex] = right[rowIndex] || [];
                                        right[rowIndex].push(item);
                                    }
                                }
                            });
                        }
                    }
                    return {
                        left,
                        center: rows,
                        right
                    };
                }
                $table.updateVerticalScroll = () => {
                    let mainTableHeight = $element.find('.uix-datatable-main-body > table').get(0).offsetHeight;
                    if ($table.height) {
                        $table.showVerticalScrollBar = mainTableHeight > $table.height;
                    } else if ($table.maxHeight) {
                        $table.showVerticalScrollBar = mainTableHeight > $table.maxHeight;
                    }
                };
                $table.updateHorizontalScroll = () => {
                    let mainTableWidth = $element.find('.uix-datatable-main-body').get(0).offsetWidth;

                    $table.showHorizontalScrollBar = $table.tableWidth > mainTableWidth;
                };

                // 获取固定列的宽度
                function getFixedColumnsWidth(fixedType) {
                    let width = 0;
                    ($table.allDataColumns || []).forEach((col) => {
                        if (col.fixed && col.fixed === fixedType) {
                            width += col._width;
                        }
                    });
                    return width;
                }

                $table.alignCls = (column, row = {}) => {
                    let cellClassName = '';
                    if (row.cellClassName && column.key && row.cellClassName[column.key]) {
                        cellClassName = row.cellClassName[column.key];
                    }
                    return [
                        cellClassName,
                        column.className,
                        column.align ? `uix-datatable-align-${column.align}` : ''
                    ];
                };

                function hasFixedColumns(fixedType) {
                    return $table.allDataColumns.some(col => col.fixed && col.fixed === fixedType);
                }
                function getHeadTpls() {
                    let tpls = '';
                    $table.allColumnRows.forEach((rows) => {
                        rows.forEach((column, colIndex) => {
                            if (column.__renderHeadType === 'template') {
                                tpls += `
                                    <div ng-if="colIndex===${colIndex}">
                                        ${column.__headTemplate}
                                    </div>
                                `;
                            }
                        });
                    });
                    return tpls;
                }
                function getBodyRowsTemplate(position) {
                    let columnsKey = '';
                    if (position === 'left') {
                        columnsKey = 'leftColumns';
                    } else if (position === 'right') {
                        columnsKey = 'rightColumns';
                    } else {
                        columnsKey = 'allDataColumns';
                    }
                    return $table[columnsKey].map((column, colIndex) => {
                        let classes = [
                            column.className,
                            column.align ? `uix-datatable-align-${column.align}` : '',
                        ].join(' ');
                        let ngClass = [
                            `row.cellClassName['${column.key}']`
                        ];
                        let content = '';
                        let enableTooltip = false;
                        if (column.type === 'index') {
                            if (column.indexMethod) {
                                content = '{{::$table[\'' + columnsKey + '\'][' + colIndex + '].indexMethod(row, rowIndex)}}';
                            } else {
                                content = '{{rowIndex+1}}';
                            }
                        } else if (column.type === 'selection') {
                            content = column.singleSelect
                                ? '<input type="radio" ng-disabled="row.disabled" ng-value="row._index" ng-model="$table.currentChecked">'
                                : '<input type="checkbox" ng-click="$table.handleSelect($event)" ng-disabled="row.disabled" ng-model="$table.selections[row._index]">';
                        } else if (column.type === 'expand') {
                            content = `
                            <div class="uix-datatable-expand-trigger" ng-click="$table.handleRowExpand(row, rowIndex)">
                                <i ng-show="!row._isExpand" class="glyphicon glyphicon-chevron-right"></i>
                                <i ng-show="row._isExpand" class="glyphicon glyphicon-chevron-down"></i>
                            </div>
                            `;
                        } else if (angular.isFunction(column.format)) {
                            content = '{{::$table[\'' + columnsKey + '\'][' + colIndex + '].format(row, rowIndex)}}';
                        } else if (angular.isDefined(column.template) || angular.isDefined(column.templateUrl)) {
                            content = column.template || $templateCache.get(column.templateUrl) || '';
                        } else {
                            content = '{{';
                            content += `row['${column.key}']`;
                            if (column.filter) {
                                content += ` | ${column.filter}`;
                            }
                            content += '}}';
                            enableTooltip = column.ellipsis;
                            if (enableTooltip) {
                                content = content.replace(/"/g, '\'');
                            }
                        }
                        if (enableTooltip) {
                            content = `<span tooltip-append-to-body="true" uix-tooltip="${content}">${content}</span>`;
                        }
                        return `
                            <td class="${classes}" ng-class="${ngClass}">
                                <div class="${column.fixed ? 'uix-datatable-cell-fixed' : ''} uix-datatable-cell ${enableTooltip ? 'uix-datatable-cell-ellipsis' : ''}">
                                    ${content}
                                </div>
                            </td>
                        `;
                    }).join('');
                }
                const columnsKeyMap = {
                    main: 'allDataColumns',
                    left: 'leftColumns',
                    right: 'rightColumns'
                };
                function hasExpandTemplate() {
                    let expandTemplate = $templateCache.get($table.expandTemplate) || '';
                    return !!expandTemplate;
                }
                // 获取展开行模板
                // 当具有左右固定列时，只展开中间表格
                function getExpandTemplate(position = 'main') {
                    if (!hasExpandTemplate()) {
                        return '';
                    }
                    let expandTemplate = $templateCache.get($table.expandTemplate) || '';
                    if (position === 'left' || position === 'right') {
                        return `
                            <tr ng-repeat-end ng-show="row._isExpand" class="uix-datatable-expand-row">
                                <td colspan="${$table[columnsKeyMap[position]].length}"></td>
                            </tr>
                        `;
                    }
                    let leftTd = '';
                    let rightTd = '';
                    if ($table.isLeftFixed) {
                        leftTd = `<td colspan="${$table[columnsKeyMap.left].length}"></td>`;
                    }
                    if ($table.isRightFixed) {
                        rightTd = `<td colspan="${$table[columnsKeyMap.right].length}"></td>`;
                    }
                    return `
                        <tr ng-repeat-end ng-show="row._isExpand" class="uix-datatable-expand-row">
                            ${leftTd}
                            <td colspan="${$table.centerColumns.length}">
                                <div class="uix-datatable-expand-cell">
                                    ${expandTemplate}
                                </div>
                            </td>
                            ${rightTd}
                        </tr>
                    `;
                }
                function getTemplate(position = 'main') {
                    let template = $templateCache.get(`templates/datatable-table-${position}.html`);
                    return template
                        .replace('<%head%>', getHeadTemplate(position))
                        .replace('<%body%>', getBodyTemplate(position));
                }
                function getBodyTemplate(position) {
                    let template = $templateCache.get('templates/datatable-body-tpl.html') || '';
                    let columnsKey = columnsKeyMap[position];
                    let widthKey = '';
                    if (position === 'left') {
                        widthKey = 'leftTableWidth';
                    } else if (position === 'right') {
                        widthKey = 'rightTableWidth';
                    } else {
                        widthKey = 'tableWidth';
                    }
                    let hasExpand = hasExpandTemplate();
                    return template
                        .replace('<%repeatExp%>', hasExpand ? 'ng-repeat-start' : 'ng-repeat')
                        .replace('<%widthKey%>', widthKey)
                        .replace('<%columnsKey%>', columnsKey)
                        .replace('<%columnsLength%>', $table[columnsKey].length)
                        .replace('<%expand%>', getExpandTemplate(position))
                        .replace('<%rowHeightExp%>', position === 'left' || position === 'right' ? 'ng-style="{height:row._height+\'px\'}"' : '')
                        .replace('<%template%>', getBodyRowsTemplate(position));
                }
                function getHeadTemplate(position) {
                    let template = $templateCache.get('templates/datatable-head-tpl.html') || '';
                    let widthKey = '';
                    let columnsKey = columnsKeyMap[position];
                    let columnRowsKey = '';
                    if (position === 'left') {
                        columnRowsKey = 'leftColumnRows';
                        widthKey = 'leftTableWidth';
                    } else if (position === 'right') {
                        columnRowsKey = 'rightColumnRows';
                        widthKey = 'rightTableWidth';
                    } else {
                        columnRowsKey = 'allColumnRows';
                        widthKey = 'tableWidth';
                    }
                    return template
                        .replace('<%columnsKey%>', columnsKey)
                        .replace('<%columnRowsKey%>', columnRowsKey)
                        .replace('<%widthKey%>', widthKey)
                        .replace('<%template%>', getHeadTpls());
                }

                function updateFixedRowHeight() {
                    let allRows = $element.find('.uix-datatable-main-body > table .uix-datatable-normal-row');
                    if (allRows.length) {
                        $table.rebuildData.forEach((row, index) => {
                            let tr = allRows.get(index);
                            if (tr) {
                                row._height = tr.offsetHeight;
                            }
                        });
                    }
                }
                // 当固定列与主表格行相同时，直接匹配
                // 当固定列行少于主表格时，由上往下进行匹配，多余的行高补充到最下一行
                // 当固定列行多于主表格时，不用处理
                function fitDiffColumnsRows(mainRows, fixedRows) {
                    let mainLength = mainRows.length;
                    let fixedLength = fixedRows.length;
                    let headerHeight = $table.headerHeight;
                    if (mainLength === fixedLength) { // 表头行相同
                        mainRows.each((index, row) => {
                            fixedRows.eq(index).css({
                                height: row.offsetHeight
                            });
                        });
                    } else if (mainLength > fixedLength) {
                        let restHeight = headerHeight;
                        fixedRows.each((index, row) => {
                            let height = mainRows.get(index).offsetHeight;
                            restHeight -= height;
                            angular.element(row).css({
                                height
                            });
                        });
                        if (restHeight > 0) {
                            fixedRows.eq(fixedLength - 1).css({
                                height: restHeight + fixedRows.get(fixedLength - 1).offsetHeight
                            });
                        }
                    }
                }
                // 计算固定列的表头高度
                function updateFixedHeadHeight() {
                    let allRows = $element.find('.uix-datatable-main-header > table tr');
                    if (!allRows.length) {
                        return;
                    }
                    // 当窗口大小改变时，重新设置左右固定表格的top值
                    let headerHeight = findEl('.uix-datatable-main-header')[0].offsetHeight;
                    $table.headerHeight = headerHeight;
                    if ($table.isLeftFixed) {
                        let leftHeadRows = $element.find('.uix-datatable-left-header > table tr');
                        fitDiffColumnsRows(allRows, leftHeadRows);
                    }
                    if ($table.isRightFixed) {
                        let rightHeadRows = $element.find('.uix-datatable-right-header > table tr');
                        fitDiffColumnsRows(allRows, rightHeadRows);
                    }
                }
                $scope.$watch('$table.showVerticalScrollBar', (val, oldVal) => {
                    if (val !== oldVal) {
                        calcColumnsWidth();
                    }
                });
                $scope.$watch('$table.tableWidth', (val, oldVal) => {
                    if (val !== oldVal) {
                        $table.updateHorizontalScroll();
                    }
                });

                function renderTableBody() {
                    let template = getTemplate('main');
                    if ($table.isLeftFixed) {
                        template += getTemplate('left');
                    }
                    if ($table.isRightFixed) {
                        template += getTemplate('right');
                    }
                    $compile(template)(compileScope, (clonedElement) => {
                        let tableWrap = angular.element($element[0]
                            .querySelector('.uix-datatable-content'));
                        // 在empty之前把绑定的滚动事件清除重新绑定
                        unBindScrollEvents();
                        tableWrap.empty().append(clonedElement);
                        bindScrollEvents();
                        $timeout(() => {
                            let headerHeight = findEl('.uix-datatable-main-header')[0].offsetHeight;
                            $table.headerHeight = headerHeight;

                            $table.updateHorizontalScroll();
                            $table.updateVerticalScroll();
                            updateFixedTableShadow();
                            updateFixedRowHeight();
                            updateFixedHeadHeight();
                        }, 0);
                    });
                }
                function splitColumns() {
                    let columns = $table.allDataColumns;
                    let left = [];
                    let right = [];
                    let center = [];

                    columns.forEach((column, index) => {
                        column._index = index;

                        if (column.fixed && column.fixed === 'left') {
                            left.push(column);
                        } else if (column.fixed && column.fixed === 'right') {
                            right.push(column);
                        } else {
                            center.push(column);
                        }
                    });
                    return {
                        left: left,
                        center: center,
                        right: right,
                    };
                }

                $table.initColums = function () {
                    const colsWithId = prepareColumns($scope.columns);
                    $table.allDataColumns = getDataColumns(colsWithId);

                    let columsObj = splitColumns(colsWithId);
                    $table.leftColumns = columsObj.left;
                    $table.rightColumns = columsObj.right;
                    $table.centerColumns = columsObj.center;

                    let columnRowsObj = makeColumnRows(colsWithId);
                    $table.allColumnRows = columnRowsObj.center;
                    $table.leftColumnRows = columnRowsObj.left;
                    $table.rightColumnRows = columnRowsObj.right;

                    $table.leftTableWidth = getFixedColumnsWidth('left');
                    $table.rightTableWidth = getFixedColumnsWidth('right');

                    $table.isLeftFixed = hasFixedColumns('left');
                    $table.isRightFixed = hasFixedColumns('right');
                };
                $table.initData = function () {
                    $table.rebuildData = makeRebuildData();
                    $timeout(() => {
                        updateFixedRowHeight();
                    }, 0);
                };
                $table.render = () => {
                    calcColumnsWidth();
                    renderTableBody();
                };
                // 初始化
                $table.init = function () {
                    $table.initColums();
                    $table.initData();
                    $table.render();

                    bindResizeEvents();
                };
                $scope.$on('$destroy', () => {
                    unbindResizeEvents();
                    unBindScrollEvents();
                    compileScope.$destroy();
                });
                $scope.$on('uix-datatable-clear-sort', (evt, id) => {
                    if (id !== $scope.id) {
                        return;
                    }
                    $table.clearSort();
                });
            }])
        .directive('uixDatatable', ['uixDatatable', 'uixDatatableConfig', '$timeout', function (uixDatatable, uixDatatableConfig, $timeout) {
            return {
                restrict: 'E',
                templateUrl: 'templates/datatable.html',
                replace: true,
                require: ['uixDatatable'],
                scope: {
                    columns: '=',
                    data: '=',
                    status: '=',
                    disabledHover: '=',
                    rowClassName: '&',
                    onSortChange: '&',
                    onColumnsSort: '&',
                    onRowClick: '&',
                    onSelectionChange: '&',
                    onCurrentChange: '&',
                    onPageChange: '&',
                    height: '=',
                    maxHeight: '=',
                    expandTemplate: '@',
                    disabledRowClickSelect: '=',
                    scrollX: '=',
                    pageSizes: '=',
                    pagination: '=',
                    id: '@'
                },
                controllerAs: '$table',
                controller: 'uixDatatableCtrl',
                link: function (scope, el, $attrs, ctrls) {
                    var $table = ctrls[0];
                    $table.columns = scope.columns;
                    $table.data = scope.data;

                    $table.isStriped = 'striped' in $attrs;
                    $table.isBordered = 'bordered' in $attrs;

                    $table.showPagination = 'pagination' in $attrs;
                    if ($table.showPagination) {
                        $table.pagination = scope.pagination;
                        scope.$watch('pagination', (val) => {
                            $table.pagination = {
                                pageNo: val && val.pageNo ? val.pageNo : ($table.pagination.pageNo || 1),
                                pageSize: val && val.pageSize ? val.pageSize : ($table.pagination.pageSize || 20),
                                totalCount: val && val.totalCount ? val.totalCount : ($table.pagination.totalCount || 0),
                            };
                        }, true);
                    }
                    $table.showSizer = 'pageSizes' in $attrs;
                    if ($table.showSizer) {
                        $table.pageSizes = scope.pageSizes;
                    }

                    $table.multiSort = 'multiSort' in $attrs;

                    $table.isLoading = false;
                    $table.isEmpty = false;
                    $table.isError = false;

                    $table.expandTemplate = scope.expandTemplate || '';

                    ['loading', 'empty', 'error'].forEach(type => {
                        scope[`${type}Text`] = $attrs[`${type}Text`] ||
                            uixDatatable.getStatusText(type) ||
                            uixDatatableConfig[`${type}Text`];
                    });

                    scope.$watch('height', (val) => {
                        val = parseFloat(val, 10);
                        if (!isNaN(val)) {
                            $table.height = val;
                            $table.bodyStyle = {
                                height: $table.height + 'px',
                            };
                        }
                    });
                    scope.$watch('maxHeight', (val) => {
                        val = parseFloat(val, 10);
                        if (!isNaN(val)) {
                            $table.maxHeight = val;
                            if (!$table.height) {
                                $table.bodyStyle = {
                                    maxHeight: val + 'px',
                                };
                            }
                        }
                    });

                    scope.$watch('disabledHover', function (val) {
                        $table.disabledHover = val;
                    });

                    scope.$watch('disabledRowClickSelect', function (val) {
                        $table.disabledRowClickSelect = val;
                    });

                    scope.$watch('scrollX', (val) => {
                        val = parseFloat(val, 10);
                        if (isNaN(val)) {
                            $table.scrollX = 0;
                        } else {
                            $table.scrollX = val;
                        }
                    });

                    scope.$watch('data', function (val, old) {
                        if (val !== old && angular.isDefined(val)) {
                            $table.data = val;
                            $table.initData();
                            // 当内容发生变化时，重新计算是否有纵向滚动
                            $timeout(() => {
                                $table.updateVerticalScroll();
                            }, 0);
                        }
                    });
                    scope.$watch('columns', function (val, old) {
                        if (val !== old && angular.isDefined(val)) {
                            $table.columns = val;
                            $table.initColums();
                            $table.render();
                        }
                    });
                    scope.$watch('status', function (val) {
                        $table.isLoading = val === 1 || val === 'loading';
                        $table.isEmpty = val === 2 || val === 'empty';
                        $table.isError = val === -1 || val === 'error';
                        $table.updateContainerByStatus();
                    });

                    $table.init();
                }
            };
        }])
        .directive('uixDatatableFoot', ['$timeout', function ($timeout) {
            return {
                restrict: 'E',
                templateUrl: 'templates/datatable-foot.html',
                replace: true,
                require: '^uixDatatable',
                scope: {
                },
                link: function (scope, el, attrs, $table) {
                    scope.$table = $table;
                    let pageSizes = $table.pageSizes || [20, 40, 50, 100, 200];
                    if ($table.pagination.pageSize && pageSizes.indexOf($table.pagination.pageSize) === -1) {
                        pageSizes.push($table.pagination.pageSize);
                    }
                    scope.pageSizes = pageSizes.sort((prev, next) => prev - next);
                    scope.handlePageChange = () => {
                        $table.handlePageChange();
                    };
                    scope.handleSizerChange = () => {
                        let cachePageNo = $table.pagination.pageNo;
                        $timeout(() => {
                            if ($table.pagination.pageNo === cachePageNo) {
                                scope.handlePageChange();
                            }
                        }, 0);
                    };
                }
            };
        }]);
})();
