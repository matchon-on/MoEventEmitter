/**
 * MoEventEmitter v1.0.01
 * Unlicense - http://unlicense.org/
 * 画笔(上海)网络科技有限公司
 * 基于 EventEmitter (Github: https://github.com/Olical/EventEmitter) 
 * EventEmitter 由 Oliver Caldwell - http://oli.me.uk/ 开发
 * @preserve
 */

;(function (exports) {
    "use strict";

    /**
     * 
     * <p>与Nodejs EventEmitter兼容的事件管理类. 用做MatchOn Javascript API的事件引擎, 在MatchOn JavaScript API中,由MatchOn对象继承.</p>
     * <p> 您不需要单独使用这个类, 构建MoEventEmitter对象. MatchOn对象继承了这里描述的所有函数.</p>
     * <p> 示例: 在MatchOn对象上直接使用这里描述的函数.</p>
     * @example 
     *  var mo = new MatchOn(options);
     *  mo.init();
     *  mo.on("message", handleMessage);
     *  mo.emit("yourEvent", handleYourEvent);
     *  function handleMessage(e) {
     *  };
     *  function handleYourEvent(e) {
     *  };
     * @module MoEventEmitter
     * @namespace MoEventEmitter
     * @class MoEventEmitter
     */
    function MoEventEmitter() {}

    var originalGlobalValue = exports.MoEventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * 返回指定事件的所有订阅者
     * 如果需要,将会初始化事件对象和订阅者数组
     * 如果使用正则表达式搜索, 将会返回一个对象.这个对象的键(key)代表每个匹配的事件. 例如 /ba[rz] 可能返回包含 bar和baz键的对象. 
     * 每个键的值是这个键对应的订阅者数组
     *
     * @param {String|RegExp} evt 事件名称
     * @return {Function[]|Object} 事件对应的所有函数
     * @memberof MoEventEmitter
     */
    MoEventEmitter.prototype.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    MoEventEmitter.prototype.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */

    MoEventEmitter.prototype.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    function isValidListener (listener) {
        if (typeof listener === "function" || listener instanceof RegExp) {
            return true
        } else if (listener && typeof listener === "object") {
            return isValidListener(listener.listener)
        } else {
            return false
        }
    }

    /**
     * 给指定事件增加一个新的订阅者
     * 如果这个订阅者已经被添加, 不会被再次添加
     * 如果传递的事件名称为正则表达式,那么这个订阅者将会订阅所有和这个表达式匹配的事件
     *
     * @param {String|RegExp} evt 事件名称,可是是正则表达式
     * @param {Function} listener 事件订阅函数. 如果返回值为true, 那么被调用后将会从事件订阅者数组中移走
     * @return {Object} 当前MoEventEmitter对象,用于链式调用
     * @memberof MoEventEmitter
     */
    MoEventEmitter.prototype.addListener = function addListener(evt, listener) {
        if (!isValidListener(listener)) {
            throw new TypeError("listener must be a function");
        }

        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === "object";
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * addListener的别名
     * @memberof MoEventEmitter
     * @function on
     * @see MoEventEmitter#addListener
     */

    MoEventEmitter.prototype.on = alias("addListener");

    /**
     * addListener的另一个别名,用于添加一个只会被调用一次的事件订阅者
     *
     * @param {String|RegExp} evt 事件名 Name of the event to attach the listener to.
     * @param {Function} listener 事件订阅函数. 如果返回值为true, 那么被调用后将会从事件订阅者数组中移走
     * @return {Object} 当前MoEventEmitter对象,用于链式调用
     */

    MoEventEmitter.prototype.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * addOnceListener的别名
     * @memberof MoEventEmitter
     * @function once
     * @see MoEventEmitter#addOnceListener
     */

    MoEventEmitter.prototype.once = alias("addOnceListener");

    /**
     * 定义事件名称. 如果希望使用正则表达式一次为多个事件添加订阅者, 需要使用此函数预先订阅事件名.否则每次发出事件时,都要做正则表达式匹配,这会严重影响性能.
     *
     * @param {String} evt 需要创建的事件名
     * @return {Object} 当前MoEventEmitter对象,用于链式调用
     * @memberof MoEventEmitter
     */

    MoEventEmitter.prototype.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * 使用defineEvent定义多个事件
     *
     * @param {String[]} evts 事件名称数组
     * @return {Object} 当前MoEventEmitter对象,用于链式调用
     * @memberof MoEventEmitter
     *
     */
    MoEventEmitter.prototype.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * 将订阅者从指定的事件中移走
     * 如果传入正则表达式,将会从所有匹配的事件中移走
     *
     * @param {String|RegExp} evt 事件名称
     * @param {Function} listener 订阅函数
     * @return {Object} 当前MoEventEmitter对象,用于链式调用
     * @memberof MoEventEmitter
     */
    MoEventEmitter.prototype.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * removeListener的别名
     * @function off
     * @see MoEventEmitter#removeListener
     * @memberof MoEventEmitter
     */

    MoEventEmitter.prototype.off = alias("removeListener");

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the first argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    MoEventEmitter.prototype.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the first argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    MoEventEmitter.prototype.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    MoEventEmitter.prototype.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === "object" && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === "function") {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * 移除一个事件的所有订阅者
     * 如果不指定事件名,将会移走所有订阅者
     * 也可以通过正则表达式移走所有匹配的事件的订阅者
     *
     * @param {String|RegExp} [evt] 可选, 事件名或正则表达式. 如果不指定将会移走所有事件的所有订阅者
     * @return {Object} 当前MoEventEmitter对象,用于链式调用
     * @memberof MoEventEmitter
     */
    MoEventEmitter.prototype.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === "string") {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * 移走所有订阅者, 不使用参数调用removeEvent的别名
     * @function removeAllListeners
     * @see MoEventEmitter#removeEvent
     * @memberof MoEventEmitter
     * Added to mirror the node API.
     */
    MoEventEmitter.prototype.removeAllListeners = alias("removeEvent");

    /**
     * 触发任意事件
     * 当触发时,所有订阅该事件的订阅者将被执行
     * 如果您传递一个可选的参数列表, 这些参数也会被传递给所有订阅者
     * 您也可以传递一个正则表达式参数,这样所有匹配的事件都会被触发
     *
     * @param {String|RegExp} evt 事件名
     * @param {Array} [args] 可选的参数数组
     * @return {Object} 当前MoEventEmitter对象,用于链式调用
     * @memberof MoEventEmitter
     */
    MoEventEmitter.prototype.emitEvent = function emitEvent(evt, args) {
        var listenersMap = this.getListenersAsObject(evt);
        var listeners;
        var listener;
        var i;
        var key;
        var response;

        for (key in listenersMap) {
            if (listenersMap.hasOwnProperty(key)) {
                listeners = listenersMap[key].slice(0);

                for (i = 0; i < listeners.length; i++) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * 触发事件的别名
     * @function trigger
     * @see MoEventEmitter@#emitEvent
     * @memberof MoEventEmitter
     */
    MoEventEmitter.prototype.trigger = alias("emitEvent");

    /**
     * 与emitEvent略有不同. 将参数直接传递给订阅者,而不是通过一个数组传递
     * 同样支持使用正则表达式
     *
     * @param {String|RegExp} evt 事件名称
     * @param {...*} Optional 传递给订阅者的参数
     * @return {Object} 当前MoEventEmitter对象,用于链式调用
     * @memberof MoEventEmitter
     */
    MoEventEmitter.prototype.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emit(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    MoEventEmitter.prototype.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    MoEventEmitter.prototype._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty("_onceReturnValue")) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    MoEventEmitter.prototype._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link MoEventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */

    MoEventEmitter.noConflict = function noConflict() {
        exports.MoEventEmitter = originalGlobalValue;
        return MoEventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === "function" && define.amd) {
        define(function () {
            return MoEventEmitter;
        });
    }
    else if (typeof module === "object" && module.exports){
        module.exports = MoEventEmitter;
    }
    else {
        exports.MoEventEmitter = MoEventEmitter;
    }
}(this || {}));
