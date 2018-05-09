import {Expo,Permissions,ImagePicker,} from 'expo';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import {
  StyleSheet,ActionSheetIOS,
  Text,Slider,
  View,ScrollView,
  TouchableOpacity,Picker,SegmentedControlIOS,FlatList,List,
  Image,Alert, NativeModules, ToastAndroid,Vibration,script,pre,Switch,Linking,Dimensions,ActivityIndicator,
} from 'react-native';
import React, {Component} from 'react';
import AreaSpline from './js/charts/AreaSpline';
import Pie from './js/charts/Pie';
import Theme from './js/theme';
import loadingTheme from './js/loadingtheme';
import data from './resources/data';
import LINK_WITH_API_KEY from './resources/link'
var { width, height } = Dimensions.get('window');
export default class App extends React.Component {
  state = {
    imageUri: null,
    label: null,
    keywords: null,
    validationtype: "LABEL_DETECTION",
    Gal: true,
    Cam: false,
    abase64: null,
    Image_Description: [null,null,null,null,null],
    Image_Description_Score: [null,null,null,null,null],
    Text_Written: null,
    Detected_Language: null,
    Safe_Search_Description: [null,null,null,null,null],
    Web_Detection_Description: [null,null,null,null,null],
    Web_Detection_Description_Score: [null,null,null,null,null],
    Similar_Images_Url: [],
    Best_Guess: null,
    Data: [],
    makeshift: [],
    activeIndex: 0,
    activeIndex1: 0,
    test: [],
    loading: true,
  }
  constructor(props) {
    super(props);
    this._onPieItemSelected = this._onPieItemSelected.bind(this);
    this._onPieItemSelected1 = this._onPieItemSelected1.bind(this);
    this._shuffle = this._shuffle.bind(this);
  }

