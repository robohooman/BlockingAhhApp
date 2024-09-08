import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Alert, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';

const Stack = createNativeStackNavigator();

function CustomButton({ label, onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

// Home screen
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study Time!</Text>
      <StatusBar style="auto" />
      <View style={styles.footerContainer}>
        <CustomButton label="Focus Mode" onPress={() => navigation.navigate('FocusMode')} />
      </View>
    </View>
  );
}

// Focus Mode
function FocusMode() {
  const [countdown, setCountdown] = useState();
  const [inputTime, setInputTime] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [topic, setTopic] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsRunning(false);
      askQuestion();
    }

    return () => clearInterval(timer);
  }, [isRunning, countdown]);

  const startTimer = () => {
    if (parseInt(inputTime) > 0) {
      setCountdown(parseInt(inputTime));
      setIsRunning(true);
    } else {
      Alert.alert('Error', 'Please enter a valid time.');
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCountdown(parseInt(inputTime));
  };

  const fetchQuestions = (chosenTopic) => {
    let topicQuestions = [];
    if (chosenTopic.toLowerCase() === 'frog') {
      topicQuestions = [
        { question: 'What is the phylum of the frog?', correctAnswer: 'Chordata' },
        { question: 'What class do frogs belong to?', correctAnswer: 'Amphibia' },
        { question: 'What is the primary habitat of frogs?', correctAnswer: 'Wetlands' },
        { question: 'What type of fertilization do frogs have?', correctAnswer: 'External' },
        { question: 'Do frogs have a backbone?', correctAnswer: 'Yes' },
      ];
    } else {
      topicQuestions = [
        { question: `What is the basic concept of ${chosenTopic}?`, correctAnswer: 'Concept Answer' },
        { question: `Explain one key element of ${chosenTopic}?`, correctAnswer: 'Key Element Answer' },
        { question: `How does ${chosenTopic} relate to other fields?`, correctAnswer: 'Relation Answer' },
        { question: `What is the future scope of ${chosenTopic}?`, correctAnswer: 'Future Scope Answer' },
        { question: `Name an important application of ${chosenTopic}.`, correctAnswer: 'Application Answer' },
      ];
    }
    setQuestions(topicQuestions);
  };

  const askQuestion = () => {
    if (questionIndex < questions.length) {
      Alert.alert('Question', questions[questionIndex].question);
    } else {
      if (score >= 4) {
        Alert.alert('Quiz Completed', 'You answered enough questions correctly! You can now access other apps.');
      } else {
        Alert.alert('Quiz Completed', 'Not enough correct answers. You are restricted from using other apps for 1 hour.');
        // Implement logic to block apps
      }
    }
  };

  const checkAnswer = () => {
    if (userAnswer.trim().toLowerCase() === questions[questionIndex].correctAnswer.toLowerCase()) {
      Alert.alert('Correct Answer!');
      setScore(score + 1);
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(questionIndex + 1);
        setUserAnswer('');
        askQuestion();
      } else {
        Alert.alert("Quiz Completed", "You can now access other apps.");
      }
    } else {
      Alert.alert('Incorrect Answer. Try Again.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter topic to study"
        value={topic}
        onChangeText={setTopic}
      />
      <CustomButton label="Set Topic" onPress={() => fetchQuestions(topic)} />
      <Text style={styles.timerText}>{countdown}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter time in seconds"
        value={inputTime}
        onChangeText={setInputTime}
      />
      <CustomButton label={isRunning ? "Pause" : "Start"} onPress={startTimer} />
      <CustomButton label="Reset" onPress={resetTimer} />
      {questions.length > 0 && questionIndex < questions.length && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Your answer"
            value={userAnswer}
            onChangeText={setUserAnswer}
          />
          <CustomButton label="Submit Answer" onPress={checkAnswer} />
        </>
      )}
    </View>
  );
}


// Main App component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="FocusMode" component={FocusMode} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 48,
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    marginBottom: 10,
    paddingHorizontal:20
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 18,
  },
});

