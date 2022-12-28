import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import filter from "lodash.filter";
import DropDownPicker from "react-native-dropdown-picker";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const CarList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [fullData, setFullData] = useState([]);
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [filterOption, setfilteroption] = useState([
    { label: "Year", value: "year" },
    { label: "Color", value: "color" },
    { label: "Model", value: "model" },
  ]);
  const [value, setValue] = useState(null);
  const [childItem, setChilditem] = useState(null);
  const [childValue, setChildValue] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = () => {
    setRefreshing(true);
    setData(fullData);
    wait(2000).then(() => setRefreshing(false));
  };

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

  const changeSelectOptionHandler = (item) => {
    setSelected(item.label);
    if (item.label === "Color") {
      const colorData = [...new Set(data.map((val) => val.car_color))];
      var color = colorData.map(function (val, index) {
        return {
          id: index,
          value: val,
          label: val,
        };
      });
      return setChildValue(color);
    } else if (item.label === "Model") {
      const modelData = [...new Set(data.map((val) => val.car_model))];
      var model = modelData.map(function (val, index) {
        return {
          id: index,
          value: val,
          label: val,
        };
      });
      return setChildValue(model);
    } else if (item.label === "Year") {
      const yearData = [...new Set(data.map((val) => val.car_model_year))];
      var year = yearData.map(function (val, index) {
        return {
          id: index,
          value: val,
          label: val,
        };
      });
      return setChildValue(year);
    }
  };

  function renderHeader() {
    return (
      <View>
        <View
          style={{
            width: 120,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              padding: 5,
              margin: 5,
              marginLeft: 10,
            }}
          >
            <DropDownPicker
              onSelectItem={changeSelectOptionHandler}
              open={open}
              value={value}
              items={filterOption}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setfilteroption}
              key={filterOption}
            />
          </View>
          <View
            style={{
              padding: 5,
              margin: 5,
            }}
          >
            <DropDownPicker
              open={childOpen}
              items={childValue}
              value={childItem}
              setValue={setChilditem}
              setOpen={setChildOpen}
              setItems={setChildValue.value}
              key={setChildValue.id}
              listMode="SCROLLVIEW"
            />
          </View>
        </View>
      </View>
    );
  }

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