  _onPieItemSelected(newIndex){
    this.setState({...this.state, activeIndex: newIndex,});
  }
  _onPieItemSelected1(newIndex){
    this.setState({...this.state, activeIndex1: newIndex,});
  }
  askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    // you would probably do something to verify that permissions
    // are actually granted, but I'm skipping that for brevity
  };

  _shuffle(a) {
      for (let i = a.length; i; i--) {
          let j = Math.floor(Math.random() * i);
          [a[i - 1], a[j]] = [a[j], a[i - 1]];
      }
      return a;
  }
  render() {
    const height = 200;
    const width = 500;

    let imageView = null;
    if (this.state.imageUri) {
      imageView = (
        <Image
          style={{ width: 300, height: 300 }}
          source={{ uri: this.state.imageUri }}
        />
      );
    }

    return (
      <View style={styles.container}>
      {this.state.label == null ?
      (
        <View style={styles.container}>
        <View style={styles.container1}>
        <TouchableBounce
        style={{ margin: 15, padding: 25, backgroundColor: 'blue',borderRadius:15, }}
        onPressIn={() => Vibration.vibrate()} >
        <Text style={{color: 'white',fontSize: 50 , fontWeight: 'bold',alignItems:'center'}}>         Image           Recognition</Text>
        </TouchableBounce>
        <Text style={{color: 'green',fontSize: 19}}>                      by   @iammosespaulr</Text>
        </View>
        <View style={{ flexDirection: 'column', padding: 7 ,alignItems: 'center' }}>
        <Text style={{color: 'red',fontSize: 40}}>Camera Input   </Text>
        <Switch
        onValueChange={value => this._setcamerastate(value)}
        value={this.state.Cam}
        />
        <Text style={{color: 'red',fontSize: 40}}>Gallery Input  </Text>
        <Switch
        onValueChange={value => this._setgallerystate(value)}
        value={this.state.Gal}
        />
        </View>
        <View style={styles.container1}>
        <TouchableBounce
        style={{ margin: 15, padding: 25, backgroundColor: 'green',borderRadius:15, }}
        onPressIn={() => Vibration.vibrate()}  onPress={this._start}>
        <Text style={{color: 'white',fontSize: 25, fontWeight: 'bold'}}>Run Recognition</Text>
        </TouchableBounce>
        </View>
        </View>
      )
      :
      ( <ScrollView>
        <View style={styles.container8} >
        <Text style={styles.chart_title8}>  The Result </Text>
        <View style={styles.hairline} />
          <Text style={styles.chart_title}>Detected Objects (Image Detection)</Text>
          {this.state.loading == true ? 
            ( <View style={{transform: [{ scale: 1 }]}}>
              <ActivityIndicator size="large" color="#0000ff"/>
              </View>
            )
            :
            (
            <ScrollView directionalLockEnabled={false} vertical={true}  horizontal={true} >
            <Pie
            pieWidth={150}
            pieHeight={150}
            onItemSelected={this._onPieItemSelected}
            colors={Theme.colors}
            width={width}
            height={height}
            data={data.Image_Detection} />
            </ScrollView>
          )
          } 
          {this.state.loading != true ? 
            (<Text style={styles.chart_title}>{data.Image_Detection[this.state.activeIndex].name} Selected</Text>
            ):(null)}
            <View style={styles.hairline} />
            <Text style={styles.chart_title}>Detected Objects (Web Detection)</Text>
            {this.state.loading == true ? 
              ( <View style={{transform: [{ scale: 1 }]}}>
                <ActivityIndicator size="large" color="#0000ff" />
                </View>
              )
              :
              (
          <ScrollView directionalLockEnabled={false} vertical={true} horizontal={true} >
           <Pie
          pieWidth={150}
          pieHeight={150}
          onItemSelected={this._onPieItemSelected1}
          colors={Theme.colors}
          width={width}
          height={height}
          data={data.Web_Detection} />
          </ScrollView>
              )
         }
         {this.state.loading != true ? 
          (<Text style={styles.chart_title}> {data.Web_Detection[this.state.activeIndex1].name} Selected</Text>
          ):(null)}
        <View style={styles.hairline} />
        { this.state.Best_Guess ?(
          <Text style={styles.chart_title}> The Best Guess is {this.state.Best_Guess} </Text>
        ):(null)
        }
      </View>
      <View style={styles.hairline} />
      <Text style={styles.chart_title4}> URL's of Similar Images</Text>
       {
        <View>
        this.state.Similar_Images_Url[0] ?
        (
        <Text style={styles.chart_title1} onPress={() => Linking.openURL(this.state.Similar_Images_Url[0])}> {this.state.Similar_Images_Url[0]} </Text>
      ):(null)
      this.state.Similar_Images_Url[1] ?
        (<Text style={styles.chart_title1} onPress={() => Linking.openURL(this.state.Similar_Images_Url[1])}> {this.state.Similar_Images_Url[1]} </Text>
      ):(null)
      this.state.Similar_Images_Url[2] ?
        (<Text style={styles.chart_title1} onPress={() => Linking.openURL(this.state.Similar_Images_Url[2])}> {this.state.Similar_Images_Url[2]} </Text>
      ):(null)
      this.state.Similar_Images_Url[3] ?
        (<Text style={styles.chart_title1} onPress={() => Linking.openURL(this.state.Similar_Images_Url[3])}> {this.state.Similar_Images_Url[3]} </Text>
      ):(null)
      this.state.Similar_Images_Url[4] ?
        (<Text style={styles.chart_title1} onPress={() => Linking.openURL(this.state.Similar_Images_Url[4])}> {this.state.Similar_Images_Url[4]} </Text>
        ):(null)
       </View>
       }
       {}
        <View style={styles.container1}>
        {this.state.Text_Written?(<Text style={styles.chart_title} > Identified Text In The Image : {this.state.Text_Written} </Text>):(null)}
        <TouchableBounce
        style={{ margin: 20, padding: 20, backgroundColor: 'grey',borderRadius:15, }}
        onPressIn={() => Vibration.vibrate()}  onPress={this._setnullstate}>
        <Text style={{color: 'white',fontSize: 20, fontWeight: 'bold'}}>Go Back To Menu</Text>
        </TouchableBounce>
        <Text style={styles.chart_title} > Selected Image </Text>
        {imageView}
        <Text style={{color: 'blue', margin: 5 ,fontWeight: 'bold'}}>
          JSON :
        </Text>
        <ScrollView>
        <Text style={{color: 'blue', margin: 5 , overflow : 'scroll' }}>
        {this.state.label}
        </Text>
        </ScrollView>
        </View>
        </ScrollView>
      )
      }
      </View>
    );
  }
  _setgallerystate = async (value) =>
  {
    {this.state.Gal === false && this.state.Cam === false ? (this.setState({Gal: value})):(this.setState({Cam: false}))}
  }
  _setcamerastate = async (value) =>
  {
    {this.state.Gal === false && this.state.Cam === false ? (this.setState({Cam: value})):(this.setState({Gal: false}))}
  }
  _setnullstate = async () => {
    this.setState({
      label : null,
      loading : true,

    });
  }
  _start = async () => {
    if (this.state.Cam == true) {
      await this.askPermissionsAsync();
       const {
            cancelled,
            uri,
            base64,
          } = await ImagePicker.launchCameraAsync({
            base64: true,
            allowsEditing: true,
          });
          if (!cancelled) {
            this.setState({
              imageUri: uri,
              label: '( loading...)',
              keywords: '( loading...)',
              abase64: base64,
            });
          }
          else {this._setnullstate(); return;}
        }
    else {
      await this.askPermissionsAsync();
      const {
          cancelled,
          uri,
          base64,
        } = await ImagePicker.launchImageLibraryAsync({
          base64: true,
          allowsEditing: true,
        });
        if (!cancelled) {
          this.setState({
            imageUri: uri,
            label: '( loading...)',
            keywords: '( loading...)',
            abase64: base64,
          });
        }
        else {this._setnullstate(); return;}
      }

    const body = {
      requests:[
        {
          image:{
          content: this.state.abase64,
          },
          features:[
            {
              "type":"TYPE_UNSPECIFIED"
              ,"maxResults":5
            },
            /*{
              "type":"LANDMARK_DETECTION"
              ,"maxResults":5
            },
            {
              "type":"FACE_DETECTION"
              ,"maxResults":5
            },
            {
              "type":"LOGO_DETECTION"
              ,"maxResults":5
            },*/
            {
              "type":"LABEL_DETECTION"
              ,"maxResults":5
            },
            {
              "type":"TEXT_DETECTION"
              ,"maxResults":5
            },
            {
              "type":"DOCUMENT_TEXT_DETECTION"
              ,"maxResults":5
            },
            /*{
              "type":"SAFE_SEARCH_DETECTION"
              ,"maxResults":5
            },
            {
              "type":"IMAGE_PROPERTIES"
              ,"maxResults":5
            },
            {
              "type":"CROP_HINTS"
              ,"maxResults":5
            },*/
            {
              "type":"WEB_DETECTION"
              ,"maxResults":5
            }
          ],
        },
      ],
    };
    const response = await fetch(LINK_WITH_API_KEY.link, {
      method: 'POST',             
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const parsed = await response.json();
    var Image_Description=[],Image_Description_Score=[],Safe_Search_Description=[],Web_Detection_Description=[];
    var Web_Detection_Description_Score = [],Similar_Images_Url = [];
    this.setState({      label: JSON.stringify(parsed,undefined,2),    });
    for (let index = 0; index < parsed.responses[0].labelAnnotations.length; index++) {
      if (parsed.responses[0].labelAnnotations[index].description)
      Image_Description.push(parsed.responses[0].labelAnnotations[index].description);
      if (parsed.responses[0].labelAnnotations[index].score)
      Image_Description_Score.push(parsed.responses[0].labelAnnotations[index].score);
    }
    for (let index = 0; index < parsed.responses[0].webDetection.webEntities.length; index++) {
      if (parsed.responses[0].webDetection.webEntities[index].description)
      Web_Detection_Description.push(parsed.responses[0].webDetection.webEntities[index].description);
      if (parsed.responses[0].webDetection.webEntities[index].score)
      Web_Detection_Description_Score.push(parsed.responses[0].webDetection.webEntities[index].score);
    }
    for (let index = 0; index < parsed.responses[0].webDetection.visuallySimilarImages.length; index++) {      
      if (parsed.responses[0].webDetection.visuallySimilarImages[index].url)
      Similar_Images_Url.push(parsed.responses[0].webDetection.visuallySimilarImages[index].url);
      //console.log(Similar_Images_Url);
    }
    this.setState({
      keywords: null,
      Image_Description: Image_Description,
      Image_Description_Score: Image_Description_Score,
      Web_Detection_Description: Web_Detection_Description,
      Web_Detection_Description_Score: Web_Detection_Description_Score,
      Similar_Images_Url: Similar_Images_Url,
    });
    if(parsed.responses[0].webDetection.bestGuessLabels[0].label)
    {
    this.setState({
      Best_Guess: parsed.responses[0].webDetection.bestGuessLabels[0].label.charAt(0).toUpperCase()+parsed.responses[0].webDetection.bestGuessLabels[0].label.slice(1),
    });
    }
    //console.log(this.state.Similar_Images_Url[1]);
    if (parsed.responses[0].fullTextAnnotation) 
      this.setState({Text_Written: parsed.responses[0].fullTextAnnotation.text});
    else
      this.setState({Text_Written : null});
    var Data=[],i,sums=0,makeshift=this.state.Image_Description_Score;
    for(i=0;i<makeshift.length;i++)
    {
      sums=makeshift[i]+sums;
    }
    for(i=0;i<makeshift.length;i++)
    {
      makeshift[i]=(makeshift[i]/sums)*100;
    }
    for(i=0;i<makeshift.length;i++)
    {
      Data.push({"number":  makeshift[i].toFixed(5), "name": this.state.Image_Description[i].charAt(0).toUpperCase()+this.state.Image_Description[i].slice(1)});  
    }

    /*Data = [
      {"number":  makeshift[0].toFixed(5), "name": this.state.Image_Description[0].charAt(0).toUpperCase()+this.state.Image_Description[0].slice(1)},
      {"number": makeshift[1].toFixed(5), "name": this.state.Image_Description[1].charAt(0).toUpperCase()+this.state.Image_Description[1].slice(1)},
      {"number": makeshift[2].toFixed(5), "name": this.state.Image_Description[2].charAt(0).toUpperCase()+this.state.Image_Description[2].slice(1)},
      {"number": makeshift[3].toFixed(5), "name": this.state.Image_Description[3].charAt(0).toUpperCase()+this.state.Image_Description[3].slice(1)},
      {"number": makeshift[4].toFixed(5), "name": this.state.Image_Description[4].charAt(0).toUpperCase()+this.state.Image_Description[4].slice(1)},
    ];*/
    data.Image_Detection = Data;
    Data =[],sums=0,makeshift=this.state.Web_Detection_Description_Score;
    for(i=0;i<makeshift.length;i++)
    {
      sums=makeshift[i]+sums;
    }
    for(i=0;i<makeshift.length;i++)
    {
      makeshift[i]=(makeshift[i]/sums)*100;
    }
    for(i=0;i<makeshift.length;i++)
    {
      if(this.state.Web_Detection_Description[i])
      Data.push({"number":  makeshift[i].toFixed(5), "name": this.state.Web_Detection_Description[i].charAt(0).toUpperCase()+this.state.Web_Detection_Description[i].slice(1)});  
    }
    /**/
    data.Web_Detection = Data;
    this._onPieItemSelected(0);
    this._onPieItemSelected1(0);
    this.setState({loading : false});
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: 'transparent',
    //alignItems: 'center',
    justifyContent: 'center',
  },  container1: {
      flex: 3,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },sectionHeader: {
      flex: 1,
      paddingTop: 100,
  },  container8: {
    backgroundColor:'whitesmoke',
    marginTop: 21,
  },
  chart_title : {
    paddingTop: 15,
    textAlign: 'center',
    paddingBottom: 5,
    paddingLeft: 5,
    fontSize: 21,
    backgroundColor:'white',
    color: 'grey',
    fontWeight:'bold',
  },
  chart_title4 : {
    paddingTop: 15,
    textAlign: 'center',
    paddingBottom: 5,
    paddingLeft: 5,
    fontSize: 21,
    backgroundColor:'white',
    color: 'blue',
    fontWeight:'bold',
  },  chart_title1 : {
    paddingTop: 15,
    textAlign: 'center',
    paddingBottom: 5,
    paddingLeft: 5,
    fontSize: 15,
    backgroundColor:'white',
    color: 'green',
    fontWeight:'bold',
  },  chart_title8 : {
    paddingTop: 15,
    textAlign: 'center',
    paddingBottom: 5,
    paddingLeft: 5,
    fontSize: 30,
    backgroundColor:'white',
    color: 'grey',
    fontWeight:'bold',
  },  container10: {
    flex: 1,
    marginTop: 20,
},hairline: {
  backgroundColor: '#A2A2A2',
  height: 4,
  width: width,
},
});
