mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates,
    zoom: 9,
});
map.on('load', () => {
    map.flyTo({
        center: listing.geometry.coordinates,
        zoom: 12,
        speed: 1.2,
        curve: 1,
        easing(t) {
            return t;
        }
    });

    new mapboxgl.Marker({ color: "red" })
        .setLngLat(listing.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 10 })
                .setHTML(`<h5>${listing.location}</h5><p>Location provided after booking!</p>`)
        )
        .addTo(map);
});
