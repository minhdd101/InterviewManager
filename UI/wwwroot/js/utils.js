; (function ($, window, document) {

    "use strict";

    // Create the defaults once
    var pluginName = "number_utils",
        defaults = {
            separator: true,
            invalidChars: ["-", "e", "+", "E"]
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {

            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like the example below
            this.registerEvent(this.settings);
        },
        registerEvent: function (settings) {
            var currencyInput = this.element;
            //var currency = '' // https://www.currency-iso.org/dam/downloads/lists/list_one.xml

            // format inital value
            onBlur({ target: currencyInput });

            // bind event listeners
            currencyInput.addEventListener('input', onInput);
            currencyInput.addEventListener('blur', onBlur);
            currencyInput.addEventListener('keypress', onKeydown);
            $(currencyInput).on('cut copy paste', function (e) { e.preventDefault(); });

            function onInput(e) {
                var value = e.target.value;
                if (/^[0-9.,]+$/.test(value) == false ||
                    (e.target.maxLength > 0 && value.length > e.target.maxLength)) {
                    e.target.value = value.substring(0, value.length - 1);
                }
                else {
                    if (settings.separator)
                        e.target.value = parseFloat(value.replace(/,/g, '')).toLocaleString('en');
                }
            }

            function onBlur(e) {
                var value = e.target.value

                var newValue = value ? fukui_utils.localStringToNumber(value) : '';
                e.target.value = settings.separator
                    ? fukui_utils.formatNumber(newValue)
                    : newValue;
            }
            function onKeydown(e) {
                if (settings.invalidChars.includes(e.key)) {
                    e.preventDefault();
                }
            }
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);