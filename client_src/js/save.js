$(function() {
    'use strict';

    var
        hlprs = SendHub.hlprs,
        ffb = SendHub.flashFeedback;

    SendHub.SaveModel = Backbone.Model.extend({
        url: '/save',
        validate: function(attrs) {

            if (!hlprs.validateNumber(attrs.NUMBER) || !attrs.NAME) {

                return 'Missed required data.';
            }
        }
    });

    SendHub.SaveView = SendHub.BaseView.extend({
        el: $('#addBox'),
        events: {
            'submit form#saveContactForm': 'saveAction',
            'paste form#saveContactForm': 'pasteAction',
            'keyup form#saveContactForm': 'changeAction',
        },
        initialize: function(conf) {

            this.send = conf.send;
            this.render();
        },
        render: function() {
            var
                status;

            $(this.el).html(SendHub.tmpl.app.save());
            this.button = $('#save');
            this.form = $('form#saveContactForm');

            status = this.model.isValid();
            hlprs.toggleButton(this.button, status);

        },

        saveAction: function(ev) {
            var
                self = this,
                form = this.form;

            ev.preventDefault();

            hlprs.toggleButton(this.button, false);

            this.model.save()
                .done(function(data) {
                    var
                        body;

                    if (data.resp === 201) {

                        body = data.body;
                        self.send.contactList = body.objects;
                        self.send.renderContacts();
                        ffb.okay(form);
                    } else {

                        hlprs.sendMessage(data);
                        ffb.wrong(form);
                    }

                })
                .fail(function() {

                    hlprs.sendMessage('Server error');
                    ffb.wrong(form);
                })
                .always(function() {

                    hlprs.toggleButton(self.save, self.validateSend(form));
                });
        }
    });

});
