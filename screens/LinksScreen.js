import React from 'react';
import { ScrollView, StyleSheet, FlatList } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import routes from '../constants/Routes';

export default class LinksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchText: "", countries: [] }
  }

  componentWillMount() {
    this.getData();
  }

  getData = () => {
    fetch(`${routes.url}?APIkey=${routes.apiKey}&action=get_countries`)
      .then(response => response.json())
      .then(parsedJson => this.setState({ countries: parsedJson }))
      .catch(error => { })
  }

  static navigationOptions = {
    title: 'Select a country',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <SearchBar
          placeholder="Type here..."
          onChangeText={this.onChangeTextSearchBar}
          value={this.state.searchText}
        />
        <FlatList
          keyExtractor={item => item.country_id}
          data={this.state.countries}
          renderItem={this.renderItem}
        />
      </ScrollView>
    );
  }

  onChangeTextSearchBar = () => {
    const filtered = this.state.countries.filter(c => c.country_name.includes(this.state.searchText));
    console.log(this.state.searchText)
    this.setState({ countries: filtered });
  }

  renderItem = ({ item }) => {
    return (
      <ListItem
        title={item.country_name}
        chevron={true}
        bottomDivider
        onPress={this.onListItemPress}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
