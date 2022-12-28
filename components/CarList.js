import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import filter from "lodash.filter";

const CarList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [fullData, setFullData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://myfakeapi.com/api/cars/?seed=1&page=1&results=20`)
      .then((response) => response.json())
      .then((response) => {
        setData(response.cars);
        setFullData(response.cars);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
      });
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5500dc" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18 }}>
          Error fetching data... Check your network connection!
        </Text>
      </View>
    );
  }

  const handleSearch = (text) => {
    const formattedQuery = text.toLowerCase();
    const filteredData = filter(fullData, (user) => {
      return contains(user, formattedQuery);
    });
    setData(filteredData);
    setQuery(text);
  };

  const contains = ({ car, car_model, car_color, car_vin, price }, query) => {
    if (
      car.toLowerCase().includes(query) ||
      car_model.toLowerCase().includes(query) ||
      car_color.toLowerCase().includes(query) ||
      car_vin.toLowerCase().includes(query) ||
      price.toLowerCase().includes(query)
    ) {
      return true;
    }
    return false;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Car List</Text>
      <View
        style={{
          backgroundColor: "#fff",
          padding: 10,
          marginVertical: 20,
          borderRadius: 20,
          height: 40,
          margin: 12,
          borderWidth: 1,
          width: 300,
        }}
      >
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          value={query}
          onChangeText={(queryText) => handleSearch(queryText)}
          placeholder="Search"
          style={{ backgroundColor: "#fff", paddingHorizontal: 20 }}
        />
      </View>
      <FlatList
        keyboardShouldPersistTaps="always"
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={{ zIndex: 100000 }}
        data={data}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Image
              source={{
                uri: "https://picsum.photos/200",
              }}
              style={styles.coverImage}
            />
            <View style={styles.metaInfo}>
              <Text
                style={styles.title}
              >{`${item.car} ${item.car_model}`}</Text>
              <Text>Color: {`${item.car_color}`}</Text>
              <Text>Daily Rate: {`${item.price}`}</Text>
              <Text>Car Model Year: {`${item.car_model_year}`}</Text>
              <Text>Vin: {`${item.car_vin}`}</Text>
              <Text>Availability: {`${item.availability}`}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#101010",
    marginTop: 60,
    fontWeight: "700",
  },
  listItem: {
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
  },
  coverImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  metaInfo: {
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    width: 200,
  },
});

export default CarList;
