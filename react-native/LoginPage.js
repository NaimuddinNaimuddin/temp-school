import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView, Keyboard, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';



export default class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Email: '',
            Password: '',
            myData: [],
            status1: false,
        }
    }
    handleEmail = (text) => {
        this.setState({ Email: text })
    }
    handlePassword = (text) => {
        this.setState({ Password: text })
    }
    fetchData = () => {
        AsyncStorage.getItem('user_Details').then(resp => {
            console.log("after getting data", resp)
            if (resp != null) {

                this.setState({
                    myData: JSON.parse(resp)
                }, () => {
                    console.log("My set Data==>?", this.state.myData, "TYpe=>", typeof (this.state.myData))
                })
            }


        })

    }

    

    submitFunction() {
        // console.log('hello')
        for (var i = 0; i < this.state.myData.length; i++) {
            // console.log("console==>",this.state.myData[i].email==this.state.Email,this.state.myData[i].email,this.state.Email)           
            if (this.state.myData[i].email == this.state.Email) {
                this.state.status1 = true;
                this.passwordChecking(i)
                break;
            }
            else {
                this.state.status1 = false;
            }

        }
        if (!this.state.status1) {
            alert('incorrect email')
        }
    }
    passwordChecking(i) {
        if (this.state.myData[i].password == this.state.Password) {
            this.props.navigation.navigate('Home', { ...this.state.myData[i] });
        }
        else {
            alert('incorrect password')
        }
    }
    async componentDidMount() {
        try {
            console.log('i m component did mount');
            this.fetchData()

        } catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.textContainer}>
                        <Text style={{ fontSize: 80, borderWidth: 25, borderColor: 'green' }}>  Login</Text>
                    </View>
                    <View style={styles.textInputView}>
                        <TextInput
                            style={{ borderBottomWidth: 2, marginTop: 40, fontSize: 20 }}
                            underlineColorAndroid="transparent"
                            placeholder="Enter name"
                            placeholderTextColor="#9a73ef"
                            autoCapitalize="none"
                            onChangeText={(text) => { this.handleEmail(text) }}
                        />
                        <TextInput
                            style={{ marginTop: 40, fontSize: 20 }}
                            underlineColorAndroid="transparent"
                            placeholder="Password"
                            placeholderTextColor="#9a73ef"
                            autoCapitalize="none"
                            onChangeText={(text) => { this.handlePassword(text) }}
                        />
                    </View>
                    <View style={{ marginTop: 50, borderWidth: 1, width: 300, justifyContent: 'center', borderRadius: 15, backgroundColor: 'cadetblue' }}>
                        <TouchableOpacity
                            style={{ marginTop: 0 }}
                            onPress={() => this.submitFunction()}>
                            <Text style={styles.submitButtonText}> Submit </Text>
                            {/* this.props.navigation.navigate() */}
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 50, borderWidth: 1, width: 300, marginLeft: 0, justifyContent: 'center', borderRadius: 15, backgroundColor: 'cadetblue' }}>

                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('signup')}>
                            <Text style={styles.submitButtonText}>Signup </Text>
                            {/* this.props.navigation.navigate() */}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',

    },
    textInputView: {
        width: 300,
        borderBottomWidth: 2,
        marginTop: 70
    },
    submitButtonText: {
        textAlign: 'center',
        fontSize: 20,
        color:'white'
    }
})