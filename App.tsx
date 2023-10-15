import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { DeviceMotion } from "expo-sensors";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  SafeAreaProvider,
  useSafeAreaFrame,
} from "react-native-safe-area-context";

const DOT_WIDTH = 20;
const TARGET_WIDTH = DOT_WIDTH * 2;
const TARGET_BORDER_WIDTH = 2;

export default function App() {
  return (
    <SafeAreaProvider>
      <Game />
    </SafeAreaProvider>
  );
}

const getNewTargetPosition = (width: number, height: number) => ({
  x: Math.random() * (width - TARGET_WIDTH),
  y: Math.random() * (height - TARGET_WIDTH),
});

export function Game() {
  const { width, height } = useSafeAreaFrame();

  const [score, setScore] = React.useState(0);

  // Start with the dot in the centre of the playable screen area
  const dotAnimation = useSharedValue({
    x: (width - DOT_WIDTH) / 2,
    y: (height - DOT_WIDTH) / 2,
  });

  const targetAnimation = useSharedValue(getNewTargetPosition(width, height));

  // Create the dot styles based on the current dotAnimation value
  const dotPosition = useAnimatedStyle(() => ({
    transform: [
      { translateX: dotAnimation.value.x },
      { translateY: dotAnimation.value.y },
    ],
  }));

  // Create the target styles based on the current dotAnimation value
  const targetPosition = useAnimatedStyle(() => ({
    transform: [
      { translateX: targetAnimation.value.x },
      { translateY: targetAnimation.value.y },
    ],
  }));

  // Update the dot position based on the device motion sensor.
  // We also need to make sure the dot stays within the playable screen area.
  React.useEffect(() => {
    const subscription = DeviceMotion.addListener((deviceMotionMeasurment) => {
      dotAnimation.value = {
        x: Math.max(
          0,
          Math.min(
            dotAnimation.value.x + deviceMotionMeasurment.rotation.gamma * 9,
            width - DOT_WIDTH
          )
        ),
        y: Math.max(
          0,
          Math.min(
            dotAnimation.value.y + deviceMotionMeasurment.rotation.beta * 9,
            height - DOT_WIDTH
          )
        ),
      };

      // Check if the dot is in the target
      if (
        dotAnimation.value.x > targetAnimation.value.x + TARGET_BORDER_WIDTH &&
        dotAnimation.value.x + DOT_WIDTH <
          targetAnimation.value.x + TARGET_WIDTH - TARGET_BORDER_WIDTH &&
        dotAnimation.value.y > targetAnimation.value.y + TARGET_BORDER_WIDTH &&
        dotAnimation.value.y + DOT_WIDTH <
          targetAnimation.value.y + TARGET_WIDTH - TARGET_BORDER_WIDTH
      ) {
        // If it is, move the target to a new random position
        targetAnimation.value = getNewTargetPosition(width, height);

        // And update the scrore by 1
        setScore((score) => score + 1);
      }
    });

    return subscription.remove;
  }, []);

  return (
    <View style={styles.container}>
      <Reanimated.View style={[styles.target, targetPosition]} />
      <Reanimated.View style={[styles.dot, dotPosition]} />

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>

        <Pressable
          onPress={() => setScore(0)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "black",
    borderWidth: 1,
  },
  dot: {
    position: "absolute",
    width: DOT_WIDTH,
    height: DOT_WIDTH,
    borderRadius: DOT_WIDTH,
    backgroundColor: "red",
  },
  target: {
    position: "absolute",
    width: TARGET_WIDTH,
    height: TARGET_WIDTH,
    borderRadius: TARGET_WIDTH,
    borderWidth: TARGET_BORDER_WIDTH,
    borderColor: "blue",
  },
  scoreContainer: { position: "absolute", bottom: 20, left: 20 },
  scoreText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  resetText: {
    fontSize: 20,
  },
});
