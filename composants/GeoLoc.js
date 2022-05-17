import { StyleSheet,ActivityIndicator,Button,Image,Text, View} from 'react-native';
import * as Location from 'expo-location';
import {useState, useEffect} from "react";
const GeoLoc = ({}) => {
  
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [ville, setVille] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [description, setDescription] = useState(null);
  const [icone, setIcone] = useState(null);
  const [loading, setLoading] = useState(true);
 
 

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'En attente..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    var latitude = JSON.stringify(location.coords.latitude);
    var longitude = JSON.stringify(location.coords.longitude);
    var api = "https://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&appid=647d73af1c6de70d1bb5e48eae013cf1&units=metric&lang=fr";
    const MeteoVille = () => {
      fetch(api)
          .then(function(response){
              return response.json();
          }).then(function(response){
          setVille(response.name);
          setTemperature(response.main.temp)
          setDescription(response.weather[0].description)
          setIcone("https://openweathermap.org/img/wn/"+response.weather[0].icon+"@2x.png")
          setLoading(false);

      })
    }
    MeteoVille();
  }
 
  return (
      <View>
        
        {loading ? (
          <ActivityIndicator 
            size="small" color="#0000ff"
            visible={loading}
          />
        ) : (
          <>
            <Text>Météo à {ville}</Text>
            <Text style={styles.borderTexte}>Latitude: <Text style={{ fontWeight: '' }}> {latitude}</Text></Text>
            <Text style={styles.borderTexte}>Longitude: <Text style={{ fontWeight: '' }}> {longitude}</Text></Text>
            <Text style={styles.borderTexte}>Temperature: <Text style={{ fontWeight: '' }}> {temperature} °C</Text></Text>
            <Text style={styles.borderTexte}>Description: <Text style={{ fontWeight: '' }}> {description}</Text></Text>
            <Image
              style={styles.borderImage}
              source={{uri:icone}}
            />
          </>
        )}
      </View>
  );
}
const styles = StyleSheet.create({
  borderTexte: {
    fontWeight:'bold', borderWidth: 2,borderColor:'black',padding:5
  },
  borderImage: {
    width: 100, height: 100,borderWidth: 2,borderColor:'black',padding:5
  },
  
});
export default GeoLoc;