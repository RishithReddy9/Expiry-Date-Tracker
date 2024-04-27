import React, { useState, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const TickAnimation = ({ showModal }) => {
    const [animation] = useState(new Animated.Value(0));

    useEffect(() => {
        if (showModal) {
            startAnimation();
        }
    }, [showModal]);

    const startAnimation = () => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View
            style={{
                opacity: animation,
                transform: [
                    {
                        scale: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 1],
                        }),
                    },
                ],
            }}
        >
            <View style={styles.successCheckmark}>
                <View style={styles.checkIcon}>
                    <View style={styles.iconLine}></View>
                    <View style={[styles.iconLine, styles.lineLong]}></View>
                    <View style={styles.iconCircle}></View>
                    <View style={styles.iconFix}></View>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    successCheckmark: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkIcon: {
        position: 'relative',
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    iconLine: {
        position: 'absolute',
        backgroundColor: '#4CAF50',
        height: 5,
        borderRadius: 2,
    },
    lineLong: {
        width: 40,
        top: 38,
        right: 12,
        transform: [{ rotate: '-45deg' }],
    },
    iconCircle: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'rgba(76, 175, 80, 0.5)',
    },
    iconFix: {
        position: 'absolute',
        top: 40,
        width: 5,
        height: 20,
        left: 25,
        transform: [{ rotate: '-45deg' }],
        backgroundColor: '#4CAF50',
    },
});

export default TickAnimation;
