
AligentAjaxAddToCartEnabler = Class.create({
    ev: null,
    clickedSubmit: null,

    initialize: function(selector, container) {
        this.selector = selector;
        if (typeof container != 'undefined') {
            this.container = container;
        } else {
            this.container = document;
        }
        this.bindEvents();
    },

    bindEvents: function() {
        this.container.select(this.selector).invoke('observe', 'click', this.onSubmit.bind(this));
    },

    onSubmit: function(ev, dummy, overrideForm) {
        ev.preventDefault();

        this.ev = ev;
        this.clickedSubmit = ev.element();

        var eventData = {
            allowAjax: true,  // Allow the event to stop the Ajax submit (e.g. because of a validation fail)
            buttonClicked: this.clickedSubmit
        };

        Event.fire(document, 'addToCart:preAjax', eventData);

        if (!eventData.allowAjax){
            ev.preventDefault();
            return false;
        }

        this.clickedSubmit.addClassName('loading');

        if (typeof overrideForm == 'undefined') {
            this.form = ev.target.up('form');
        } else {
            this.form = overrideForm;
        }

        // The event target might override the URL to submit the request to.
        // DYOC does this for quickshop for example.
        var overrideSubmitUrl = ev.target.readAttribute('data-submiturl');
        if (overrideSubmitUrl != null) {
            this.form.writeAttribute('action', overrideSubmitUrl);
        }

        document.fire('addToCart:ajaxBegin');

        this.form.request({
            onComplete: function(response) {
                document.fire('addToCart:ajaxFinished');
                this.clickedSubmit.removeClassName('loading');
                try {
                    var aResponse = JSON.parse(response.responseText);
                    if (aResponse.success != 'true') {
                        this.form.submit()
                    } else {
                        document.fire('addToCart:addComplete', aResponse);
                        return false;
                    }
                } catch (e) {
                    this.form.submit()
                }
            }.bind(this)
        });
    }
});
