$(document).ready(function() {
    var viewportWidth = $(window).outerWidth();
    var form = $('.tx-nk-event .event-filter form');

    checkMobileTabs(viewportWidth);

    $(window).resize(function() {
        viewportWidth = $(window).outerWidth();
        checkMobileTabs(viewportWidth);
    });

    function checkMobileTabs(viewportWidth) {
        var filterContainer = $('.event-filter');
        var filterElements = filterContainer.find('.filter-element');

        if( viewportWidth <= 754 ) {
            var tabContainer = $('.mobileTabs');
            var tabs = tabContainer.find('div');
            var activeTab = $('.mobileTabs .active');

            if( activeTab.length == 0 ) {
                form.hide();
            } else {
                var filterType = activeTab.attr('id').replace('tab-', '');
                filterContainer.find('.filter-element').hide();
                filterContainer.find('.filter-element[data-filter="' + filterType + '"]' ).show();
            }

            filterElements.each(function() {
                var filterElement = $(this);
                var filterName = filterElement.data('filter');
                tabContainer.find('#tab-' + filterName).show();

                tabContainer.find('#tab-' + filterName).on('click', function() {
                    form.show();

                    tabs.removeClass('active');
                    $(this).addClass('active');

                    filterElements.hide();
                    filterContainer.find('.filter-element[data-filter="' + filterName + '"]').show();
                });
            });
        } else {
            filterElements.show();
            form.show();
        }
    }
});