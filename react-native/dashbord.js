import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView, Keyboard, Image } from 'react-native';
export default class dashboard extends Component {
  constructor(props)
  {
      super(props)
      this.state={
        name:''
      }
  }
      componentDidMount()
       {
            var namedata=this.props.navigation.state.params
            // namedata=JSON.parse(namedata);
           console.log("namedata===>", this.props.navigation.state.params)

           if(namedata!=null)
           {
            
               this.setState({name:namedata})
           }
       } 
    
    
        render()
        {
            const {navigation} =this.props;
            return (
                <View style={Styles.container}>
                    <Text>Details of All Data</Text>
                    <Text style={{fontSize:20,color:'green'}}>name:{this.state.name.userName}</Text>
                    <Text style={{fontSize:20,color:'green'}}>email:{this.state.name.email}</Text>
                    <Text style={{fontSize:20,color:'green'}}>password:{this.state.name.password}</Text>
                </View>


            );
        }
    }
    const Styles = StyleSheet.create({  
        container: {  
            flex: 1,
            alignItems:'center',
            alignSelf:'center'  
        }, 
      
    })  
      