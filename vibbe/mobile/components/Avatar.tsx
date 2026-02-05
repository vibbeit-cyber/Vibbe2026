import { View, Text, StyleSheet } from "react-native"

type Props = {
  name: string
  anonymous?: boolean
}

export default function Avatar({ name, anonymous }: Props) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.circle,
          anonymous && styles.anonCircle
        ]}
      >
        <Text style={styles.initial}>
          {name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.name}>
        {name}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center"
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8
  },
  anonCircle: {
    backgroundColor: "#000"
  },
  initial: {
    color: "#fff",
    fontWeight: "700"
  },
  name: {
    fontWeight: "600"
  }
})
