import React, { Component } from 'react'
import { View, ScrollView, Keyboard, SafeAreaView } from 'react-native'
import DriveHelper from '../Helpers/newDriveHelper'
import { updatePreferences } from '../Redux/actions'
import { Title, Surface, TextInput, Text, HelperText, RadioButton, Button } from 'react-native-paper';
import { GoogleSignin } from 'react-native-google-signin'
import { connect } from 'react-redux'
import DateTimePicker from 'react-native-modal-datetime-picker';

// Styles
import styles from './Styles/SettingsScreenStyles'

class SettingsScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDateTimePickerVisible: false,
            firstName: this.props.preferences.firstName,
            lastName: this.props.preferences.lastName,
            dateOfBirth: this.props.preferences.dateOfBirth,
            dateOfBirthError: false,
            primaryTheme: this.props.preferences.primaryTheme, //light or dark
            secondaryColor: this.props.preferences.secondaryColor, // blue, red, orange, green, purple, or pink
            usePassword: this.props.preferences.usePassword,
            password: this.props.preferences.password,
        };

        this._showDateTimePicker = this._showDateTimePicker.bind(this);
        this._hideDateTimePicker = this._hideDateTimePicker.bind(this);
        this._handleDatePicked = this._handleDatePicked.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.validate = this.validate.bind(this);
    }

    updateUser(e) {
        e.preventDefault();

        if (!this.state.usePassword) {
            this.setState({ password: '' });
        }

        if (this.validate()) {
            const userData = {
                "firstName": this.state.firstName,
                "lastName": this.state.lastName,
                "dateOfBirth": this.state.dateOfBirth,
                "appLaunches": 1,
                "primaryTheme": this.state.primaryTheme,
                "secondaryColor": this.state.secondaryColor,
                "usePassword": this.state.usePassword,
                "password": this.state.password,
            };
            DriveHelper.patchFile(this.props.accessToken, userData, '0', this.props.preferencesId);
            // TODO: Snackbar showing success or failure
        }
    }

    validate() {
        if(this.state.dateOfBirth === '') {
            this.setState({dateOfBirthError: true});
            return false;
        } else {
            if(new Date(this.state.dateOfBirth) < new Date()) {
                this.setState({dateOfBirthError: false});
                return true;
            }
            this.setState({dateOfBirthError: true});
            return false;
        }
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        const dateObject = date;
        const formattedMonth = (dateObject.getMonth() + 1).toString().length === 1 ? "0" + (dateObject.getMonth() + 1) : dateObject.getMonth() + 1;
        const dateNumber = dateObject.getDate();
        const formattedDate = dateNumber / 10 < 1 ? "0" + dateNumber : dateNumber;
        const dateString = dateObject.getFullYear() + "-" + formattedMonth + "-" + formattedDate;

        this.setState({
            dateOfBirth: dateString
        })
        this._hideDateTimePicker();
    };

    render() {
        const { replace } = this.props.navigation;
        return (
            <SafeAreaView style={styles.mainContainer}>
                <ScrollView>
                    <View style={styles.centerContainer}>
                        <Surface style={styles.surface}>
                            <Text style={styles.titleText}>Sign Out</Text>
                            <Button mode="outlined" onPress={() => {GoogleSignin.signOut(); replace("LaunchScreen")}}>
                                Sign Out
                            </Button>
                        </Surface>
                        <Surface style={styles.surface}>
                            <Text style={styles.titleText}>When would you like to start tallying from?</Text>
                            <TextInput
                                style={styles.dateSelector}
                                mode='outlined'
                                label='Start/Birth Date'
                                value={this.state.dateOfBirth}
                                onFocus={() => { Keyboard.dismiss(); this._showDateTimePicker(); }}
                            />
                            <HelperText
                                type="error"
                                visible={this.state.dateOfBirthError}
                                >
                                Start date is invalid (cannot be in the future)
                            </HelperText>
                        </Surface>
                        <Surface style={styles.surface}>
                            <Text style={styles.titleText}>Which theme do you prefer?</Text>
                            <RadioButton.Group
                                onValueChange={primaryTheme => this.setState({ primaryTheme })}
                                value={this.state.primaryTheme}
                            >
                                <View style={styles.radioGroup}>
                                    <View style={styles.leftRadio}>
                                        <Text>Light</Text>
                                        <RadioButton.Android value="light" />
                                    </View>
                                    <View style={styles.rightRadio}>
                                        <Text>Dark</Text>
                                        <RadioButton.Android value="dark" disabled={true} />
                                    </View>
                                </View>
                            </RadioButton.Group>
                        </Surface>
                        <Surface style={styles.surface}>
                            <Text style={styles.titleText}>Would you like to use a password?</Text>
                            <RadioButton.Group
                                onValueChange={usePassword => this.setState({ usePassword })}
                                value={this.state.usePassword}
                            >
                                <View style={styles.radioGroup}>
                                    <View style={styles.leftRadio}>
                                        <Text>Yes</Text>
                                        <RadioButton.Android value={true} />
                                    </View>
                                    <View style={styles.rightRadio}>
                                        <Text>No</Text>
                                        <RadioButton.Android value={false} />
                                    </View>
                                </View>
                            </RadioButton.Group>
                        </Surface>
                        <Surface style={this.state.usePassword ? styles.surface : styles.none}>
                            <Text style={styles.titleText}>What would you like your password to be?</Text>
                            <TextInput
                                secureTextEntry={true}
                                style={styles.dateSelector}
                                mode='outlined'
                                label='Password'
                                value={this.state.password}
                                onChangeText={password => this.setState({ password })}
                            />
                        </Surface>
                        <Button mode="outlined" onPress={this.updateUser} style={styles.submitButton}>
                            Update Settings
                        </Button>
                    </View>
                </ScrollView>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        accessToken: store.userInfo.userInfo.accessToken,
        preferencesId: store.userInfo.preferencesId,
        preferences: store.preferences.preferences,
    }
}

export default connect(
    mapStateToProps,
    { updatePreferences }
)(SettingsScreen)