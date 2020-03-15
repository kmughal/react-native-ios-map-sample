import React from 'react'
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  TextInput,
  Button,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native'
import {BlurView, VibrancyView} from '@react-native-community/blur'

import MapView, {Marker, AnimatedRegion, Callout} from 'react-native-maps'

const {width, height} = Dimensions.get('window')

const ASPECT_RATIO = width / height
const LATITUDE = 37.78825
const LONGITUDE = -122.4324
const LATITUDE_DELTA = 0.0922 * 10
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const SPACE = 0.01

const App = () => {
  const [place, setPlace] = React.useState({
    latitude: 40.7128,
    longitude: -73.935242,
    name: 'New York',
  })

  const [search, setSearch] = React.useState('')
  const [searchingPosition, setSearchingPosition] = React.useState(false)

  const searchStopPoint = e => {
    setSearchingPosition(true)
    const url = `https://api.tfl.gov.uk/StopPoint/search/${search}?modes=bus,tube,national-rail,dlr,overground,tflrail,river-bus,tram,cable-car,coach&maxResults=25&faresOnly=false&includeHubs=true&tflOperatedNationalRailStationsOnly=false&app_id=8268063a&app_key=14f7f5ff5d64df2e88701cef2049c804`
    fetch(url)
      .then(result => result.json())
      .then(data => {
        if (data.matches && data.matches.length > 0) {
          const match = data.matches[0]
          setSearchingPosition(false)
          setPlace({
            latitude: match.lat,
            longitude: match.lon,
            name: match.name,
          })
        } else alter('no stop point found!')
      })
  }
  const S = {
    ...place,
    latitudeDelta: 0.01776695509909132,
    longitudeDelta:0.010682286045508249 //0.0421 * .001,
  }
  let marker = React.useRef(null)

  let coordinate = new AnimatedRegion({...place})
  coordinate.timing(S).start()
  if (marker._component) {
    marker._component.animateMarkerToCoordinate(S, 1000)
  }
  return (
    <>
      <View style={{flex: 1}}>
        {searchingPosition && (
          <ActivityIndicator style={{flex: 1}} size='large' color='#0000ff' />
        )}

        <View
          style={{
            flex: 1,
            padding: 20,
            marginTop: 40,
           
          }}>
    
          <Text>Type a place</Text>
          <TextInput
            onChangeText={text => setSearch(text)}
            style={{
              borderWidth: 2,
              borderColor: 'grey',
            }}></TextInput>
          <Button  onPress={e => searchStopPoint(e)} title='Search' />
        </View>

        <View style={{flex: 10}}>
          <ScrollView style={StyleSheet.absoluteFillObject}>
            <MapView style={styles.map} initialRegion={S} region={S} 
            onRegionChangeComplete={region => {
              console.log(region)
            }}>
              {/* <Marker
                onPress={() => alert('hello')}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                image={require('./assets/pin.png')}
                centerOffset={{x: -18, y: -60}}
                anchor={{x: 0.69, y: 1}}>
                <Text
                  style={{
                    marginLeft: 4,
                    marginTop: 20,
                    fontWeight: 'bold',
                  }}>
                  {place.name}
                </Text>
              </Marker> */}
              <MapView.Marker.Animated
                ref={m => {
                  marker = m
                }}
                coordinate={S}>
                <Callout style={{width: 300}}>
                  <View>
                    <Text>
                      You searched for {place.name}, The Lat is {place.latitude}{' '}
                      and Lng is {place.longitude}
                    </Text>
                  </View>
                </Callout>
              </MapView.Marker.Animated>
            </MapView>
          </ScrollView>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  map: {
    marginTop: 10,
    height: 800,
    marginVertical: 50,
  },
})

export default App
