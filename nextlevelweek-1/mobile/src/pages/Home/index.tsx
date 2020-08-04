import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ImageBackground } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

import { AppLoading } from 'expo';
import { Feather as Icon } from '@expo/vector-icons';

import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import api from '../../services/api';

interface IbgeStateResponse {
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

const Home = () => {

    const navigation = useNavigation();
    const [states, setStates] = useState<State[]>([]);
    const [selectedState, setSelectedState] = useState<string>('');
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');

    useEffect(() => {
        api.get<IbgeStateResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const states = response.data.map<State>(estado => {
                    return {
                        initial: estado.sigla,
                        name: estado.nome
                    };
                });
                setStates(states);
            });
    }, []);

    useEffect(() => {

        if (selectedState === '') return;

        api.get<IbgeCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
            .then(response => {
                setCities(response.data.map(city => city.nome));
            });

    }, [selectedState]);


    function handleNavigateToPoints() {
        navigation.navigate('Points', {
                state: selectedState,
                city: selectedCity
            }
        );
    }

    const [fontsLoaded] = useFonts({
        Ubuntu_700Bold, Roboto_400Regular, Roboto_500Medium
    });

    if (!fontsLoaded) {
        return <AppLoading />
    }

    return (
        <ImageBackground
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrar
                pontos de coleta de forma eficiente.</Text>
            </View>

            <RNPickerSelect
                placeholder={{
                    label: 'Selecione o estado',
                    value: ''
                }}
                onValueChange={(value) => setSelectedState(value)}
                items={states.map(state => {
                    return {
                        label: `${state.name} - ${state.initial}`,
                        value: state.initial
                    }
                })}
            />

            <RNPickerSelect
                placeholder={{
                    label: 'Selecione a cidade',
                    value: ''
                }}
                onValueChange={(value) => setSelectedCity(value)}
                items={cities.map(city => {
                    return {
                        label: city,
                        value: city
                    }
                })}
            />

            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={24} />
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 300,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});