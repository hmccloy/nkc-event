/**
 * Created with JetBrains PhpStorm.
 * User: EMatthaey
 * Date: 27.08.13
 * Time: 12:31
 * To change this template use File | Settings | File Templates.
 *
 */

$(document).ready(function() {
    function setLatLon(city, form) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': city}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $('#city_latitude').val(results[0].geometry.location.k);
                $('#city_longitude').val(results[0].geometry.location.B);
            }
			window.numPreFilterFormSubmissionMethodsFinished++;
        });
    }

    window.preFilterFormSubmissionMethods.push(function(e) {
		var city = $('.addressAutocomplete').val();
		if(city != '') {
			setLatLon(city, this);
		} else {
			window.numPreFilterFormSubmissionMethodsFinished++;
		}
    });
});