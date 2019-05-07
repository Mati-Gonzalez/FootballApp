import React from 'react';
import { ScrollView, StyleSheet, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import routes from '../constants/Routes';

export default class CountriesSelectionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, searchText: "", countries: [], filteredResults: [],
      error: "",
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    fetch(`${routes.url}?APIkey=${routes.apiKey}&action=get_countries`)
      .then(response => response.json())
      .then(parsedJson => this.setState({ countries: parsedJson, loading: false, filteredResults: parsedJson }))
      .catch(error => this.setState({ error, loading: false }))
  }

  static navigationOptions = {
    title: 'Select a country',
    headerStyle: {
      backgroundColor: 'black'
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontWeight: 'bold',
      color: 'white'
    },
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
      <ScrollView style={styles.container}>
        <SearchBar
          placeholder="Type here..."
          onChangeText={text => this.onChangeTextSearchBar(text)}
          value={this.state.searchText}
        />
        {this.renderData()}
      </ScrollView>
    );
  }

  renderData = () => {
    if (this.state.filteredResults.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={{ textAlign: 'center', fontSize: 20 }}>No data to retrieve</Text>
        </View>
      )
    }

    return (
      <FlatList
        keyExtractor={item => item.country_id}
        data={this.state.filteredResults}
        renderItem={this.renderItem}
      />
    )
  }

  onChangeTextSearchBar = (searchText) => {
    const filtered = this.state.countries.filter(c => c.country_name.includes(searchText));
    this.setState({ filteredResults: filtered, searchText });
  }

  renderItem = ({ item }) => {
    return (
      <ListItem
        title={item.country_name}
        chevron={true}
        bottomDivider
        onPress={() => this.onListItemPress(item)}
      />
    )
  }

  onListItemPress = (item) => {
    const { country_id, country_name } = item;
    this.props.navigation.navigate('Leagues', {
      country_id,
      country_name
    })
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
});
