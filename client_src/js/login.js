$(function() {
'use strict';

    var
        View,
        hlprs = SendHub.hlprs;

    View = Backbone.View.extend({
        el: $('#mainApp'),
        events: {
            'submit form#loginForm': 'loginAction'
        },
        initialize: function() {

            _.bindAll(this, 'render', 'loginAction');
            this.render();
        },
        render: function() {

            $(this.el).html(SendHub.tmpl.app.login());
            this.button = $('#login');
        },
        loginAction: function(ev) {
            var
                self = this,
                submitData;

            ev.preventDefault();
            submitData = hlprs.getSubmitData(ev.target);
            submitData.SOLT = submitData.APIKEY;

            if (hlprs.validateNumber(submitData.NUMBER) && submitData.APIKEY) {

                self.button.attr('disabled', 'disabled');

                $.post("/login", submitData)
                    .done(function(data) {

                        if ( data.resp === 200 ) {

                            data.body.solt = submitData.SOLT;
                            new SendHub.AppView(data.body);
                        } else {

                            hlprs.sendMessage(data.resp);
                        }
                    })
                    .fail(function() {

                        hlprs.sendMessage("Server error");
                    })
                    .always(function() {

                        self.button.removeAttr('disabled');
                    });
            } else {

                hlprs.sendMessage("Validation is not passed");
            }
        }
    });

    new View();
    SendHub.loginView = View;
});
