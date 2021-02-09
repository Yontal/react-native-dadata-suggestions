"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressSuggestions = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const styles_1 = require("./styles");
const defaultKeyExtractor = (item, index) => index;
const defaultItemRenderer = ({ item }) => <react_native_1.Text>{item}</react_native_1.Text>;
class AddressSuggestions extends react_1.default.PureComponent {
    constructor(props) {
        var _a;
        super(props);
        this.state = {
            query: (_a = this.props.query) !== null && _a !== void 0 ? _a : '',
            inputFocused: false,
            suggestions: [],
            suggestionsVisible: true,
            isValid: false,
        };
        this.onInputFocus = () => {
            this.setState({ inputFocused: true });
            if (this.state.suggestions.length === 0) {
                this.fetchSuggestions();
            }
        };
        this.onInputBlur = () => {
            this.setState({ inputFocused: false });
            if (this.state.suggestions.length === 0) {
                this.fetchSuggestions();
            }
        };
        this.onInputChange = (value) => {
            this.setState({ query: value, suggestionsVisible: true }, () => {
                this.fetchSuggestions();
            });
        };
        this.fetchSuggestions = () => {
            const { count = 5, token = '' } = this.props;
            const { query } = this.state;
            fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    count,
                    query,
                }),
            })
                .then(response => response.json())
                .then(response => {
                this.state.query && this.props.onFetch && this.props.onFetch(response.suggestions);
                this.setState({ suggestions: response.suggestions });
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
            const { disabled = false, inputStyle, placeholder = '' } = this.props;
            return (<react_native_1.TextInput autoCapitalize="none" autoCorrect={false} editable={!disabled} onChangeText={this.onInputChange} onFocus={this.onInputFocus} onBlur={this.onInputBlur} placeholder={placeholder} ref={ref => (this.textInputRef = ref)} style={[styles_1.styles.input, inputStyle]} value={this.state.query}/>);
        };
        this.renderSuggestionItem = ({ item, index }) => {
            const { renderItem: SuggestionItem = defaultItemRenderer } = this.props;
            return (<react_native_1.TouchableOpacity onPress={(e) => this.onSuggestionClick(index, e)}>
        <SuggestionItem item={item}/>
      </react_native_1.TouchableOpacity>);
        };
        this.renderSuggestions = () => {
            const { ItemSeparatorComponent = null, keyExtractor, listStyle } = this.props;
            const { suggestions } = this.state;
            return (<react_native_1.FlatList ref={this.resultListRef} data={suggestions} renderItem={this.renderSuggestionItem} keyExtractor={keyExtractor !== null && keyExtractor !== void 0 ? keyExtractor : defaultKeyExtractor} ItemSeparatorComponent={ItemSeparatorComponent} style={[styles_1.styles.list, listStyle]}/>);
        };
        this.resultListRef = react_1.default.createRef();
        this.textInputRef = react_1.default.createRef();
    }
    render() {
        const { containerStyle, inputContainerStyle, listContainerStyle } = this.props;
        const { suggestions, suggestionsVisible } = this.state;
        return (<react_native_1.View style={[styles_1.styles.container, containerStyle]}>
        <react_native_1.View style={[styles_1.styles.inputContainer, inputContainerStyle]}>{this.renderTextInput()}</react_native_1.View>
        {suggestionsVisible && suggestions && suggestions.length > 0 && (<react_native_1.View style={listContainerStyle}>{this.renderSuggestions()}</react_native_1.View>)}
      </react_native_1.View>);
    }
}
exports.AddressSuggestions = AddressSuggestions;
//# sourceMappingURL=AddressSuggestions.js.map