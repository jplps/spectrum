import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import Dropzone from '../../components/Dropzone';
import Layout from '../../components/Layout';
import api from '../../services/api';

// Declaring interfaces types to use with TS
interface Art {
	id: number;
	name: string;
}

interface Geocode {
	city: string;
	state: string;
}

const Register = () => {
	// Declaring states
	const [formData, setFormData] = useState({
		title: '',
		date: '',
		time: '',
	});

	// Storing a file in a js var: can't be iniciated!
	const [formImg, setFormImg] = useState<File>();

	const [mapPosition, setMapPosition] = useState<[number, number]>([-20.451483, -54.572409]);
	const [labPosition, setLabPosition] = useState<[number, number]>([0, 0]);
	const [geocode, setGeocode] = useState<Geocode>({
		city: '',
		state: '',
	});

	const [arts, setArts] = useState<Art[]>([]);
	const [selectedArts, setSelectedArts] = useState<number[]>([]);

	// Using react-router-dom to redirect user after submit
	const history = useHistory();

	// Map settings
	useEffect(() => {
		// Set map position with user's browser latlng
		navigator.geolocation.getCurrentPosition(position => {
			const { latitude, longitude } = position.coords;

			console.log(position);

			setMapPosition([latitude, longitude]);
		});
	}, []);

	useEffect(() => {
		// Micro service: reverse geolocation - latlng to address - set geocode using nominatim api
		axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${labPosition[0]}&lon=${labPosition[1]}`)
			.then(response => {
				const { city, state } = response.data.address;

				setGeocode({ city, state });
			});

	}, [labPosition]);

	function handleMapClick(e: LeafletMouseEvent) {
		setLabPosition([
			e.latlng.lat,
			e.latlng.lng,
		]);
	}

	// Art List
	useEffect(() => {
		api.get('arts')
			.then(response => setArts(response.data));
	}, []);

	// Input handlers
	function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;

		// Setting [name] we tell the var to be the same as its value, thus substituting whatever comes
		setFormData({
			...formData,
			[name]: value
		});
	}

	function handleSelectedArts(id: number) {
		// findIndex returns 0 or greater if true
		const alreadySelected = selectedArts.findIndex(art_id => art_id === id);

		// Store selected arts
		if (alreadySelected >= 0) {
			const filteredArts = selectedArts.filter(art_id => art_id !== id);

			setSelectedArts(filteredArts);
		}
		else {
			setSelectedArts([...selectedArts, id]);
		}

	}

	// Submit handler
	async function handleSubmit(e: FormEvent) {
		// Send data to create a LAB
		e.preventDefault();

		const { title, date, time } = formData;
		const [latitude, longitude] = labPosition;
		const { city, state } = geocode;
		const arts = selectedArts

		// Global js class FormData allows to send files and stuff
		const data = new FormData();

		data.append('title', title);
		data.append('latitude', String(latitude));
		data.append('longitude', String(longitude));
		data.append('state', state);
		data.append('city', city);
		data.append('date', date);
		data.append('time', time);
		data.append('arts', arts.join(','));

		if (formImg) {
			data.append('image', formImg);
		}

		await api.post('/labs', data);
		alert('LAB created!');

		history.push('/');
	}

	return (
		<Layout>
			<main className="grid">
				<form onSubmit={handleSubmit}>
					<fieldset>
						<legend>
							<p>LABORATORY</p>
						</legend>
						<span>Define title and image</span>

						<Dropzone onUpload={setFormImg} />

						<input type="text" name="title" id="title" placeholder="Title" onChange={handleInputChange} required />
					</fieldset>

					<fieldset>
						<legend>
							<p>ART(S)</p>
						</legend>
						<span>Select expression category(ies)</span>

						<ul>
							{arts.map(art => (
								<li
									key={art.id}
									onClick={() => handleSelectedArts(art.id)}
									className={selectedArts.includes(art.id) ? 'selected' : ''}
								>
									<p>{art.name}</p>
								</li>
							))}
						</ul>
					</fieldset>

					<fieldset>
						<legend>
							<p>LOCATION</p>
						</legend>
						<span>Find on the map and set info</span>

						<Map
							center={mapPosition}
							zoom={15}
							onClick={handleMapClick}
						>
							<TileLayer
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
							/>
							<Marker position={labPosition}>
								<Popup>Here?</Popup>
							</Marker>
						</Map>

						<input type="date" name="date" id="date" onChange={handleInputChange} required />
						<input type="time" name="time" id="time" onChange={handleInputChange} required />
					</fieldset>

					<button type="submit">Submit</button>
				</form>
			</main>
		</Layout>
	)
}

export default Register;