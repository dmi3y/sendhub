$(function() {
    'use strict';

    var
        hlprs = SendHub.hlprs,
        ffb = SendHub.flashFeedback;

    SendHub.SendModel = Backbone.Model.extend({
        url: '/send',
        defaults: {
            contacts: []
        },
        validate: function(attrs) {

            if (!attrs.MESSAGE || !attrs.contacts.length) {

                return 'Missed required data.';
            }
        }
    });

    SendHub.SendView = SendHub.BaseView.extend({
        el: $('#mainApp'),
        events: {
            'submit form#sendMessageForm': 'sendAction',
            'paste form#sendMessageForm': 'pasteAction',
            'keyup form#sendMessageForm': 'changeAction',

            'click #appContacts': 'addToSend'
        },

        initialize: function(conf) {

            this.contactList = conf.contactList;
            this.render();
        },

        render: function() {
            var
                status;

            $(this.el).html(SendHub.tmpl.app.main());

            this.button = $('#send');
            this.form = $('form#sendMessageForm');

            this.contactsNode = $('#appContacts');

            status = this.model.isValid();
            hlprs.toggleButton(this.button, status);

            this.renderContacts();

            new SendHub.SaveView({
                el: '#addBox',
                send: this,
                model: new SendHub.SaveModel()
            });
        },

        renderContacts: function() {
            var
                contactsHtml = SendHub.tmpl.contacts.item({

                    contactList: this.contactList
                });

            this.contactsNode.html(contactsHtml);
        },

        addToSend: function(ev) {
            var
                el = $(ev.target),
                ix = el.data('ref'),
                contactList = this.contactList,
                contacts = this.model.get('contacts'),
                id = contactList[ix].id,
                cix = contacts.indexOf(id),
                button = this.button;

            if (cix !== -1) {

                contacts.splice(cix, 1);
                el.removeClass('selected');
            } else {

                contacts.push(id);
                el.addClass('selected');
            }

            hlprs.toggleButton(button, this.model.isValid());
        },

        sendAction: function(ev) {
            var
                self = this,
                form = this.form;

            ev.preventDefault();


            hlprs.toggleButton(this.button, false);

            this.model.save()
                .done(function(data) {

                    if (data.resp === 201) {

                        hlprs.sendMessage('Message has been send.');
                        ffb.okay(form);
                    } else {

                        hlprs.sendMessage('Message has not been send.');
                        ffb.wrong(form);
                    }

                })
                .fail(function() {

                    hlprs.sendMessage('Server error');
                    ffb.wrong(form);
                })
                .always(function() {

                    hlprs.toggleButton(self.button, self.model.isValid());
                });
        }
    });
});
