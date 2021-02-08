import React from 'react';
import PropTypes from 'prop-types';
import { View } from "react-native";
import { coreStyles } from "../styles";
import { connect } from "react-redux";
import { Button } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {

    return (
        <View style={coreStyles.container}>
            <View style={{ padding: 16, display: 'flex', flexDirection: 'column' }}>
                <Button mode={'contained'} style={{ marginBottom: 8 }} onPress={() => navigation.navigate('simple_form')}>Simple Validation</Button>
                <Button mode={'contained'} style={{ marginBottom: 8 }} onPress={() => navigation.navigate('advanced_form')}>Advanced Validation</Button>
                <Button mode={'contained'} style={{ marginBottom: 8 }} onPress={() => navigation.navigate('paginated_form')}>Paginated Advanced Validation</Button>
            </View>
        </View>
    );
};

HomeScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);