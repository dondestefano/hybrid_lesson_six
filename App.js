import { StatusBar } from 'expo-status-bar';
import React, { useState, Component, PureComponent } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Button, TouchableOpacity } from 'react-native';

class ListComponent extends Component {
  state = {
    selected: 0,
    list: [],
  };

  fetchFeed() {
    fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((json) => {
      let dataResults = [];
      json.forEach((item) => {
        let result = { name: item.name, id: item.id};
        dataResults.push(result);
      });
      this.setState ({ list: dataResults, selected: dataResults[0].id })
    });
  }

  componentDidMount() {
    this.fetchFeed();
  }

  isSelected(userId) {
    if (userId === this.state.selected) {
      return "orange"
    } else {
      return "white"
    }
  }

  handeleOnPress(selectedContactId) {
    this.setState({selected: selectedContactId})
  }

  handleNext(){
    if (this.state.selected + 1 <= this.state.list.length) {
      this.setState(
        (prevState) => ({ selected: prevState.selected + 1 })
      )
    }
  }

  handlePrevious() {
    if (this.state.selected - 1 > 0) {
      this.setState(
        (prevState) => ({ selected: prevState.selected - 1 })
      )
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style= {{height: 40}}></View>
      <FlatList style= {{height: "80%"}}
        data={this.state.list}
        renderItem={({ item }) =>
        <TouchableOpacity onPress={() => this.handeleOnPress(item.id)} >
          <View style={{backgroundColor: this.isSelected(item.id)}}>
            <Text style={{fontSize: 18 }}>{item.name}</Text>
          </View>
        </TouchableOpacity>
    
        }
        keyExtractor={(item) => item.name.toString()}
      />
      <InfoComponent userId={this.state.selected}/>
      <View style={{flexDirection: "row", alignContent: "center"}}>
        <Button title="Prev" onPress={() => {
            this.handlePrevious();
        }} />
        <Text>{" "+ this.state.selected + " "}</Text>
        <Button title="Next" onPress={() => {
            this.handleNext();
          }} />
      </View>
    </SafeAreaView>     
    )
  }
};

class InfoComponent extends Component {
  state = {
    userId: 0,
    userName: "",
    userPhone: "",
    userEmail: ""
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.userId !== this.state.userId;
  }

  componentDidUpdate(props, state) {
    if (this.state.userId !== props.userId) {}
    this.setState({userId: props.userId})
    this.fetchCandidate();
  }

  fetchCandidate() {
    console.log("Fetching candidate")
    fetch(`https://jsonplaceholder.typicode.com/users/${this.state.userId}`)
    .then((response) => response.json())
    .then((json) => {
      this.setState ({ 
        userName: json.name,
        userEmail: json.email,
        userPhone: json.phone,
        userId: json.id
       })
    });
  }

  render() {
    return(
      <View style={{backgroundColor: "grey", margin: 12, width: "80%", height: "16%", justifyContent: "center", alignItems: 'center'}}>
        <Text style={{fontSize: 18}}>{"Name: " + this.state.userName}</Text>
        <Text style={{fontSize: 18}}>{"E-mail: " + this.state.userEmail}</Text>
        <Text style={{fontSize: 18}}>{"Phone: " +this.state.userPhone}</Text>
      </View>
    )
  }
}

export default function App() {
  return <ListComponent/>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
