import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableHighlight, ScrollView, TouchableOpacity } from "react-native";
import Voice from "@react-native-voice/voice";
import * as Speech from "expo-speech";

const App = () => {
  const [pitch, setPitch] = useState("");
  const [error, setError] = useState("");
  const [end, setEnd] = useState("");
  const [started, setStarted] = useState("");
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);

  useEffect(() => {
    //Setting callbacks for the process status
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      //destroy the process after switching the screen
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e) => {
    //Invoked when .start() is called without error
    console.log("onSpeechStart: ", e);
    setStarted("√");
  };

  const onSpeechEnd = (e) => {
    //Invoked when SpeechRecognizer stops recognition
    console.log("onSpeechEnd: ", e);
    setEnd("√");
  };

  const onSpeechError = (e) => {
    //Invoked when an error occurs.
    console.log("onSpeechError: ", e);
    setError(e.error);
  };

  const onSpeechResults = (e) => {
    //Invoked when SpeechRecognizer is finished recognizing
    console.log("onSpeechResults: ", e);
    setResults(e.value);
  };

  const onSpeechPartialResults = (e) => {
    //Invoked when any results are computed
    console.log("onSpeechPartialResults: ", e);
    setPartialResults(e.value);
  };

  const onSpeechVolumeChanged = (e) => {
    //Invoked when pitch that is recognized changed
    console.log("onSpeechVolumeChanged: ", e);
    setPitch(e.value);
  };

  const startRecognizing = async () => {
    //Starts listening for speech for a specific locale
    try {
      let a = await Voice.start("en-US");
      setPitch("");
      setError("");
      setStarted("");
      setResults([]);
      setPartialResults([]);
      setEnd("");
      console.log(a);
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    //Stops listening for speech
    try {
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  const cancelRecognizing = async () => {
    //Cancels the speech recognition
    try {
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  const destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance
    try {
      await Voice.destroy();
      setPitch("");
      setError("");
      setStarted("");
      setResults([]);
      setPartialResults([]);
      setEnd("");
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  const speak = () => {
    try {
      let lastResult = results[results.length - 1];
      console.log(lastResult);
      if (lastResult) Speech.speak(lastResult);
    } catch (error) {
      console.log("speak catch :", error);
    }
  };
  console.log(error);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleText}>Speech to Text Conversion in React Native | Voice Recognition</Text>
        <Text style={styles.textStyle}>Press mike to start Recognition</Text>
        <View style={styles.headerContainer}>
          <Text style={styles.textWithSpaceStyle}>{`Started: ${started}`}</Text>
          <Text style={styles.textWithSpaceStyle}>{`End: ${end}`}</Text>
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.textWithSpaceStyle}>{`Pitch: \n ${pitch}`}</Text>
          <Text style={styles.textWithSpaceStyle}>{`Error: \n ${error?.message ? error?.message : "N/A"}`}</Text>
        </View>
        <TouchableOpacity style={styles.recordButton} onPressOut={stopRecognizing} onLongPress={startRecognizing}>
          <Image
            style={styles.imageButton}
            source={{
              uri: "https://raw.githubusercontent.com/AboutReact/sampleresource/master/microphone.png",
            }}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.textStylePartial}>Partial Results</Text>
          <ScrollView>
            {partialResults.map((result, index) => {
              return (
                <Text key={`partial-result-${index}`} style={styles.textStyle}>
                  {result}
                </Text>
              );
            })}
          </ScrollView>
          <Text style={styles.textStyleResult}>Results</Text>

          <ScrollView style={{ marginBottom: 20 }}>
            {results.map((result, index) => {
              return (
                <Text key={`result-${index}`} style={styles.textStyle}>
                  {index + ") " + result}
                </Text>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.horizontalView}>
          <TouchableHighlight onPress={stopRecognizing} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Stop</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={speak} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Speak</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={cancelRecognizing} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={destroyRecognizer} style={{ ...styles.buttonStyle, backgroundColor: "#E33636" }}>
            <Text style={styles.buttonTextStyle}>Clear</Text>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  titleText: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonStyle: {
    flex: 1,
    justifyContent: "center",
    marginTop: 15,
    padding: 10,
    backgroundColor: "#8ad24e",
    marginRight: 2,
    marginLeft: 2,
    borderRadius: 5,
  },
  buttonTextStyle: {
    color: "#fff",
    textAlign: "center",
  },
  horizontalView: {
    flexDirection: "row",
    bottom: 0,
  },
  textStyle: {
    textAlign: "center",
    paddingHorizontal: 12,
    marginVertical: 2,
  },
  textStyleResult: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    textDecorationLine: "underline",
  },
  textStylePartial: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: "underline",
  },
  imageButton: {
    width: 30,
    height: 30,
    tintColor: "white",
  },
  textWithSpaceStyle: {
    flex: 1,
    textAlign: "center",
    color: "#B0171F",
  },
  recordButton: {
    backgroundColor: "#1967D2",
    borderRadius: 100,
    padding: 15,
    position: "absolute",
    bottom: 70,
    zIndex: 10,
    right: 15,
  },
});
