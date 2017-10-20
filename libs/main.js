mapboxgl.accessToken =
	'pk.eyJ1IjoieWFycmF2YWxsZXkiLCJhIjoiY2o0YWY2aW9qMGlqMTMzcmwzYXg2YjNmNiJ9.54qEdA2hir0YmS4aEt_0xQ';

if (!mapboxgl.supported()) {
	alert('Your browser does not support Mapbox GL');
} else {
	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v9',
		center: [145.386, -37.656],
		minZoom: 6,
		zoom: 6
	});

	var nav = new mapboxgl.NavigationControl();
	map.addControl(nav, 'bottom-right');

	map.on('load', function () {
		map.addSource('counties', {
			type: 'vector',
			url: 'mapbox://hast.bytvkzrn'
		});

		map.addLayer({
			'id': 'counties',
			'type': 'fill',
			'source': 'counties',
			'source-layer': 'aus-dgr3t0',
			'layout': {
				'visibility': 'visible'
			},
			'paint': {
				'fill-color': 'rgba(200, 100, 240, 0.4)',
				'fill-outline-color': 'rgba(200, 100, 240, 1)'
			}
		}, 'place-city-sm');

		map.addLayer({
			"id": "counties-highlighted",
			"type": "fill",
			"source": "counties",
			"source-layer": "aus-dgr3t0",
			"paint": {
				"fill-outline-color": "#484896",
				"fill-color": "#6e599f",
				"fill-opacity": 0.75
			},
			"filter": ["in", "NAME_2", ""]
		}, 'place-city-sm');

		map.on('click', function (e) {
			var bbox = [
				[e.point.x - 5, e.point.y - 5],
				[e.point.x + 5, e.point.y + 5]
			];
			var features = map.queryRenderedFeatures(bbox, {
				layers: ['counties']
			});

			var filter = features.reduce(function (memo, feature) {
				memo.push(feature.properties.NAME_2);
				return memo;
			}, ['in', 'NAME_2']);

			map.setFilter("counties-highlighted", filter);
		});

		map.on('click', 'counties', function (e) {
			new mapboxgl.Popup()
				.setLngLat(e.lngLat)
				.setHTML(e.features[0].properties.NAME_2)
				.addTo(map);
		});

		map.on('mouseenter', 'counties', function () {
			map.getCanvas().style.cursor = 'pointer';
		});

		map.on('mouseleave', 'counties', function () {
			map.getCanvas().style.cursor = '';
		});

	});

};