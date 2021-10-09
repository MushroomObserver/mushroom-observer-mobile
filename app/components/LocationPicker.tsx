import { selectIds, selectById } from "../store/locations";
import { filter } from "lodash-es";
import React, { useState } from "react";
import { Picker } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

export interface LocationPickerItemProps {
  id: number;
}
const LocationPickerItem = (props: LocationPickerItemProps) => {
  const location = useSelector((state) => selectById(state, props.id));
  return <Picker.Item value={props.id} label={location.name} />;
};

export interface LocationPickerProps {
  id: number;
}

const LocationPicker = (props: LocationPickerProps) => {
  const [id, setId] = useState<number>(props.id);
  const [query, setQuery] = useState<string>("");
  const locationIds: any[] = useSelector(selectIds);

  return (
    <Picker
      showSearch
      title="Location"
      value={{ label: location, value: location }}
      onChange={(item) => setId(item.value)}
      onSearchChange={setQuery}
      listProps={{
        data: filter(locations, (n) => n.name.startsWith(query)),
        renderItem: ({ item }) => M,
      }}
      validate="required"
      errorMessage="This field is required"
    />
  );
};
