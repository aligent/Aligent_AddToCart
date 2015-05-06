AligentAddToCartExtensions = Class.create({

    initialize: function() {
        // Ajax "Loading" indicator
        document.observe('addToCart:ajaxBegin', this.beginLoading.bind(this));
        document.observe('addToCart:ajaxFinished', this.endLoading.bind(this));

        // Update header on success
        document.observe('addToCart:addComplete', this.personalize.bind(this));

        // Standard Magento form validation before Ajax request is submitted.
        document.observe('addToCart:preAjax', this.magentoValidation.bind(this));

    },

    beginLoading: function(ev) {
        // Show Ajax loading indicator now...
    },

    endLoading: function(ev) {
        // Hide Ajax loading indicator now...
    },

    personalize: function(ev) {
        Event.fire(document, 'personalisationcookie:render');
    },

    magentoValidation: function(ev) {
        // If Magento form validation fails, prevent the form submission.
        if (typeof productAddToCartForm != 'undefined') {
            if (!productAddToCartForm.validator.validate()) {
                ev.memo.allowAjax = false;
            }
        }
    }
});
document.observe('dom:loaded', function() {
    var aligentAjaxExtensions = new AligentAddToCartExtensions();
});
