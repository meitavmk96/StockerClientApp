import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Icon } from 'react-native-elements';

export default function FCFilter(props) {

    const HandleFilterPress = () => {
        props.HandleFilterPress();
    };

    return (
        <View>
            <TouchableOpacity onPress={HandleFilterPress}>
                <Icon
                    name="filter"
                    type="font-awesome"
                    color="#517fa4"
                />
            </TouchableOpacity>
        </View>
    )
}