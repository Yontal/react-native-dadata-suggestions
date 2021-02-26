import * as React from 'react';
import { Keyboard } from 'react-native';
import { FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable } from 'react-native';
export class AddressSuggestions extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            query: this.props.query ? this.props.query : '',
            inputFocused: false,
            suggestions: [],
            suggestionsVisible: true,
            isValid: false
        };
        this.onInputFocus = () => {
            this.setState({ inputFocused: true });
            if (this.state.suggestions.length == 0) {
                this.fetchSuggestions();
            }
        };
        this.onInputBlur = () => {
            this.setState({ inputFocused: false });
            if (this.state.suggestions.length == 0) {
                this.fetchSuggestions();
            }
        };
        this.onInputChange = (value) => {
            this.setState({ query: value, suggestionsVisible: true }, () => {
                this.fetchSuggestions();
            });
        };
        this.fetchSuggestions = () => {
            fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Token ${this.props.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: this.state.query,
                    count: this.props.count ? this.props.count : 5,
                })
            })
                .then(response => response.json())
                .then(response => {
                    this.state.query && this.props.onFetch && this.props.onFetch(response.suggestions);
                    this.setState({suggestions: response.suggestions});
                    return response;
                  })
                .catch(error => console.log(error));
        };
        this.onSuggestionClick = (index, event) => {
            event.stopPropagation();
            this.selectSuggestion(index);
        };
        this.selectSuggestion = (index) => {
            const { onSelect } = this.props;
            const { query, suggestions } = this.state;
            if (suggestions.length >= index - 1) {
                const currentSuggestion = suggestions[index];
                if (suggestions.length === 1 || currentSuggestion.value === query) {
                    this.setState({ suggestionsVisible: false });
                    onSelect && onSelect(suggestions[index]);
                }
                else {
                    this.setState({ query: currentSuggestion.value }, () => this.fetchSuggestions());
                    this.textInputRef && this.textInputRef.focus();
                }
            }
        };
        this.renderTextInput = () => {
            const { inputStyle } = this.props;
            return (
                <Pressable>
                <Text style={this.state.inputFocused || Boolean(this.state.query) ? this.props.placeholderFocused : this.props.placeholderUnfocused}>{this.props.placeholder}</Text>
            <TextInput autoCapitalize="none" autoCorrect={false} editable={!this.props.disabled} onChangeText={this.onInputChange} onFocus={this.onInputFocus} onBlur={this.onInputBlur} ref={ref => (this.textInputRef = ref)} style={[styles.input, inputStyle]} value={this.state.query}/>
            </Pressable>
            );
        };
        this.renderSuggestionItem = ({ item, index }) => {
            const { renderItem: SuggestionItem } = this.props;
            return (<TouchableOpacity onPress={(e) => this.onSuggestionClick(index, e)}>
        <SuggestionItem item={item}/>
      </TouchableOpacity>);
        };
        this.resultListRef = React.createRef();
        this.textInputRef = React.createRef();
    }
    renderSuggestions() {
        const { ItemSeparatorComponent, keyExtractor, listStyle } = this.props;
        const { suggestions } = this.state;
        return (<FlatList keyboardShouldPersistTaps='handler' ref={this.resultListRef} data={suggestions} renderItem={this.renderSuggestionItem} keyExtractor={keyExtractor} ItemSeparatorComponent={ItemSeparatorComponent} style={[styles.list, listStyle]}/>);
    }
    render() {
        const { containerStyle, inputContainerStyle, listContainerStyle } = this.props;
        const { suggestions, suggestionsVisible } = this.state;
        return (<View style={[styles.container, containerStyle]}>
        <View style={[styles.inputContainer, inputContainerStyle]}>{this.renderTextInput()}</View>
        {suggestionsVisible && suggestions && suggestions.length > 0 && (<View style={listContainerStyle}>{this.renderSuggestions()}</View>)}
      </View>);
    }
}
AddressSuggestions.defaultProps = {
    disabled: false,
    ItemSeparatorComponent: null,
    keyExtractor: (item, index) => index.toString(),
    renderItem: ({ item }) => <Text>{item}</Text>,
    token: ''
};
const androidStyles = {
    inputContainer: {
        marginBottom: 0
    },
    list: {
        borderTopWidth: 0,
        margin: 10,
        marginTop: 0
    }
};
const iosStyles = {
    inputContainer: {},
    input: {
        height: 40,
        paddingLeft: 3
    },
    list: {
        borderTopWidth: 0,
        left: 0,
        position: 'absolute',
        right: 0
    }
};
const styles = StyleSheet.create(Object.assign({ container: {
        flex: 1,
        width: '100%',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    }, input: {
        height: 40,
        paddingLeft: 3
    } , 
    placeholderUnfocused: {
        color: '#8f9399',
        fontSize: 15,
        position: 'absolute',
        // left: 5,
        top: 16,
      },
      placeholderFocused: {
        color: '#8f9399',
        fontSize: 12,
        position: 'absolute',
        left: 2,
        top: 8,
      },}, 
Platform.select({
    android: Object.assign({}, androidStyles),
    ios: Object.assign({}, iosStyles)
})));
//# sourceMappingURL=AddressSuggestions.js.map