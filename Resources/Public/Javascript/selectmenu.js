$(document).ready(function() {
    $( "#selectField" ).on('selectmenuopen', function( event, ui ) {
        var selectedValue = $('#selectField-button').find('.ui-selectmenu-text' ).text();
        $('#selectField-menu').children('li' ).each(function() {
            $(this).show();
            var optionValue = $(this).text();
            if( optionValue == selectedValue ) {
                $(this).hide();
            }
        });
    });
});