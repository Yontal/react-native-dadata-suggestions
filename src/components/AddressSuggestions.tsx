import * as React from 'react';
import {
  FlatList,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

export type DadataAddress = {
  area: string;
  area_fias_id: string;
  area_kladr_id: string;
  area_type: string;
  area_type_full: string;
  area_with_type: string;
  beltway_distance: null;
  beltway_hit: null;
  block: string;
  block_type: string;
  block_type_full: string;
  capital_marker: '0' | '1' | '2' | '3' | '4';
  city: string;
  city_area: string;
  city_district: string;
  city_district_fias_id: string;
  city_district_kladr_id: string;
  city_district_type: string;
  city_district_type_full: string;
  city_district_with_type: string;
  city_fias_id: string;
  city_kladr_id: string;
  city_type: string;
  city_type_full: string;
  city_with_type: string;
  country: string;
  fias_id: string;
  fias_level: string;
  flat: string;
  flat_area: null;
  flat_price: null;
  flat_type: string;
  flat_type_full: string;
  geo_lat: string;
  geo_lon: string;
  history_values: string;
  house: string;
  house_fias_id: string;
  house_kladr_id: string;
  house_type: string;
  house_type_full: string;
  kladr_id: string;
  okato: string;
  oktmo: string;
  postal_box: string;
  postal_code: string;
  qc: null;
  qc_complete: null;
  qc_geo: '0' | '1' | '2' | '3' | '4' | '5';
  qc_house: null;
  region: string;
  region_fias_id: string;
  region_kladr_id: string;
  region_type: string;
  region_type_full: string;
  region_with_type: string;
  settlement: string;
  settlement_fias_id: string;
  settlement_kladr_id: string;
  settlement_type: string;
  settlement_type_full: string;
  settlement_with_type: string;
  source: string;
  square_meter_price: null;
  street: string;
  street_fias_id: string;
  street_kladr_id: string;
  street_type: string;
  street_type_full: string;
  street_with_type: string;
  tax_office: string;
  tax_office_legal: string;
  timezone: null;
  unparsed_parts: null;
};

export type DadataSuggestion = {
  value: string;
  unrestricted_value: string;
  data: DadataAddress;
};

export interface AddressSuggestionsProps {
  ItemSeparatorComponent: any;
  containerStyle?: StyleProp<ViewStyle>;
  count?: number;
  disabled: boolean;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  keyExtractor: (item: any, index: number) => string;
  listContainerStyle?: StyleProp<ViewStyle>;
  listStyle?: StyleProp<ViewStyle>;
  onSelect?: (suggestion: DadataSuggestion) => void;
  placeholder?: string;
  query?: string;
  renderItem: any;
  token: string;
  onFetch?: (suggestions: DadataSuggestion[]) => void;
}

interface AddressSuggestionsState {
  inputFocused: boolean;
  isValid: boolean;
  query: string;
  suggestions: Array<DadataSuggestion>;
  suggestionsVisible: boolean;
}

export class AddressSuggestions extends React.PureComponent<
  AddressSuggestionsProps,
  AddressSuggestionsState
> {
  static defaultProps = {
    disabled: false,
    ItemSeparatorComponent: null,
    keyExtractor: (item: any, index: number): string => index.toString(),
    renderItem: ({ item }: any) => <Text>{item}</Text>,
    token: '',
  };

  private resultListRef: any;
  private textInputRef: any;

  constructor(props: AddressSuggestionsProps) {
    super(props);

    this.resultListRef = React.createRef();
    this.textInputRef = React.createRef();
  }

  state = {
    query: this.props.query ? this.props.query : '',
    inputFocused: false,
    suggestions: [],
    suggestionsVisible: true,
    isValid: false,
  };

  onInputFocus = () => {
    this.setState({ inputFocused: true });
    if (this.state.suggestions.length == 0) {
      this.fetchSuggestions();
    }
  };

  onInputBlur = () => {
    this.setState({ inputFocused: false });
    if (this.state.suggestions.length == 0) {
      this.fetchSuggestions();
    }
  };

  onInputChange = (value: string) => {
    this.setState({ query: value, suggestionsVisible: true }, () => {
      this.fetchSuggestions();
    });
  };

  fetchSuggestions = () => {
    fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Token ${this.props.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: this.state.query,
        count: this.props.count ? this.props.count : 5,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.state.query && this.props.onFetch && this.props.onFetch(response.suggestions);
        this.setState({ suggestions: response.suggestions });
        return response;
      })
      .catch((error) => console.log(error));
  };

  onSuggestionClick = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    this.selectSuggestion(index);
  };

  selectSuggestion = (index: number) => {
    const { onSelect } = this.props;
    const { query, suggestions } = this.state;

    if (suggestions.length >= index - 1) {
      const currentSuggestion: DadataSuggestion = suggestions[index];

      if (suggestions.length === 1 || currentSuggestion.value === query) {
        this.setState({ suggestionsVisible: false });
        onSelect && onSelect(suggestions[index]);
      } else {
        this.setState({ query: currentSuggestion.value }, () => this.fetchSuggestions());
        this.textInputRef && this.textInputRef.focus();
      }
    }
  };

  renderTextInput = () => {
    const { inputStyle } = this.props;

    return (
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        editable={!this.props.disabled}
        onChangeText={this.onInputChange}
        onFocus={this.onInputFocus}
        onBlur={this.onInputBlur}
        placeholder={this.props.placeholder ? this.props.placeholder : ''}
        ref={(ref) => (this.textInputRef = ref)}
        style={[styles.input, inputStyle]}
        value={this.state.query}
      />
    );
  };

  renderSuggestionItem = ({ item, index }: any) => {
    const { renderItem: SuggestionItem } = this.props;
    return (
      <TouchableOpacity onPress={(e: any) => this.onSuggestionClick(index, e)}>
        <SuggestionItem item={item} />
      </TouchableOpacity>
    );
  };

  renderSuggestions() {
    const { ItemSeparatorComponent, keyExtractor, listStyle } = this.props;
    const { suggestions } = this.state;

    return (
      <FlatList
        ref={this.resultListRef}
        data={suggestions}
        renderItem={this.renderSuggestionItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparatorComponent}
        style={[styles.list, listStyle]}
      />
    );
  }

  render() {
    const { containerStyle, inputContainerStyle, listContainerStyle } = this.props;
    const { suggestions, suggestionsVisible } = this.state;

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.inputContainer, inputContainerStyle]}>{this.renderTextInput()}</View>
        {suggestionsVisible && suggestions && suggestions.length > 0 && (
          <View style={listContainerStyle}>{this.renderSuggestions()}</View>
        )}
      </View>
    );
  }
}

const androidStyles = {
  inputContainer: {
    marginBottom: 0,
  },
  list: {
    borderTopWidth: 0,
    margin: 10,
    marginTop: 0,
  },
};

const iosStyles = {
  inputContainer: {},
  input: {
    height: 40,
    paddingLeft: 3,
  },
  list: {
    borderTopWidth: 0,
    left: 0,
    position: 'absolute' as const,
    right: 0,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  input: {
    height: 40,
    paddingLeft: 3,
  },
  ...Platform.select({
    android: { ...androidStyles },
    ios: { ...iosStyles },
  }),
});
