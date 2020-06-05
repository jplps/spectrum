import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

import Layout from '../../components/Layout';
import api from '../../services/api';
import { LeafletMouseEvent } from 'leaflet';

interface Lab {
	id: number;
	title: string,
	latitude: number,
	longitude: number
}

const Home = () => {
	const [mapPosition, setMapPosition] = useState<[number, number]>([0, 0]);
	const [markersPositions, setMarkersPositions] = useState<Lab[]>([]);

	async function getLabs(position: [number, number]) {
		const browserLocation = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`)
		const { city, state } = browserLocation.data.address;

		const { data } = await api.get(`/labs?state=${state}&city=${city}`);
		const labs = data;

		const serializedLabsPositions = labs.map((lab: Lab) => {
			return { latitude: lab.latitude, longitude: lab.longitude }
		});

		setMarkersPositions(serializedLabsPositions);
	}

	function handleMapClick(e: LeafletMouseEvent) {
		setMapPosition([
			e.latlng.lat,
			e.latlng.lng,
		]);
	}

	async function setupMap() {
		const positionDidChange = (newMapPosition: [number, number]) => {
			return mapPosition === newMapPosition;
		}

		// Setting map position
		await navigator.geolocation.getCurrentPosition(position => {
			const { latitude, longitude } = position.coords;

			setMapPosition([latitude, longitude]);
		});

		if (positionDidChange(mapPosition)) {
			getLabs(mapPosition);
		}
	}

	useEffect(() => {
		setupMap();
	}, [mapPosition]);

	return (
		<Layout>
			<main className="grid">

				<Map
					center={mapPosition}
					zoom={14}
					onClick={handleMapClick}
				>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
					/>

					{markersPositions.map(marker => (
						<Marker key={marker.id} position={[marker.latitude, marker.longitude]}>
							<Popup>{marker.title}</Popup>
						</Marker>
					))}
				</Map>

				<p>
					We believe that the most important form of expression with the reality
					by humans, is through the form of ART.
					<br />
					<br />
					The human application and physical expression of creativity through skills
					and imagination in order to produce objects, environments and experiences
					IS art.
					<br />
					<br />
					Our vision for the audio-visual events is that they can be displayed as
					ART LABORATORIES, comprehending all forms of human expression. Here you
					can find laboratories scattered all over the world!
				</p>

				<Link to="/register">Register</Link>
			</main>
		</Layout>
	)
}

export default Home;