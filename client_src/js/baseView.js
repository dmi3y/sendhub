$(function() {
'use strict';
    var
        View,
        hlprs = SendHub.hlprs;

    View = Backbone.View.extend({
        changeAction: function() {
            var
                form = this.form,
                button = this.button,
                status,
                data = hlprs.getSubmitData(form);

            this.model.set(data);

            status = this.model.isValid();

            hlprs.toggleButton(button, status);
        },

        pasteAction: function() {
            var
                self = this;

            setTimeout(function() {
                self.changeAction();
            }, 0);
        }
    });

    SendHub.BaseView = View;
});
