import { StatusBar } from 'expo-status-bar';
import React, { useState, Component, useEffect } from 'react';
import axios from "axios";
import { StyleSheet, Text, View, SafeAreaView, FlatList, Button, TouchableOpacity, SectionList } from 'react-native';

const getIntialArray = () => {
  console.log('get initial array was called lazy way');
  return []
}

const getInitialValue = () => {
  console.log('get initial value was called lazy way');
  return 1
}

const getInitialString = () => {
  return ""
}

const ListComponent = () => {
  const [candidateList, setCandidateList] = useState(() => getIntialArray());
  const [selectedId, setSelectedId] = useState(() => getInitialValue());

  useEffect(() => {
    console.log("Something happened")
    
    if (candidateList.length === 0) {
      axios.get('https://jsonplaceholder.typicode.com/users')
      .then(function (response) {
        let results = [];
        response.data.forEach((item) => {
          let result = { name: item.name, id: item.id};
          results.push(result);
        });
        setCandidateList(results)
        setSelectedId(1)
      })
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

    <InfoComponent selectedId={selectedId}/>

    <View style={{flexDirection: "row", alignContent: "center", margin: 12}}>
      <Button title="Prev" onPress={() => {handlePrevious();}} />
      <Text>{" "+ selectedId + " "}</Text>
      <Button title="Next" onPress={() => {handleNext();}} />
    </View>
  </SafeAreaView>     
  )
}

const useCurrentCandidate = (selectedId) => {
  const [name, setName] = useState(() => getInitialString())
  const [email, setEmail] = useState(() => getInitialString())
  const [phone, setPhone] = useState(() => getInitialString())

  useEffect(() => {
    //No need for an if statement since useEffect won't run if the value stays the same
    console.log("Fetching candidate")
    //SelectedIf returns an objecy with "selectedId" in it. That's why this looks so dumb.
        axios.get(`https://jsonplaceholder.typicode.com/users/${selectedId.selectedId}`)
        .then((response) => {
            setName(response.data.name)
            setEmail(response.data.email)
            setPhone(response.data.phone)
        });
  }, [selectedId]);
  return [name, phone, email];
};

const InfoComponent = (userId) => {
  const [name, phone, email] = useCurrentCandidate(userId)

  return(
    <View style={{backgroundColor: "grey", margin: 12, padding: 20, width: 350, height: "30%", justifyContent: "center"}}>
      <Text style={{fontSize: 20, fontWeight: "bold", marginBottom:12}}>Candidate info</Text>
      <Text style={{fontSize: 18}}>{"Name: " + name}</Text>
      <Text style={{fontSize: 18}}>{"E-mail: " + email}</Text>
      <Text style={{fontSize: 18}}>{"Phone: " + phone}</Text>
    </View>
  )
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
