import React, { Component } from 'react';  
import { AppRegistry, FlatList,  
    StyleSheet, Text, View,Alert,TouchableOpacity,ScrollView } from 'react-native';  
  import AsyncStorage from '@react-native-community/async-storage';
export default class FlatForm extends Component {  
    constructor(props){
        super(props);
        this.state={
            myData:[
               
            ]
        }
    }
    renderMyData=({item,index})=>{
        console.log("Item in renderMyData==>",item)
        return(
            <TouchableOpacity style={{ height: 150, backgroundColor: index == 2 ? 'yellow' : 'green' }}
                onPress={() => alert("email==>"+item.email+"password==>"+item.password+"userName==>"+item.userName)}
            >
                <Text style={styles.item}>{"email: "+item.email}</Text>
                <Text style={styles.item}>{"username: "+item.userName}</Text>
                <Text style={styles.item}>{"password:"+item.password}</Text>
            </TouchableOpacity>
        )
    }
renderSeparator=()=>{
    return (
      <ScrollView>  
        <View
        style={{
            height:2,width:"100%",backgroundColor:'#000'
        }}
        >
        

        </View>   
       </ScrollView>  
        );
}
async componentDidMount() {
    try {
        console.log('i m component did mount');
        this.fetchData()

    } catch (e) {
        console.log(e);
    }


}

fetchData=()=>{
    AsyncStorage.getItem('user_Details').then(resp=>{
        console.log("after getting data",resp)
        if(resp!=null)
        {
            this.setState({
                myData:JSON.parse(resp)
            },()=>{
                console.log("My set Data==>?",this.state.myData,"TYpe=>",typeof(this.state.myData))
            })        
        }
        
    })
}
render(){
    return(
        <View styles={styles.container}>
            <FlatList
                data={this.state.myData}
                renderItem={(item, index) => this.renderMyData(item, index)}
                ItemSeparatorComponent={this.renderSeparator}
            />
        </View>
    );
}

}
const styles = StyleSheet.create({  
    container: {  
        flex: 1,  
    },  
    item: {  
        padding: 10,  
        fontSize: 18,  
        height: 44,
        fontSize:20,
        fontWeight:'700'
    },  
})  
  