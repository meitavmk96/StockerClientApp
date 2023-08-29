import { View } from 'react-native'
import React, { useState,useEffect } from 'react'
import { SearchBar } from 'react-native-elements';

export default function FCSearchBar(props) {
    const [search, setSearch] = useState('');

    const updateSearch = (search) => {
        setSearch(search);
        props.handleSearch(search);
    };

    useEffect(() => {
        if (props.clearSearch) {
            setSearch('');
            updateSearch('');
            props.handleSetClearSearch(false);
        }
    }, [props.clearSearch]);

    return (
        <View>
            <SearchBar
                placeholder="חיפוש"
                onChangeText={updateSearch}
                value={search}
                inputContainerStyle={{ backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1.5, borderColor: '#E1EAF9', borderBottomWidth: 1.5, height: 40 }}
                containerStyle={{ backgroundColor: '#ffffff', borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
            />
        </View>
    );
}