import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import routes from '../constants/Routes';

export default class LeaguesSelectionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leagues: [], loading: true, error: ''
        }
    }

    componentDidMount() {
        const country_id = this.props.navigation.getParam('country_id', 'No id');
        this.getData(country_id);
    }

    getData = (country_id) => {
        fetch(`${routes.url}?APIkey=${routes.apiKey}&action=get_leagues&country_id=${country_id}`)
            .then(response => response.json())
            .then(parsedJSON => this.setState({ leagues: parsedJSON, loading: false }))
            .catch(error => this.setState({ error, loading: false }))
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('country_name', 'No name'),
            headerStyle: {
                backgroundColor: 'black'
            },
            headerTintColor: 'white',
            headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white'
            },
        }
    };

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }

        if (this.state.error) {
            return (
                <View style={styles.loadingContainer}>
                    <Text>{this.state.error.message}</Text>
                </View>
            )
        }

        return (
            <ScrollView>
                <FlatList
                    contentContainerStyle={styles.container}
                    keyExtractor={item => item.league_id}
                    data={this.state.leagues}
                    renderItem={this.renderItem}
                    numColumns={2}
                />
            </ScrollView>
        )
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.listItem}>
                <ImageBackground
                    source={require('../assets/images/backImage.jpg')}
                    style={styles.image}
                >
                    <Text style={styles.text}>{item.league_name}</Text>
                </ImageBackground>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    listItem: {
        width: '48%',
        margin: '1%',
        aspectRatio: 1,
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'center',
        overflow: "hidden", //para que la imagen quede debajo de la view
    },
    image: {
        width: '100%',
        height: '100%',
        justifyContent: "center",
    },
    text: {
        textAlign: "center",
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white'
    }
});
