import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    Animated,
    TouchableOpacity,
    SafeAreaView,
    View,
    ImageBackground
} from 'react-native'
import Front from './Front'
import Back from './Back'
import { connect } from 'react-redux'

class Play extends Component {

    state = {
        showingBack: false,
        rotate: new Animated.Value(0),
        value: 0,
        index: 0,
        qtdOfCorrectAnswer: 0
    }

    componentDidMount() {
        const { rotate } = this.state

        rotate.addListener(({ value }) => {
            this.setState({
                value
            })
        })
    }

    handleRotate = (callback) => {
        const { rotate, value, showingBack } = this.state

        if (value >= 90) {
            Animated.spring(rotate, {
                toValue: 0,
                tension: 10,
                friction: 8
            }).start()
        } else {
            Animated.spring(rotate, {
                toValue: 180,
                tension: 10,
                friction: 8
            }).start()
        }

        this.setState({
            showingBack: !showingBack
        })

        if (typeof callback === 'function') {
            callback()
        }
    }

    handleScore = answer => {
        this.setState(prevState => ({
            index: prevState.index + 1,
            qtdOfCorrectAnswer: answer === true ? prevState.qtdOfCorrectAnswer + 1 : prevState.qtdOfCorrectAnswer
        }))
    }

    resetData = () => {
        this.state.rotate.setValue(0)

        this.setState({
            index: 0,
            qtdOfCorrectAnswer: 0
        })
    }

    render() {
        const { showingBack, rotate, index, qtdOfCorrectAnswer } = this.state
        const { deck } = this.props
        const { questions } = deck

        const RotateData = rotate.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg']
        })

        const RotateData1 = rotate.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '0deg']
        })

        if (index === questions.length) {
            const grade = (qtdOfCorrectAnswer / questions.length) * 100
            return (
                <ImageBackground
                    source={require('../images/background.jpg')}
                    style={[styles.bgImage, { justifyContent: 'center', alignItems: 'center' }]}>
                    <View style={styles.resultContainer}>
                        {grade >= 60
                            ? <Text style={[styles.resultText, { color: '#4cae4c' }]}>{grade}%. You Rock 😁</Text>
                            : <Text style={[styles.resultText, { color: '#d43f3a' }]}>You did {grade}% ☹️</Text>}
                        <TouchableOpacity
                            style={[styles.button, styles.btnSuccess, { marginTop: 25 }]}
                            onPress={this.resetData}>
                            <Text style={styles.btnTextWhite}>Back to Deck</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground >
            )
        }

        return (
            <ImageBackground
                source={require('../images/background.jpg')}
                style={styles.bgImage}>
                <View style={styles.container}>
                    {showingBack === false && (
                        <View>
                            <Animated.View
                                style={[{ transform: [{ rotateY: RotateData }] }, styles.height]}>
                                <Front question={questions[index].question} />
                            </Animated.View>
                            <View style={styles.btnGroup}>
                                <TouchableOpacity onPress={() => this.handleRotate()} style={styles.button}>
                                    <Text style={styles.btnText}>Show Answer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {showingBack === true && (
                        <View>
                            <Animated.View
                                style={[{ transform: [{ rotateY: RotateData1 }] }, styles.height]}>
                                <Back
                                    answer={questions[index].answer}
                                    handleRotate={this.handleRotate} />
                            </Animated.View>
                            <View style={styles.btnGroup}>
                                <TouchableOpacity
                                    onPress={() => this.handleRotate(() => this.handleScore(false))}
                                    style={[styles.button, styles.btnDanger, { borderBottomLeftRadius: 10 }]}>
                                    <Text style={styles.btnTextWhite}>Incorrect</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.handleRotate(() => this.handleScore(true))}
                                    style={[styles.button, styles.btnSuccess, { borderBottomRightRadius: 10 }]}>
                                    <Text style={styles.btnTextWhite}>Correct</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    bgImage: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 300,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
    },
    btnGroup: {
        flexDirection: 'row',
        height: 35,
    },
    btnDanger: {
        width: 150,
        borderColor: '#d43f3a',
        backgroundColor: '#d9534f',
        borderRadius: 0,
    },
    btnSuccess: {
        width: 150,
        borderColor: '#4cae4c',
        backgroundColor: '#5cb85c',
        borderRadius: 0,
    },
    btnText: {
        fontSize: 20,
        color: '#939292',
        fontFamily: 'MontserratSemiBold',
    },
    btnTextWhite: {
        fontSize: 20,
        color: '#fff',
        fontFamily: 'MontserratSemiBold',
    },
    height: {
        height: 500
    },
    resultContainer: {
        width: 300,
        height: 500,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultText: {
        fontSize: 28,
        color: 'black',
        fontFamily: 'MontserratSemiBold',
        textAlign: 'center'
    },
})

const mapStateToProps = ({ decks: { decks } }, { navigation }) => {
    const { id } = navigation.state.params
    const deck = decks.find(deck => deck.id === id)

    return {
        deck
    }
};

export default connect(mapStateToProps)(Play)