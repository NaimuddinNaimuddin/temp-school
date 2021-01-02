import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView, Keyboard, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            emailStatus: false,
            emailErrorMessage: "",
            emailforValue: '',
          

            password: '',
            passwordStatus: false,
            passwordErrorMessage: "",
            passwordForValue: '',

            userName: '',
            userStatus: false,
            userErrorMessage: "",
            userNameForValue: '',
            termStatus: true,

            switchImage1: false,
          
            arradata:[],
            isRemind:false
        }
    }
    Troggle1() {
        this.setState({ switchImage1: !this.state.switchImage1 })

    }
    remind_Data() {
        this.setState({ isRemind: !this.state.isRemind },()=>{
            console.log("Is Remind Data==>",this.state.isRemind)
        })
    }

    nameValidate(userName) {
        this.setState({ userName: userName })
        this.state.userStatus = this.validation(userName).status;
        this.state.userErrorMessage = this.validation(userName).error;
    }
    emailValidate(email) {
        this.setState({ email: email })
        this.state.emailStatus = this.validateEmail(email).status;
        this.state.emailErrorMessage = this.validateEmail(email).error;
    }
    passwordValidate(password) {
        this.setState({ password: password })
        this.state.passwordStatus = this.validatePassword(password).status;
        this.state.PasswordErrorMessage = this.validatePassword(password).error;
    }
    validation(userName) {
        let nameregex = /^[a-zA-Z\-]+$/;
        userName = userName.trim();
        if (userName == "" | userName == undefined | userName == null) {
            return { status: false, error: '*please enter user name' };
        }
        else if (!nameregex.test(userName)) {

            return { status: false, error: '*please enter a valid username', };

        }
        else {
            return { status: true, error: '', valid: true };
        }
    }
    validateEmail(email) {
        let emailregex = /^[A-Z0-9_-]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,3})+$/i;
        email = email.trim();
        if (email == "" | email == undefined | email == null) {
            return { status: false, error: '*please enter email' };
        }
        else if (!emailregex.test(email)) {
            return { status: false, error: '*please enter a valid email' };
        }
        else {
            return { status: true, error: '', valid: true }
        }
    }
    validatePassword(password) {
        let passregex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,20}$/;
        password = password.trim();
        let max = 15,
            min = 7
        if (password === "" || password === undefined || password === null) {
            return { status: false, error: '*please enter password' };
        }
        else if (!passregex.test(password) || password >= min || password <= max) {

            return { status: false, error: `password must be ${min} and ${max}` };
        }
        else {
            return { status: true, error: '' }
        }
    }
  
    validateCompleteData = () => {
        if (this.state.userStatus == true && this.state.emailStatus == true && this.state.passwordStatus == true && this.state.userName != '' && this.state.email != '' && this.state.password != '') {
            this.setState({ termStatus: true })
            alert('log in succefully')

        }
        else {
            alert('invalid')
            this.setState({ termStatus: false })

        }

    }
    validatemain() {
   
        if (this.state.emailStatus) {
            if (this.state.passwordStatus) {
                if (this.state.userStatus) {
                   if(this.state.switchImage1){
                       if(this.state.isRemind){
                        this.storeData()
                    
                       }
                    //    else{
                        //    AsyncStorage.removeItem('user_Details')}
                   }else{alert("*Please Agree to our terms and services.")}
                } else { this.setState({ userStatus: false, userErrorMessage: "*Enter user name." }) }
            } else { this.setState({ passwordStatus: false, PasswordErrorMessage: "*Enter password." }) }
        } else { this.setState({ emailStatus: false, emailErrorMessage: "*Enter email." }) }
       
    }
    termAndConditionValidation() {
        console.log("Email=>", this.state.emailStatus, "Password==>", this.state.passwordStatus, "User Status==>", this.state.userStatus)
        if ((!this.state.emailStatus) || (!this.state.passwordStatus) || (!this.state.userStatus)) {
            if (!this.state.emailStatus) {
                this.setState({
                    emailErrorMessage: '*Required', emailStatus: false, termStatus: false
                })
            } else if (!this.state.passwordStatus) {
                this.setState({
                    PasswordErrorMessage: '*Required', passwordStatus: false, termStatus: false
                })
            } else if (!this.state.userStatus) {
                this.setState({
                    userErrorMessage: '*Required', userStatus: false,
                    termStatus: false
                })
            }
        }
        else {
            this.setState(() => ({
                switchImage1: !this.state.switchImage1,
                emailErrorMessage: '', emailStatus: true,
                PasswordErrorMessage: '', passwordStatus: true,
                userErrorMessage: '', userStatus: true,
            }));
        }
    }
    storeData = async () => {
       
        try {
            let userdata = {
                "email": this.state.email,
                "password": this.state.password,
                "userName": this.state.userName
            }
            console.log("ARRAYDATA===>",userdata);
           await  this.state.arradata.push(userdata)
            console.log("ARRAYDATA===>",this.state.arradata);
            
       
       
            await AsyncStorage.setItem('user_Details',JSON.stringify( this.state.arradata))
           
            alert('data saved successfully.');
            AsyncStorage.getItem('user_Details').then(resp=>{
                console.log("after getting data",resp)
            })

        }
        catch (e) {
            console.log(e);
            alert('Unfortunatelly data not saved.');
        }
    }

    // goData = async () => {
    //    // console.log("arraydata===>",arraydata.length)
    //     var myArray = await AsyncStorage.getItem('user_Details');
    //     console.log("myArray of length===>",myArray.length);
    //     var d = JSON.parse(myArray);
    //     console.log("d of length===>",d.length)
    //     getData.push(d)
    //     console.log("getData====>",getData.length);
    //     // if (d) {
    //     //     this.setState({ email: d.email,password: d.password,userName: d.userName ,isRemind:true,emailStatus:true,passwordStatus:true,userStatus:true})
    //     //     console.log("Email=>",this.state.email,"Password==>",this.state.password,"User NAme==>",this.state.userName)
    //     //     try {
    //     //         value = await AsyncStorage.getItem('user_Details');
    //     //     }
    //     //     catch (e) {
    //     //         console.log(e);
    //     //     }
    //     // } else {
    //     //     console.log("Data not Found.")
    //     // }


    // }
    goData = async () => {
        // AsyncStorage.removeItem("user_Details")
        // var myArray = await AsyncStorage.getItem('user_Details');
        // console.log("My Array of Length==>",myArray.length,"Type of===>",myArray)
        //var d= JSON.parse(myArray);
        //console.log('Length of the getting data d  === >>>',d,"Type==>", typeof(d));
        // getData.push(myArray);
        // console.log('value of getData === >>>',getData);

    }
    async componentDidMount() {
        // AsyncStorage.removeItem("user_Details")
        console.log("Async Store fetch Data ",AsyncStorage.getItem('user_Details'))
        AsyncStorage.getItem('user_Details').then(resp=>{
            console.log("after getting data",resp)
            if(resp!=null){
            this.setState({arradata:JSON.parse(resp)})
            console.log("after getting data",this.state.arradata)}
            else{
                this.setState({arradata:[]})
            }
        })
        try {
            console.log('i m component did mount');
            this.goData();

        } catch (e) {
            console.log(e);
        }
    
    
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: '#d2691e' }}>
                <View style={Styles.container}>
                    <View style={Styles.textContainer}>
                        <Text style={{ fontSize: 80, borderWidth: 25, borderColor: 'green' }}>SignUp</Text>
                    </View>
                    <View style={Styles.inputcontainer}>
                        <TextInput style={Styles.input}
                            underlineColorAndroid="transparent"
                            placeholder="Email"
                            placeholderTextColor="#9a73ef"
                            autoCapitalize="none"
                            onChangeText={(value) => this.emailValidate(value)}

                            value={this.state.email}
                        />
                        <View style={{ width: "60%", height: "5%" }}>
                            <Text style={{ color: 'red' }}>
                                {this.state.emailErrorMessage}
                            </Text>
                        </View>

                        <TextInput style={Styles.input}
                            underlineColorAndroid="transparent"
                            placeholder="Password"
                            placeholderTextColor="#9a73ef"
                            autoCapitalize="none"
                            secureTextEntry={true}
                            maxLength={20}
                            onChangeText={(value) => this.passwordValidate(value)}
                            value={this.state.password}
                        
                        />
                        <View style={{ width: "60%", height: "5%" }}>
                            <Text style={{ color: 'red' }}>
                                {this.state.PasswordErrorMessage}
                            </Text>
                        </View>
                        <TextInput style={Styles.input}
                            underlineColorAndroid="transparent"
                            placeholder="Enter your name"
                            placeholderTextColor="#9a73ef"
                            autoCapitalize="none"
                            onChangeText={(value) => this.nameValidate(value)}
                            value={this.state.userName}
                        />
                        <View style={{ width: "60%", height: "5%" }}>
                            <Text style={{ color: 'red' }}>
                                {this.state.userErrorMessage}
                            </Text>
                        </View>
                        <View style={{marginVertical:10}}>
                            <TouchableOpacity onPress={() => this.termAndConditionValidation()}
                                style={{ flexDirection: 'row' }}
                            >
                                <Image style={{ width: 20, height: 20 }} source={this.state.switchImage1 ? require('./Assert/images/pic1.png') : require('./Assert/images/pic2.png')} />
                                <Text >  I agree to the </Text>
                                <Text style={{ textDecorationLine: 'underline', color: 'green' }}>Term and condition</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                value={this.state.goData}
                                style={Styles.toouchableView}
                                onPress={() => this.remind_Data()}>
                                <Image style={{ width: 20, height: 20, marginTop: 10 }} source={this.state.isRemind == true ? require('./Assert/images/pic1.png') : require('./Assert/images/pic2.png')} />
                                <Text style={{  marginTop: 10, marginLeft: 9 }}>Rememder me</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => this.validatemain()}>
                            <Text style={Styles.submitButtonText}> Submit </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Profile')}>
                            <Text style={Styles.submitButtonText}> Log in  </Text>
                        </TouchableOpacity>

                </View>

            </ScrollView>
        );
    }

}
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',

    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 70,

        backgroundColor: 'yellow'

    },
    toouchableView: {
        flexDirection: 'row'
    },
    input: {
        borderBottomWidth: 2,
        width: 370,
        height: 40
    },
    inputcontainer: {
        marginTop: 50
    },
    submitButtonText: {
        justifyContent: 'center',
        alignSelf: 'center',
        borderWidth: 2,
        marginTop: 30,
        width: 100,
        borderRadius: 12,
        textAlign: 'center',
        fontSize:20

    },
    submitButton: {
        marginLeft: 10,

    }

})