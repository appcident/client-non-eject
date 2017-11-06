import React, {Component} from 'react'
import {
    Text, View,
    StyleSheet,
    FlatList, Image,
    Linking, Dimensions,
    TouchableHighlight
} from 'react-native'
import { connect } from 'react-redux'

let { width: windowWidth, height: windowHeight } = Dimensions.get('window')
const slidePosition = windowHeight - 600

class List extends Component {
    
    _onPress (link) {
        console.log('open link')
        Linking.openURL(link)
    }

    render() {
        return (
          <View style={styles.container}>
            <FlatList horizontal
            data={this.props.accidents.accidents}
            renderItem={({item}) => {
                return (
                    <TouchableHighlight onPress={() => {this._onPress(item.accident.linksite)} }>
                        <View style={styles.contentWrap}>
                            <Image
                                style={styles.img}
                                source={{uri: item.accident.imgUrl}} />
                            <Text style={styles.textNews}>{item.accident.title}</Text>
                        </View>
                    </TouchableHighlight>
                )
            }}
            />
          </View>

        )
    }
}

// export default List
const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'absolute', 
        bottom: 58,
        alignItems: 'center'
    },
    contentWrap:{
        backgroundColor: 'red',
        flexDirection: 'row',
        width: windowWidth - 40,
        padding: 10,
        marginLeft: 10,
        marginRight: 10
    },
    img: {
        width: 30,
        height: 50,
        flex: 1,
    },
    textNews: {
        flex: 3,
        paddingLeft: 12,
    }
})

const mapStateToProps = state => {
    console.log('bawahnya all state', state.HeaderReducer.regional)
    return {
        accidents: state.HeaderReducer.accidents
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setRegion: (region) => dispatch(setRegion(region))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List)

