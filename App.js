import { StatusBar } from 'expo-status-bar';
import React, { useState, Component, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Button, TouchableOpacity, SectionList } from 'react-native';

const getIntialArray = () => {
  console.log('get initial array was called lazy way');
  return []
}

const getInitialValue = () => {
  console.log('get initial value was called lazy way');
  return 0
}

const ListComponent = () => {
  const [candidateList, setCandidateList] = useState(() => getIntialArray());
  const [selectedId, setSelectedId] = useState(() => getInitialValue());

  useEffect(() => {
    console.log("Something happened")
    
    if (candidateList.length === 0) {
      console.log('Length was 0 and get feed was called');
      fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((json) => {
        let results = []; 
        json.forEach((item) => {
          let result = { name: item.name, id: item.id};
          results.push(result);
        });
        setCandidateList(results)
        setSelectedId(1)
      });
    }
  }, [candidateList]);

  const isSelected = (userId) => { 
    if (userId === selectedId) {
      return "orange"
    } else {
      return "white"
    }
  }

  const handleNext = () =>{
    if (selectedId + 1 <= candidateList.length) {
      setSelectedId(selectedId + 1)
    }
  }

  const handlePrevious = () => {
    if (selectedId - 1 > 0) {
      setSelectedId(selectedId - 1)
    }
  }

  const handleOnPress = (selectedContactId) => {
    setSelectedId(selectedContactId)
  }

  return (
    <SafeAreaView style={styles.container}>
    <FlatList style= {{height: "80%"}}
      data={candidateList}
      renderItem={({ item }) =>
      <TouchableOpacity onPress={() => handleOnPress(item.id)} >
        <View style={{backgroundColor: isSelected(item.id)}}>
          <Text style={{fontSize: 18 }}>{item.name}</Text>
        </View>
      </TouchableOpacity>
      }
      keyExtractor={(item) => item.name.toString()}
    />
    <View style={{flexDirection: "row", alignContent: "center", margin: 12}}>
      <Button title="Prev" onPress={() => {
        handlePrevious();
        }} />
      <Text>{" "+ selectedId + " "}</Text>
      <Button title="Next" onPress={() => {
        handleNext(); 
        }} />
    </View>
  </SafeAreaView>     
  )
}

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
  return (
    <View style={styles.container}>
      <View style= {{height: 40}}></View>
      <Text style={{fontSize: 20, fontWeight: "bold", margin: 12}}>Candidates</Text>
      <ListComponent/>
    </View>

  ) 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
