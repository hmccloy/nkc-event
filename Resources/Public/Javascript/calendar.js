$(document).ready(function() {

    function updateCalendar(requestUri) {

        var $calendarWrapper = $('#calendar-wrapper');

        $.ajax({
            method: 'get',
            dataType: 'html',
            url: requestUri,
            context: this,
            beforeSend: function (jqXHR, textStatus) {
                $calendarWrapper.addClass('loading');
            },
            complete: function (jqXHR, textStatus) {
                $calendarWrapper.removeClass('loading');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $calendarWrapper.removeClass('loading');
            },
            success: function (result) {
                var newSheet = $(result);
                if (newSheet.find('#calendar-wrapper').length) {
                    $calendarWrapper.html(newSheet.find('#calendar-wrapper').html());
                }
            }
        });
    }

    $('.tx-nk-event').on('click', '.prev-month', function() {
        updateCalendar($(this).attr('data-uri'));
    });

    $('.tx-nk-event').on('click', '.next-month', function() {
        updateCalendar($(this).attr('data-uri'));
    });


    $('.tx-nk-event').on('click', '.has-events', function() {
        var currentDate = $(this).attr('data-date');
        window.location.href = '/index.php?id='+nk_event_list_view+'&tx_nkevent_eventintegratedlist[filterValues][dateFrom]=' + currentDate + '&tx_nkevent_eventintegratedlist[filterValues][dateTo]=' + currentDate;
    });
});