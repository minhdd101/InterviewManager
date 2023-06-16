$.validator.setDefaults({
    onfocusout: function (element) {
        $(element).valid();
    }
});
var statusElement = $('#DealStatusUpdateStatus');
jQuery.validator.addMethod("updatestatusvalidation",
    function (value, element, param) {
        var elementId = element.id;
        if (statusElement.val() == 'SUBMITTED' && elementId == 'DealStatusUpdateRegId' && value != '') {
            return true;
        } else if (statusElement.val() == 'APPROVED' && (elementId == 'DealStatusUpdateOppId' || elementId == 'DealStatusUpdateOppName' || elementId == 'DealStatusUpdateOppExpiredDate') && value != '') {
            return true;
        }
        return false;
    });

jQuery.validator.unobtrusive.adapters.addBool("updatestatusvalidation");

jQuery.validator.addMethod('date', function (value, element) {
    return this.optional(element) || moment(value, "YYYY-MM-DD", true).isValid();
});
jQuery.validator.unobtrusive.adapters.addBool("date");

jQuery.validator.addMethod('now', function (value, element) {
    var isValidDate = this.optional(element) || moment(value, "YYYY-MM-DD", true).isValid();

    if (isValidDate) {
        var date = moment(value, "YYYY-MM-DD", true);
        var today = moment().startOf('day');

        var op = element.getAttribute('data-val-nowop');
        return validate_func.checkDate(date, today, op);
    }
    return isValidDate;
});
jQuery.validator.unobtrusive.adapters.addBool("now");
//https://stackoverflow.com/questions/5736710/mvc3-validate-input-not-equal-to
jQuery.validator.addMethod('unlike', function (value, element) {
    var propertyName = element.getAttribute('data-val-unlike-field'); // $(element).data('valUnlikeField')
    return this.optional(element) || value != $('#' + propertyName).val();
});
jQuery.validator.unobtrusive.adapters.addBool("unlike");
//jQuery.validator.unobtrusive.adapters.add('not-equal', ['otherproperty'], function (options) {
//    options.rules['not-equal'] = { otherproperty: options.params.otherproperty };
//    options.messages['not-equal'] = options.message;
//});

function resetValidation() {
    $(this).each(function () {
        $(this).find(".field-validation-error").empty();
        $(this).trigger('reset.unobtrusiveValidation');
    });
    $('.field-validation-error').html("");
    $('.field-validation-valid').html("");
};

$("#statusModal").on('hide.bs.modal', function () {
    resetValidation();
});

$("#statusModal").on('hidden.bs.modal', function () {
    resetValidation();
});
var subValid = false;
jQuery.validator.addMethod('compare', function (value, element) {
    var op = element.getAttribute('data-val-compareop');

    var destElm = element.getAttribute('data-val-compare-id');
    var dependentMatch = element.id.match(/(.+?__)/);
    if (dependentMatch) {
        destElm = dependentMatch[1] + destElm;
    }
    var destText = $('#' + destElm).val();
    var source = validate_func.parseDate(value);
    var isValid = false;
    if (source.isValid()) {
        var dest = validate_func.parseDate(destText);
        if (!dest.isValid()) return true;

        isValid = validate_func.checkDate(source, dest, op);
    }
    else {
        isValid = validate_func.checkNumber(+value, +destText, op);
    }
    if (!subValid) {
        subValid = true;
        window.setTimeout(function () {
            $('#' + destElm).trigger('focusout');
            subValid = false;
        }, 50);
    }
    return isValid;
});
jQuery.validator.unobtrusive.adapters.addBool("compare");
var validate_func = {
    checkDate: function (source, dest, op) {
        switch (op) {
            case 'None':
                return true;
            case 'Equal':
                return source.isSame(dest);
            case 'GreaterThan':
                return source.isAfter(dest);
            case 'GreaterThanOrEqual':
                return source.isSameOrAfter(dest);
            case 'LessThan':
                return source.isBefore(dest);
            case 'LessThanOrEqual':
                return source.isSameOrBefore(dest);
        }
        return false;
    },
    checkNumber: function (source, dest, op) {
        switch (op) {
            case 'None':
                return true;
            case 'Equal':
                return source === dest;
            case 'GreaterThan':
                return source > dest;
            case 'GreaterThanOrEqual':
                return source >= dest;
            case 'LessThan':
                return source < dest;
            case 'LessThanOrEqual':
                return source <= dest;
        }
        return false;
    },
    parseDate: function (dateText) {
        return moment((dateText ?? '').replace(/\//g, '-'), "YYYY-MM-DD", true);
    }
}

jQuery.validator.addMethod('group-required', function (value, element) {
    var inputs = element.getAttribute('data-val-properties').split('|');
    var values = $.map(inputs, function (input, index) {
        var val = $('#' + input).val();
        if (val != '') return input;

        return null;
    });
    return values.length == inputs.length;
});
jQuery.validator.unobtrusive.adapters.addBool("group-required");