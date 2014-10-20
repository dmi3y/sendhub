$(function() {
'use strict';

    var
        hlprs = SendHub.hlprs,
        ffb = SendHub.flashFeedback;

    SendHub.LoginModel = Backbone.Model.extend({
        url: '/login',
        validate: function(attrs) {

            if (!hlprs.validateNumber(attrs.NUMBER) || !attrs.APIKEY || !attrs.SOLT) {

                return 'Missed required data.';
            }
        }
    });

    SendHub.LoginView = SendHub.BaseView.extend({
        el: $('#mainApp'),
        events: {
            'submit form#loginForm': 'loginAction',
            'paste form#loginForm': 'pasteAction',
            'keyup form#loginForm': 'changeAction',
        },
        initialize: function() {

            this.render();
        },
        render: function() {
            var
                status,
                initialData;

            $(this.el).html(SendHub.tmpl.app.login());

            this.button = $('#login');
            this.form = $('form#loginForm');

            initialData = hlprs.getSubmitData(this.form);
            initialData.SOLT = initialData.APIKEY;

            this.model.set(initialData);

            status = this.model.isValid();
            hlprs.toggleButton(this.button, status);
        },
        loginAction: function(ev) {
            var
                self = this;

            ev.preventDefault();

            hlprs.toggleButton(self.button, false);

            this.model.save()
                .done(function(data) {

                    if ( data.resp === 200 ) {

                        self.form.addClass('bounceOut');
                        setTimeout(function() {

                            new SendHub.SendView({
                                contactList: data.body.objects,
                                model: new SendHub.SendModel({solt: data.solt})
                            });
                        }, 500);
                    } else {

                        hlprs.sendMessage(data.resp);
                        ffb.wrong(self.form);
                    }
                })
                .fail(function() {

                    hlprs.sendMessage('Server error');
                    ffb.wrong(self.form);
                });
        }
    });

    new SendHub.LoginView({model: new SendHub.LoginModel()});
});
