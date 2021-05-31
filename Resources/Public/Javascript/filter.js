
function setSelectedInputValue(element, inputFieldId, itemClassName, valuePrefix, forceSelect) {
    forceSelect = forceSelect !== 'undefined' ? forceSelect : false;

    var elementClasses = $(element).attr('class');
    var inputElement = $(inputFieldId);

    $(inputElement).val('');
    $('.' + itemClassName + '.active').not($(element)).toggleClass('active');

    if(forceSelect) {
        if (!$(element).hasClass('active')) {
            $(element).addClass('active');
        }
    } else {
        $(element).toggleClass('active');
    }

    if ($(element).hasClass('active')) {
        var matches = elementClasses.match(valuePrefix + '\\S*');
        var selectedValue = '';
        if(matches) {
            selectedValue = matches[0].replace(valuePrefix, '');
        }
        $(inputElement).val(selectedValue);
    }
}

function clearLocationInputs() {
    $('#institutionLocationInput').val(0);
    $('#eventLocationInput').val(0);
}

function changeCityValueAfterLocationChanges(locationElement) {
    var locationWrapperClass = $(locationElement).parents('.locations').attr('class');
    var cityIdentifierClass = locationWrapperClass.replace('locations', '').trim();
    var cityElement = $('.cities').find('.' + cityIdentifierClass).find('.cityValue');
    setSelectedInputValue(cityElement, '#cityInput', 'cityValue', 'cityname-', true);
    $(locationElement).parents('form').submit();
}

