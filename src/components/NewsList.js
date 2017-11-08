import React, {Component} from 'react'
import {
    Text, View, Modal,
    StyleSheet, Button,
    FlatList, Image,
    Linking, Dimensions,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native'
import {connect} from 'react-redux'

import { setModal } from '../actions/RegionActions'
import ModalStatistic from './ModalStatistic'
let {width: windowWidth, height: windowHeight} = Dimensions.get('window')
const slidePosition = windowHeight - 600

class NewsList extends Component {

  _onPress(link) {
    console.log('open link')
    Linking.openURL(link)
  }

  render() {
    const {goBack} = this.props.navigation
    return (
      <View style={styles.container}>
        <View style={styles.combined}>
            <TouchableOpacity style={styles.buttonBack} onPress={() => goBack()}>
              <Image
                style={styles.imgBack}
                source={require('../assets/images/button-back.png')}/>
              <Text style={styles.titleBack}>Back</Text>
            </TouchableOpacity>
            <View style={styles.titleArea}>
              <Text style={styles.titleFont}>List of Accident on This Area</Text>
            </View>
        </View>

        <FlatList
          data={this.props.accidents.accidents}
          keyExtractor={(item, index) => item._id}
          renderItem={({item}) => {
          return (
            <TouchableHighlight
              onPress={() => {
                this._onPress(item.accident.linksite)
              }}
              key={item._id}>
              <View style={styles.contentWrap} key={item._id}>
                <Image
                  style={styles.img}
                  source={{
                    uri: item.accident.imgUrl
                  }}/>
                <Text style={styles.textNews}>{item.accident.title}</Text>
              </View>
            </TouchableHighlight>
          )
        }}></FlatList>
        <ModalStatistic />
        <TouchableOpacity
          style={styles.statistikButton}
          onPress={() => this.props.setModal(true)}>
          <Text style={styles.textStatis}>Show Statistic</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
// export default List
const styles = StyleSheet.create({
  container: {
      flex: 1,
      marginTop: 30
  },
  contentWrap: {
      backgroundColor: 'rgba(27, 62, 102, 0.8)',
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      borderColor: '#fff',
      width: windowWidth,
      padding: 10
  },
  img: {
      width: 30,
      height: 50,
      flex: 1
  },
  textNews: {
      flex: 3,
      paddingLeft: 12,
      color: '#E8E7EF'
  },
  buttonBack: {
      flex: 1
  },
  titleArea: {
      alignItems: 'center',
      flex: 4
  },
  titleFont: {
      color: '#1B3E66',
      fontSize: 18,
      paddingTop: 5,
      paddingBottom: 10,
      fontWeight: 'bold'
  },
  combined: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingBottom: 5,
      paddingLeft: '4%',
      paddingRight: '4%'
  },
  titleBack: {
      color: '#1B3E66',
      fontSize: 14
  },
  statistikButton: {
      backgroundColor: '#E8E7EF',
      padding: '3%',
      alignItems: 'center'
  },
  textStatis: {
      color: '#FF972E',
      fontSize: 16,
      fontWeight: 'bold'
  }
})

const mapStateToProps = state => {
  console.log('state accident', state.HeaderReducer.accidents)
  return {
    accidents: state.HeaderReducer.accidents, 
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setModal: (setBoolean) => dispatch(setModal(setBoolean))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsList)
