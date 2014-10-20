$(function() {
    'use strict';

    var
        View,
        hlprs = SendHub.hlprs,
        ffb = SendHub.flashFeedback;

    View = Backbone.View.extend({
        el: $('#mainApp'),
        events: {
            'submit form#selectContactForm': 'saveAction',
            'paste form#selectContactForm': 'pasteAction',
            'keyup form#selectContactForm': 'changeAction',

            'submit form#sendMessageForm': 'sendAction',
            'paste form#sendMessageForm': 'pasteAction',
            'keyup form#sendMessageForm': 'changeAction',

            'click #appContacts': 'addToSend'
        },
        initialize: function(data) {
            var
                contactList = data.objects || [],
                solt = data.solt;

            this.contactList = contactList;
            this.contactToSend = [];
            this.solt = solt;

            _.bindAll(this, 'render', 'saveAction');
            _.bindAll(this, 'render', 'sendAction');
            this.render();
        },
        render: function() {

            $(this.el).html(SendHub.tmpl.app.main());

            this.save = $('#save');
            this.send = $('#send');
            this.name = $('#name');
            this.number = $('#phone');

            hlprs.toggleButton(this.save, false);
            hlprs.toggleButton(this.send, false);
            this.contactsNode = $('#appContacts');

            this.renderContacts();
        },

        renderContacts: function() {
            var
                contactsHtml = SendHub.tmpl.contacts.item({

                    contactList: this.contactList
                });

            this.contactsNode.html(contactsHtml);
        },

        saveAction: function(ev) {
            var
                self = this,
                submitData,
                form = $(ev.target);

            ev.preventDefault();
            submitData = hlprs.getSubmitData(ev.target);
            submitData.SOLT = self.solt;
            hlprs.toggleButton(this.save, false);

            $.post('/save', submitData)
                .done(function(data) {
                    var
                        body;

                    if (data.resp === 201) {

                        body = data.body;
                        self.contactList = body.objects;
                        self.renderContacts();
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

                    hlprs.toggleButton(self.save, true);
                });
        },
        sendAction: function(ev) {
            var
                self = this,
                submitData,
                contactToSend = this.contactToSend,
                form = $(ev.target);

            ev.preventDefault();
            submitData = hlprs.getSubmitData(ev.target);
            submitData.SOLT = self.solt;
            submitData.CONTACTS = contactToSend;
            hlprs.toggleButton(this.send, false);

            $.post('/send', submitData)
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

                    hlprs.toggleButton(self.send, true);
                });
        },
        addToSend: function(ev) {
            var
                el = $(ev.target),
                ix = el.data('ref'),
                contactList = this.contactList,
                contactToSend = this.contactToSend,
                id = contactList[ix].id,
                cix = contactToSend.indexOf(id),
                form = $('form#sendMessageForm'),
                button = this.send;

            if (cix !== -1) {

                contactToSend.splice(cix, 1);
                el.removeClass('selected');
            } else {

                contactToSend.push(id);
                el.addClass('selected');
            }

            this.validateSend(form, button);
        },

        changeAction: function(ev) {
            var
                form = $(ev.currentTarget),
                button = $('button', form);

            switch (button.attr('id')) {
                case 'save':

                    this.validateSave(form, button);
                    break;
                case 'send':

                    this.validateSend(form, button);
                    break;
            }
        },

        pasteAction: function(ev) {
            var
                self = this;

            setTimeout(function() {
                self.changeAction(ev);
            }, 0);
        },
        validateSend: function(form, button) {
            var
                data = hlprs.getSubmitData(form),
                status = false,
                contactToSend = this.contactToSend;

            if (data.MESSAGE && contactToSend.length) {

                hlprs.toggleButton(button, true);
                status = true;
            } else {

                hlprs.sendMessage('Validation is not passed');
            }

            hlprs.toggleButton(button, status);
        },
        validateSave: function(form, button) {
            var
                data = hlprs.getSubmitData(form),
                status = false;

            if (hlprs.validateNumber(data.NUMBER) && data.NAME) {

                hlprs.toggleButton(button, true);
                status = true;
            } else {

                hlprs.sendMessage('Validation is not passed');
            }

            hlprs.toggleButton(button, status);
        }
    });

    SendHub.AppView = View;
});