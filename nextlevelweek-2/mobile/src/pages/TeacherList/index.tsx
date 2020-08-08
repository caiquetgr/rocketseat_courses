import React, {useCallback, useState} from 'react';
import {ScrollView, Text, TextInput, View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import AsyncStorage from "@react-native-community/async-storage";

import styles from './styles';
import PageHeader from "../../components/PageHeader";
import TeacherItem, {Teacher} from "../../components/TeacherItem";
import {BorderlessButton, RectButton} from "react-native-gesture-handler";
import api from "../../services/api";
import {useFocusEffect} from '@react-navigation/native';

function TeacherList() {

    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [teachers, setTeachers] = useState([]);

    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    function loadFavorites() {
        AsyncStorage.getItem('favorites')
            .then(response => {
                if (response) {
                    const favoritedTeachersIds = JSON.parse(response)
                        .map((teacher: Teacher) => teacher.id);
                    setFavorites(favoritedTeachersIds);
                }
            });
    }

    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [])
    );

    function handleToggleFilterVisible() {
        setIsFilterVisible(!isFilterVisible);
    }

    async function handleFilterSubmit() {
        loadFavorites();
        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time
            }
        });

        setIsFilterVisible(false);
        setTeachers(response.data);
    }

    return (
        <View style={styles.container}>
            <PageHeader
                title="Proffys disponíveis"
                headerRight={
                    <BorderlessButton
                        rippleColor="#8257e5"
                        style={styles.headerButton}
                        onPress={handleToggleFilterVisible}
                    >
                        <Feather name="filter" size={20} color="#FFF"/>
                    </BorderlessButton>
                }
            >
                {isFilterVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Qual a matéria?"
                            value={subject}
                            onChangeText={text => setSubject(text)}
                            placeholderTextColor="#c1bccc"
                        />

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Qual o dia?"
                                    value={week_day}
                                    onChangeText={text => setWeekDay(text)}
                                    placeholderTextColor="#c1bccc"
                                />
                            </View>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Qual o horário?"
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                    placeholderTextColor="#c1bccc"
                                />
                            </View>
                        </View>

                        <RectButton
                            style={styles.submitButton}
                            onPress={handleFilterSubmit}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>

                    </View>
                )}
            </PageHeader>

            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return <TeacherItem
                        key={teacher.id}
                        teacher={teacher}
                        favorited={favorites.includes(teacher.id)}
                    />
                })}

            </ScrollView>
        </View>
    );
}

export default TeacherList;
