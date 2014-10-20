$(function() {
    'use strict';

    var
        okay = 'okay',
        wrong = 'wrong',
        tm = 2000;

    SendHub.flashFeedback = {
        okay: function(form/*, msg*/) {

            form.addClass(okay);
            setTimeout(function() {
                form.removeClass(okay);
            }, tm);
        },
        wrong: function(form/*, msg*/) {

            form.addClass(wrong);
            setTimeout(function() {
                form.removeClass(wrong);
            }, tm);
        }
    };
});