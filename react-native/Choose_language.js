import React, { Component } from 'react';
import { StyleSheet, Image, TouchableOpacity, Text, View, Dimensions, ImageBackground, Modal } from 'react-native';
import { dynamicSize, getFontSize } from '../assets/dynamicSize';
import { checkImage, uk_flag, thai_flag, scooter, NotePad_Image } from '../assets/icon';
const { width, height } = Dimensions.get('window')

export default class Choose_language extends Component {
  state = {
    modalVisible: false,
  };
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (

      <View style={styles.container}>
        <View>
          <Image source={scooter} style={{ height: height / dynamicSize(2), width: width }} />

        </View>


        <View style={{ marginVertical: dynamicSize(25), alignSelf: 'center' }}>

          <Text style={{fontWeight:'500',  fontSize: getFontSize(17),color:'#272915'}}> Please choose your language...</Text>
        </View>


        <View style={{
          borderBottomColor: '#d3d3d3', borderBottomWidth: dynamicSize(0.8),
          marginHorizontal: dynamicSize(22), 
        }}>

        </View>



        <View style={{
          flexDirection: 'row', width: Platform.OS == "ios" ? width - dynamicSize(110) : width - dynamicSize(100), justifyContent: 'space-between',
          marginVertical: dynamicSize(50), alignSelf: 'center'
        }}>
          <TouchableOpacity
            onPress={() => {
              this.setModalVisible(true)
            }}>

            <ImageBackground source={uk_flag} style={styles.Image2} resizeMode='contain'>
              <Image source={checkImage} style={{ width: dynamicSize(40), height: dynamicSize(40), alignSelf: 'flex-end' }} resizeMode='contain' />
            </ImageBackground>

          </TouchableOpacity>

          <TouchableOpacity

          >
            <Image source={thai_flag} style={styles.Image2} resizeMode='contain' />
          </TouchableOpacity>
        </View>

        {/* ---------------------------------------Modal start------------------------------- */}

        <Modal visible={this.state.modalVisible} transparent={true}>
          <View style={{ flex: 1, backgroundColor: 'rgba(35, 54, 18, 0.8)' }} >
            <View
              style={{
                justifyContent: 'center',
                width: '75%',
                height: height / 3.4,
                backgroundColor: 'white',
                borderRadius: 5,
                top: dynamicSize(200),
                alignSelf: 'center',
                justifyContent: 'space-between'
              }}>
              <View style={{ justifyContent: 'space-between',}}>
                <View style={{marginVertical:dynamicSize(15)}}>
                <Text style={{ color: '#000000', fontSize: getFontSize(17), textAlign: 'center', fontWeight: Platform.OS == "ios" ? '400' : "bold", }}>
                  We would like to send push Notifications
                  </Text>
                  </View>
            <View style={{justifyContent:'center'}}>

            <Text style={{ color: '#101010', fontSize: getFontSize(16), textAlign: 'center', fontWeight: '200', }}>
                  Notifications may include alerts, sound & icon badges. These can be configured in settings.
                  </Text>
            </View>

              </View>
              <View style={{
                flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopColor: '#848786'
                , borderTopWidth:0.6,margin:dynamicSize(5), height: dynamicSize(60), marginTop:dynamicSize(13)
              }}>

                <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate('SetLocation'),
                  this.setModalVisible(!this.state.modalVisible)
                }}>
                  <Text style={{
                    fontSize: getFontSize(16),
                    fontWeight: '700', color: '#689138', overflow: 'hidden',
                    textAlign: 'center',
                  }} >Don't Allow</Text>
                </TouchableOpacity>

                <View style={{ margin:dynamicSize(2),borderRightColor: '#848786', borderRightWidth: 0.6, height: dynamicSize(50) }}></View>

                <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate('SetLocation'),
                  this.setModalVisible(!this.state.modalVisible)
                }} >
                  <Text style={{
                    fontSize: getFontSize(16),
                    fontWeight: '700', color: '#689138', overflow: 'hidden',
                    //height: dynamicSize(40),
                    width: dynamicSize(100), textAlign: 'center',
                  }}>OK</Text>

                </TouchableOpacity>

              </View>
            </View>
          </View>
        </Modal>

        {/* <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        alert('Modal has been closed.');
                    }}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(122, 122, 122,0.5)', justifyContent: 'center', 
                    borderRadius: dynamicSize(15),}}>
                    <View style={{

                        borderRadius: dynamicSize(8),
                       alignSelf:'center',
                        width: width - dynamicSize(70),
                        bottom: 0,
                    
                        backgroundColor: '#ffffff',
                       
                        height: dynamicSize(215),
                        marginHorizontal: dynamicSize(0),
                        // borderRadius: dynamicSize(15),
                        marginVertical: Platform.OS == "ios" ? dynamicSize(30) : dynamicSize(20)
                    }}>
                        <View style={{alignItems:'center',marginVertical:dynamicSize(20)}}>
                        <Text style={{fontSize:dynamicSize(18),textAlign:'center',fontWeight:'500'}}>We would like to send you push Notification</Text>
                        </View>

                        <View style={{marginHorizontal:dynamicSize(12),}}>
                        <Text style={{fontSize:dynamicSize(17),color:'#2a2c2b',textAlign:"center"}}>
                           Notification may include alerts,sounds & icon badges.These can be configured in settings.</Text>
                        </View>

                        <View style={{marginVertical:dynamicSize(10),borderTopColor:'gray',
                        borderTopWidth:1,marginHorizontal:dynamicSize(5)}}>

                         <View style={{marginVertical:dynamicSize(3),flexDirection:'row'}}>
                        <TouchableOpacity
                        onPress={() => {this.props.navigation.navigate('SetLocation'),
                        this.setModalVisible(!this.state.modalVisible)}}
                        
                        style={{height:dynamicSize(50),width:dynamicSize(150),
                     justifyContent:'center',borderRightColor:'gray',borderRightWidth:1}}
                           >
                            <Text style={{fontSize:getFontSize(20),fontWeight:'600',color:'#44681a',textAlign:'center'}}>Don't Allow</Text>
                        </TouchableOpacity>
                    

                  

                        <TouchableOpacity 
                        
                        onPress={() => {this.props.navigation.navigate('SetLocation'),
                  this.setModalVisible(!this.state.modalVisible)}}
                        style={{height:dynamicSize(60),width:dynamicSize(150),justifyContent:'center'}}
                           >
                            <Text style={{fontSize:getFontSize(20),fontWeight:'600',color:'#44681a',textAlign:'center'}}>OK</Text>
                        </TouchableOpacity>
                        </View>
                        </View>
                    </View>
                    </View>

                </Modal> */}


        {/* ---------------------------------------Modal end------------------------------- */}
        {/* <TouchableOpacity onPress={() => {this.props.navigation.navigate('SetLocation'),
                   this.setModalVisible(!this.state.modalVisible)}} style={{}}
                   >
               <View style={{justifyContent:'center',alignItems:'center'}}>
                  <Text style={{textAlign:"center",height:dynamicSize(30),
                  borderWidth:dynamicSize(1),width:width/dynamicSize(2.5)}}>Don't Allow</Text>
                  </View>
                  </TouchableOpacity> 

                  <TouchableOpacity onPress={() => {this.props.navigation.navigate('SetLocation'),
                  this.setModalVisible(!this.state.modalVisible)}} style={{}}>    
                 
                  <Text style={{textAlign:"center",height:dynamicSize(30),borderWidth:dynamicSize(1),
                  width:width/dynamicSize(2.7)}}>Ok</Text>
                  </TouchableOpacity>  */}
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  container2: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(8, 38, 11, 0.8)",
    alignItems: 'center',
  },
  Image2: {
    height: dynamicSize(110),
    width: dynamicSize(110),
  },

});
