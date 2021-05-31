$(document).ready(function() {
    $.datepicker.setDefaults({'dateFormat': 'dd.mm.yy'});
    var dateFromField = $('#dateFrom');
    var dateToField = $('#dateTo');
    var eventCalendar = $('#calendar');
    var monthEvents =  [];

    /**********************
     * INIT DATEPICKER
     **********************/

    // DateFrom Datepicker
    $('#dateFrom, #dateTo').datepicker({
        regional: 'de',
        onSelect: function ( dateText, inst ) {
            var selectedDate = $.datepicker.formatDate( 'dd.mm.yy', new Date( inst.selectedYear, inst.selectedMonth, inst.selectedDay ) );

            errorCheck();

            prv = +inst.selectedDay;
            eventCalendar.datepicker('setDate', selectedDate);
            eventCalendar.datepicker('refresh');

            getEventsOfMonth( inst.selectedMonth+1, inst.selectedYear );
        }
    });

    // Big Calendar Datepicker
    var cur = -1, prv = -1;
    var ajaxRequestMonth = '';
    eventCalendar.datepicker( {
        regional: 'de',
        inline: true,
        firstDay: 1,
        showOtherMonths: true,
        dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        monthNames: ['Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        onSelect: function ( dateText, inst ) {
            var dateFromVal, dateToVal;
            prv = +cur;
            cur = inst.selectedDay;

            if ( prv == -1 || prv == cur ) {
                prv = cur;
            }

            if( cur > -1 ) {
                if( dateFromField.attr('data-changed') == '0' ) {
                    dateFromVal = $.datepicker.formatDate( 'dd.mm.yy', new Date( inst.selectedYear, inst.selectedMonth, Math.min(prv,cur) ) );
                    dateFromField.val(dateFromVal);
                    dateFromField.attr('data-changed', '1');
                    dateToField.attr('data-changed', '0');
                } else {
                    dateToVal = $.datepicker.formatDate( 'dd.mm.yy', new Date( inst.selectedYear, inst.selectedMonth, inst.selectedDay ) );
                    dateToField.val(dateToVal);
                    dateToField.attr('data-changed', '1');
                    dateFromField.attr('data-changed', '0');
                }
            }
        },
        // marks selected dates
        beforeShowDay: function ( date ) {
            var className = '';

            // date to check
            var checkDay = date.getDate();
            var checkMonth = date.getMonth()+1;
            var checkYear = date.getFullYear();

            if( monthEvents ) {
                if( monthEvents[checkYear] ) {
                    if( monthEvents[checkYear][checkMonth] ) {
                        var iterateEvents = monthEvents[checkYear][checkMonth];

                        for(var prop in iterateEvents) {
                            if(iterateEvents.hasOwnProperty(prop)) {
                                if(iterateEvents[prop] == checkDay) {
                                    className = 'availableEvent';
                                }
                            }
                        }
                    }
                }
            }

            className = highlightSelectedDays(className, date);

            return [true,className];
        }
    } );

    var tempMonth = -1; // default value that never equals a month

    var today = new Date();
    var currentMonth = today.getMonth()+1;
    var currentYear = today.getFullYear();
    getEventsOfMonth( currentMonth, currentYear );

    onChangeMonth( false );

    $('#calendar').bind("DOMNodeInserted", function() {
        onChangeMonth( true );
    });

    /**********************
     * calendar helper functions
     **********************/

    function onChangeMonth( afterLoading ) {
        $('.ui-datepicker-next, .ui-datepicker-prev').on('click', function(e) {
            e.stopPropagation();

            var dateElement = $('#calendar').find('td[data-month]');
            var checkMonth = parseInt( dateElement.data('month') );

            var checkYear = dateElement.data('year');

            if( $(this).hasClass('ui-datepicker-next') ) {
                if(afterLoading) {
                    checkMonth = checkMonth+2;
                }
            } else if( $(this).hasClass('ui-datepicker-prev') && !afterLoading ) {
                checkMonth = checkMonth+1;
            }

            if( checkMonth == 13 ) {
                checkMonth = 1;
                checkYear = checkYear+1;
            } else if( checkMonth == 0 ) {
                checkMonth = 12;
                checkYear = checkYear-1;
            }

            if( tempMonth != checkMonth ) {
                tempMonth = checkMonth;
                getEventsOfMonth( checkMonth, checkYear );
            }
        });
    }

    /**
     * Send AJAX-Request to get the days (of the given month) which contain events
     * If the result is not empty refresh the calendar
     *
     * @param integer checkMonth
     * @param integer checkYear
     */
    function getEventsOfMonth( checkMonth, checkYear ) {
        if( !monthEvents[checkYear] ) {
            monthEvents[checkYear] = {};
        }

        if( !monthEvents[checkYear][checkMonth] ) {
            $.ajax({
                type: "POST",
                url: $('#urlEventDate').attr('href'),
                dataType: "json",
                data: {month: checkMonth, year: checkYear},
                success: function( data ) {
                    if( data ) {
                        checkMonth = checkMonth;
                        if( !monthEvents[checkYear][checkMonth] ) {
                            monthEvents[checkYear][checkMonth] = {};
                            monthEvents[checkYear][checkMonth] = data;
                        }
                    }

                    eventCalendar.datepicker('refresh');
                }
            });
        }
    }

	/**
	 * Highlight selected days by adding a class
	 *
	 * @param className string
	 * @param date Date
	 * @returns string className
	 *
	 */
    function highlightSelectedDays(className, date) {
        var dateInSelectedRange = false;

        var dateFrom = getInputFieldDate(dateFromField);
        var dateTo = getInputFieldDate(dateToField);

        var dateFromTstmp = dateFrom.getTime();
        var dateToTstmp = dateTo.getTime();
        var checkDateTstmp = date.getTime();

        if( dateToField.val() != '' && dateToField.val() != '' ) {
            if( checkDateTstmp >= dateFromTstmp && checkDateTstmp <= dateToTstmp ) {
                dateInSelectedRange = true;
            }
        } else if( dateFromField.val() != '' ) {
            if( checkDateTstmp >= dateFromTstmp ) {
                dateInSelectedRange = true;
            }
        }

        if( dateInSelectedRange ) {
            className += ' date-range-selected';
        }

        return className;
    }

    // check if dateFrom is before dateTo and mark inputFields with errorClass
    function errorCheck() {
        var dateTo = getInputFieldDate(dateToField);
        var dateFrom = getInputFieldDate(dateFromField);

        var dayFrom = dateFrom.getDate();
        var monthFrom = dateFrom.getMonth();
        var yearFrom = dateFrom.getFullYear();

        var dayTo = dateTo.getDate();
        var monthTo = dateTo.getMonth();
        var yearTo = dateTo.getFullYear();

        $(".filter-date input").removeClass('errorDate');
        if( ( monthFrom > monthTo && yearFrom  >= yearTo) || ( monthFrom == monthTo && dayFrom > dayTo ) || yearFrom > yearTo ) {
            $('.filter-date input').addClass('errorDate');
        }
    }

    // returns a date object of the given input-field value
    function getInputFieldDate(element) {
        var dateArray = $(element).val().split('.');
        var dateObject = new Date(dateArray[2], parseInt(dateArray[1])-1, dateArray[0]);

        return dateObject;
    }
});
