export default class UMap {

    static geocode(latLng, callback) {
        let geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({'location': latLng}, (results, status) => {
            if (status === 'OK') {
                let place = results[0];
                if (place) {
                    callback({
                        lat    : place.geometry.location.lat(),
                        lng    : place.geometry.location.lng(),
                        address: place.formatted_address,
                    });
                } else {
                    console.log('No results found');
                    callback(null);
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
                callback(null);
            }
        });
    }

    static libraries = 'visualization,places,geometry';

}