$(document).ready(function () {
    $('.submit-city').on('click', function () {
        $(this).parents('form').submit();
    });


    // OPEN/CLOSE FILTERS
    $('.dropdown-wrapper').each(function () {
        var wrapper = $(this);
        var label = $(wrapper).find('.dropdown-label');

        $(label).on('click', function () {
            var activeDropdown = $('.dropdown-wrapper.active');
            $(activeDropdown).not($(wrapper)).find('.dropdown-content').slideToggle();
            $(activeDropdown).not($(wrapper)).toggleClass('active');

            var content = $(wrapper).find('.dropdown-content');
            $(content).slideToggle();
            $(wrapper).toggleClass('active');
        });
    });


    // FILTER FORM VALUES
    $('.dateValue').each(function () {
        $(this).on('click', function () {
            var dateElement = $(this);
            var dateClasses = $(dateElement).attr('class');
            var re = new RegExp('-', 'g');

            var dateFrom = dateClasses.match('dateFrom\\S*');
            dateFrom = dateFrom[0].replace('dateFrom_', '').replace(re, '.');
            $('#dateFrom').val(dateFrom).trigger('change');

            var dateTo = dateClasses.match('dateTo\\S*');
            dateTo = dateTo[0].replace('dateTo_', '').replace(re, '.');
            $('#dateTo').val(dateTo).trigger('change');
            $(dateElement).parents('form').submit();
        });
    });

    $('ul.cities').find('li').each(function() {
        var listElement = $(this);

        $(listElement).on('mouseover', function() {
            var classNames = listElement.attr('class');
            if( classNames ) {
                var cityClassName = classNames.match('citynumber-\\S*');
                var identifier = cityClassName[0].replace('citynumber-', '');
                $('.locations').not('.citynumber-' + identifier).hide();
                $('.locations.citynumber-' + identifier).show();
            } else {
                $('.locations').hide();
            }
        });

        $(listElement).parents('.dropdown-content').on('mouseleave', function() {
            $('.locations').hide();
        });
    });

    $('.cityValue').each(function () {
        var cityElement = $(this);
        $(cityElement).on('click', function () {
            setSelectedInputValue(cityElement, '#cityInput', 'cityValue', 'cityname-');

            var activeLocations = $('.location.active');
            if( $(activeLocations).attr('class')) {
                $(activeLocations).attr('class', $(activeLocations).attr('class').replace('active', ''));
                clearLocationInputs();
            }
            $(cityElement).parents('form').submit();
        });
    });

    $('.typeValue').each(function () {
        $(this).on('click', function () {
            var typeElement = $(this);
            setSelectedInputValue(typeElement, '#typeInput', 'typeValue', 'type-');
            $(typeElement).parents('form').submit();
        });
    });

    $('.institutionLocationValue').each(function() {
        $(this).on('click', function() {
            var locationElement = $(this);
            setSelectedInputValue(locationElement, '#institutionLocationInput', 'location', 'location-');
            $('#eventLocationInput').val(0);

            changeCityValueAfterLocationChanges($(locationElement));
        });
    });

    $('.eventLocationValue').each(function() {
        $(this).on('click', function() {
            var locationElement = $(this);
            setSelectedInputValue(locationElement, '#eventLocationInput', 'location', 'location-');
            $('#institutionLocationInput').val(0);

            changeCityValueAfterLocationChanges($(locationElement));
            $(locationElement).parents('form').submit();
        });
    });


    // FACETS
    $('.city-facet').not('.active').each(function() {
        $(this).on('click', function() {
            var facetBlock = $(this);
            var cityName = $(facetBlock).find('.cityName').text();

            $('#parentCityInput').val($('#cityInput').val());
            $('#cityInput').val(cityName);
            $('.event-filter').find('form').submit();
        });
    });

    $('.city-facet.active').find('.close-facet').each(function() {
        $(this).on('click', function() {
            // get parent city and submit form
            var elementClasses = $(this).parents('.facetBlock').attr('class');

            var matches = elementClasses.match('city-parent-\\S*');
            var selectedValue = '';
            if(matches) {
                selectedValue = matches[0].replace('city-parent-', '');
            }

            clearLocationInputs();
            $('#cityInput').val(selectedValue);
            $('.event-filter').find('form').submit();
        });
    });


    $('.category-facet').not('.active').each(function(){
        $(this).on('click', function() {
            var facetBlock = $(this);
            var elementClasses = $(facetBlock).attr('class');

            var matches = elementClasses.match('category-uid-\\S*');
            var selectedValue = '';
            if(matches) {
                selectedValue = matches[0].replace('category-uid-', '');
            }
            $('#typeInput').val(selectedValue);
            $('.event-filter').find('form').submit();
        });
    });

    $('.category-facet.active').find('.close-facet').each(function() {
       $(this).on('click', function() {
            // get parent category uid and submit form
           var elementClasses = $(this).parents('.facetBlock').attr('class');

           var matches = elementClasses.match('category-parent-\\S*');
           var selectedValue = '';
           if(matches) {
               selectedValue = matches[0].replace('category-parent-', '');
           }

           clearLocationInputs();
           $('#typeInput').val(selectedValue);
           $('.event-filter').find('form').submit();
       });
    });


    // AUTOCOMPLETE
    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _create: function () {
            this._super();
            this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
        },
        _renderMenu: function (ul, items) {
            var that = this,
                currentCategory = "";
            $.each(items, function (index, item) {
                var li;
                if (item.category != currentCategory) {
                    ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                    currentCategory = item.category;
                }
                li = that._renderItemData(ul, item);
                if (item.category) {
                    li.attr("aria-label", item.category + " : " + item.label);
                }
            });
        },
        _renderItem: function(ul, item) {
            var firstChar = this.term.charAt(0);
            var termUpperCase = this.term.replace(firstChar, firstChar.toUpperCase());
            var term = item.label.replace(this.term, "<b>" + this.term + "</b>");
            term = term.replace(termUpperCase, "<b>" + termUpperCase + "</b>");

            return $( "<li>" )
                .attr( "data-value", item.value )
                .append( "<span>" + term + "</span>")
                .appendTo( ul );
        }
    });

    var getAutoCompleteEvents = $('#autoCompleteEventsUrl').attr('href');

    $('#event-sword').catcomplete({
        open: function( event, ui ) {
            var maxWidth = $('.search-phrase').outerWidth();
            $('.ui-autocomplete.ui-widget-content').css('max-width', maxWidth);
        },
        minLength: 3,
        source: function (request, response) {
            $.ajax({
                url: getAutoCompleteEvents,
                dataType: "json",
                data: {
                    sword: request.term,
                    dateFrom: $('#dateFrom').val(),
                    dateTo: $('#dateTo').val(),
                    eventType: $('#typeInput').val(),
                    city: $('#cityInput').val(),
                    eventLocation: $('#eventLocationInput').val(),
                    institutionLocation: $('#institutionLocationInput').val()
                },
                success: function (data) {
                    response(data);
                }
            });
        }
    });

});