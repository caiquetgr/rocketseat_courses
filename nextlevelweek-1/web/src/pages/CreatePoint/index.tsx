import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import './styles.css';
import logo from '../../assets/logo.svg';
import api from '../../services/api';
import Dropzone from '../../components/Dropzone';

// array ou objeto: manualmente informar o tipo (useState)

interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IbgeUfResponse {
    sigla: string,
    nome: string
}

interface IbgeCityResponse {
    nome: string;
}

interface State {
    initial: string,
    name: string
}

const CreatePoint = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [state, setState] = useState<State[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const [selectedState, setSelectedState] = useState<string>('0');
    const [selectedCity, setSelectedCity] = useState<string>('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedMapPosition, setSelectedMapPosition] = useState<[number, number]>([-23.6245327, -46.7025134]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setSelectedMapPosition([latitude, longitude]);
        });
    }, []);

    useEffect(() => {
        api.get('items').then(response => setItems(response.data));
    }, []);

    useEffect(() => {
        api.get<IbgeUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const states = response.data.map<State>(estado => {
                    return {
                        initial: estado.sigla,
                        name: estado.nome
                    };
                });
                setState(states);
            })
    }, []);

    useEffect(() => {
        if (selectedState === '0') return;

        api.get<IbgeCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
            .then(response => {
                setCities(response.data.map(city => city.nome));
            });

    }, [selectedState]);

    function handleSelectedState(event: ChangeEvent<HTMLSelectElement>) {
        const selectedState = event.target.value;
        setSelectedState(selectedState);
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        const selectedCity = event.target.value;
        setSelectedCity(selectedCity);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedMapPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        // copia os valores por ...formData e decide novos valores no próximo parametro
        setFormData({ ...formData, [name]: value });
    }

    function handleSelectItem(id: number) {

        if (selectedItems.findIndex(item => item === id) >= 0) {
            setSelectedItems(selectedItems.filter(item => item !== id))
        } else {
            // reaproveita o que já tinha em selecteditems e adiciona o id novo
            setSelectedItems([...selectedItems, id]);
        }

    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const [latitude, longitude] = selectedMapPosition;

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', selectedItems.join(','));
        data.append('city', selectedCity);
        data.append('state', selectedState);

        if (selectedFile) {
            data.append('image', selectedFile);
        }

        await api.post('points', data);

        history.push('/');

    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>

                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={selectedMapPosition} zoom={14} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedMapPosition}>

                        </Marker>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="state">Estado (UF)</label>
                            <select
                                name="state"
                                id="state"
                                value={selectedState}
                                onChange={handleSelectedState}
                            >

                                <option key="0" value="0">Selecione uma UF</option>
                                {
                                    state.map(uf => {
                                        return (
                                            <option key={uf.initial} value={uf.initial}>{uf.initial} - {uf.name}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                name="city"
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectedCity}
                            >
                                <option key="0" value="0">Selecione uma cidade</option>
                                {
                                    cities.map(city => (<option key={city} value={city}>{city}</option>))
                                }
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {
                            items.map(item => (
                                <li
                                    key={item.id}
                                    onClick={() => handleSelectItem(item.id)}
                                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                                >
                                    <img src={item.image_url} alt="Teste" />
                                    <span>{item.title}</span>
                                </li>
                            ))
                        }

                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div >
    )
}

export default CreatePoint;