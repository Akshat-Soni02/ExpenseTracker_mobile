import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SearchBarProps = {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceTime?: number;
  inputProps?: TextInputProps;
  containerStyle?: object;
  value: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Search...",
    onSearch,
    value,
    debounceTime = 1500,
    inputProps,
    containerStyle
  }) => {
    const [query, setQuery] = useState(value);
  
    // Sync internal state when parent value changes (optional but good)
    useEffect(() => {
      setQuery(value);
    }, [value]);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        onSearch(query.trim());
      }, debounceTime);
  
      return () => clearTimeout(handler);
    }, [query]);
  
    return (
      <View style={[styles.container, containerStyle]}>
        <Ionicons name="search" size={20} color="#999" style={styles.icon} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          style={styles.input}
          {...inputProps}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
      },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    icon: {
        marginHorizontal: 4,
    },
});
  