import React from 'react'
import { StyleSheet, Text, 
        View, Picker, Image,
        Dimensions, Button, 
        Slider, FlatList,
        TouchableHighlight,
        Animated, TouchableOpacity, 
        ActivityIndicator} from 'react-native'
import { connect } from 'react-redux'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';

import Header from './Header'
import { setRegion, getDataAPI, setRadius, setLoading } from '../actions/RegionActions'
import List from './List'

let { width, height, height: windowHeight } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE = 6.17511 //  anggep aja Jakarta 
const LONGITUDE = 106.8650395 // //  anggep aja Jakarta
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
// const CARD_HEIGHT = height / 4
// const CARD_WIDTH = CARD_HEIGHT - 50


class Maps extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      selectedRadius: 0
    }
  }

  componentWillMount() {
    console.log('did mount')
    navigator.geolocation.getCurrentPosition(
      position => {
          dataRegion = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        this.props.setRegion(dataRegion)

      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
  }

  changeLabelRadius(radius) {
    // this.setState({
    //   selectedRadius: radius
    // })
    this.props.setRadius(radius)
    console.log('state radius di change label', this.state.selectedRadius)
  }


  functionAA (region) {
    console.log('aa')
    this.props.setRegion(region)
  }

  changeLoading () {
    this.props.setLoading(!this.props.loading)
  }

  getNews () {
    this.changeLoading()
    console.log('click on Update Button')
    var dataFromMaps = {
      lat: this.props.regional.latitude,
      lng: this.props.regional.longitude,
      radius: this.props.selectedRadius / 1000
    }
    this.props.getDataAPI(dataFromMaps)
  }
  
  _findMe () {
    console.log('find me unnnnnnnnch')
    navigator.geolocation.getCurrentPosition(
      position => {
          dataRegion = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        this.props.setRegion(dataRegion)
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
  }

  _onPress() {
    console.log('_onPress')
  }

  _onLongPress(region) {
    console.log('_onLonggggggggPress', region)
    // this.props.setRegion(region)
  }

  render() {
    const { navigate } = this.props.navigation
    const buttonCurrent = windowHeight - 418
    const hitSlop = {
      top: 15,
      bottom: 15,
      left: 15,
      right: 15,
    }
    bbStyle = function(vheight) {
      return {
        position: 'absolute',
        top: '26%',
        left: 10,
        backgroundColor: 'transparent',
        zIndex: 9
      }
    }
    return (
      <View style ={styles.container}>
      <Header />
        <View style={bbStyle(buttonCurrent)}>
          <TouchableOpacity
            hitSlop = {hitSlop}
            style={styles.mapButton}
            onPress={ () => this._findMe() }>
              <Image 
                source={require('../assets/images/current-position.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.counter}>
          <TouchableHighlight onPress={() => navigate('NewsList')} >
            <Text>{this.props.accidents.accidents.length} list</Text>
          </TouchableHighlight>
        </View>
        <MapView
          provider={ PROVIDER_GOOGLE }
          style={ styles.map }
          showsUserLocation={ true }
          region={ this.props.regional }
          showsTraffic={true}
          zoomEnabled={true}
          moveOnMarkerPress={false}
          onPress={() => this._onPress()}
          onLongPress={() => this._onLongPress()}
          onRegionChangeComplete={ region => this.functionAA(region) }
          >
          <MapView.Marker draggable
            title={'Drag Me'}
            image={require('../assets/images/marker-maps.png')}
            coordinate={ this.props.regional }
            onPress={e => console.log(e.nativeEvent)}
            onDragEnd={e => console.log('drag end', e.nativeEvent)}
          />
          <MapView.Circle
            center={{latitude: this.props.regional.latitude, longitude: this.props.regional.longitude}}
            radius={this.props.selectedRadius}
            fillColor="rgba(0, 0, 0, 0.2)"
            strokeColor="rgba(0, 0, 0, 0.2)"/>
          {this.props.accidents.markers.map((data, idx) => {
            return (
              <MapView.Marker key = {idx}
                title = {data.title}
                coordinate = {data.coordinates}
                image={require('../assets/images/rsz-icon-crash.png')}>
                <Animated.View style={[styles.ring]} />
              </MapView.Marker>
            )
          })}
        </MapView>
        {this.props.loading &&
          <View style={styles.loading}>
            <WaveIndicator color='#FF972E' size={100} />
          </View>}
        <List />
        <View style={styles.footerWrap}>
          <Slider
            style={styles.slider}
            value={0}
            minimumValue={0}
            maximumValue={10000}
            step={1000}
            onValueChange={(radius) => this.props.setRadius(radius)} />
          <Text style={styles.radiusText}> {this.props.selectedRadius / 1000 } KM </Text>
          <Button 
            style={styles.buttonUpdate}
            onPress={() => this.getNews()}
            title="Update"
            color="#1B3E66" />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  compassStyle:{
    left: 10,
  },
  footerWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute', 
    bottom: 0, 
    backgroundColor: 'rgba(255,255,255, 0.9)',
    width: '100%',
    paddingBottom: 0, 
    paddingLeft: '2%',
    alignItems: 'center'
  },
  slider: {
    flex: 1,
    borderColor: 'blueviolet',
  },
  radiusText:{
    paddingLeft: 2,
    width: 50,
    paddingBottom: 0,
  },
  // ring: {
  //   width: 24,
  //   height: 24,
  //   borderRadius: 12,
  //   backgroundColor: "rgba(130,4,150, 0.3)",
  //   position: "absolute",
  //   borderWidth: 1,
  //   borderColor: "rgba(130,4,150, 0.5)",
  // },
  mapButton: {
    width: 35,
    height: 35,
    borderRadius: 85/2,
    backgroundColor: 'rgba(252, 253, 253, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowRadius: 8,
    shadowOpacity: 0.12,
    zIndex: 10,
  },
  buttonUpdate:{
    padding: 0,
    borderRadius: 0
  },
  counter: {
    width: '30%',
    top: 150,
    left: '65%',
    height: 35,
    borderRadius: 85/2,
    backgroundColor: 'rgba(255, 151, 46, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowRadius: 3,
    shadowOpacity: 0.1,
    zIndex: 10,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const mapStateToProps = state => {
  console.log('bawahnya all state', state.HeaderReducer.regional)
  return {
    regional: state.HeaderReducer.regional,
    accidents: state.HeaderReducer.accidents,
    selectedRadius: state.HeaderReducer.selectedRadius,
    loading: state.HeaderReducer.loading,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setRegion: (region) =>  dispatch(setRegion(region)),
    getDataAPI: (dataFromMaps) => dispatch(getDataAPI(dataFromMaps)),
    setRadius: (radius) => dispatch(setRadius(radius)),
    setLoading: (loading) => dispatch(setLoading(loading))
  }
} 

export default connect(mapStateToProps, mapDispatchToProps)(Maps)

// onPress={() => navigate('NewsList')}
// {this.props.accidents.accidents.length}


// onValueChange={(radius) => this.changeLabelRadius(radius)}
// scrollView: {
//   position: "absolute",
//   bottom: 30,
//   left: 0,
//   right: 0,
//   paddingVertical: 10,
// },
// endPadding: {
//   paddingRight: width - CARD_WIDTH,
// },
// card: {
//   padding: 10,
//   elevation: 2,
//   backgroundColor: "#FFF",
//   marginHorizontal: 10,
//   shadowColor: "#000",
//   shadowRadius: 5,
//   shadowOpacity: 0.3,
//   shadowOffset: { x: 2, y: -2 },
//   height: CARD_HEIGHT,
//   width: CARD_WIDTH,
//   overflow: "hidden",
// },
// cardImage: {
//   flex: 3,
//   width: "100%",
//   height: "100%",
//   alignSelf: "center",
// },
// textContent: {
//   flex: 1,
// },
// cardtitle: {
//   fontSize: 12,
//   marginTop: 5,
//   fontWeight: "bold",
// },
// cardDescription: {
//   fontSize: 12,
//   color: "#444",
// },
// markerWrap: {
//   alignItems: "center",
//   justifyContent: "center",
// },
// marker: {
//   width: 8,
//   height: 8,
//   borderRadius: 4,
//   backgroundColor: "rgba(130,4,150, 0.9)",
// },
// ring: {
//   width: 24,
//   height: 24,
//   borderRadius: 12,
//   backgroundColor: "rgba(130,4,150, 0.3)",
//   position: "absolute",
//   borderWidth: 1,
//   borderColor: "rgba(130,4,150, 0.5)",
// },