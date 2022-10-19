import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useRoute, useNavigation } from '@react-navigation/core';
import { Stream } from '../libs/storage';
import { Video } from 'expo-av';

import { Colors, ProgressBar } from 'react-native-paper';

import colors from '../styles/colors';
import * as ScreenOrientation from 'expo-screen-orientation';
import fonts from '../styles/fonts';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Params extends Stream {
    episodeDetails: Stream
}

interface StatusParams {
    androidImplementation: string,
    didJustFinish: boolean,
    durationMillis: number,
    isBuffering: boolean,
    isLoaded: boolean,
    isLooping: boolean,
    isMuted: boolean,
    isPlaying: boolean,
    playableDurationMillis: number,
    positionMillis: number,
    progressUpdateIntervalMillis: number,
    rate: number,
    shouldCorrectPitch: boolean,
    shouldPlay: boolean,
    uri: string,
    volume: number,
}

export function FullScreenVideoPlayer() {

    const route = useRoute();

    //const { episodeDetails } = route.params as Params;

    const [status, setStatus]: any = useState<StatusParams>();
    const [progress, setProgress] = useState(0)
    const [duration, setDuration]: any = useState(0)
    const [maxDuration, setMaxDuration]: any = useState(0)
    const [pause, setPause] = useState(true);

    const [optionsVisible, setOptionsVisible] = useState(false);
    const [fullScreenButton, setFullScreenButton] = useState(false);
    let videoRef: any = React.useRef(null);

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        videoRef.presentFullscreenPlayer()
    }, [])

    function showOptions() {
        if (!optionsVisible) {
            setOptionsVisible(true)
            setTimeout(() => {
                setOptionsVisible(false)
            }, 3000);
        }
    }

    function videoPause() {
        setPause(!pause)
        if (status.isPlaying) {
            videoRef.pauseAsync()
        } else {
            videoRef.playAsync()
        }
    }


    return (

        <View onTouchStart={() => { showOptions() }} style={styles.container}>
            <Video
                ref={(ref) => videoRef = ref}
                style={styles.video}
                source={{
                    uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
                }}
                useNativeControls={false}
                onReadyForDisplay={() => {
                    showOptions();
                }}
                shouldPlay={true}
                resizeMode="contain"
                isLooping={false}
                positionMillis={0}
                usePoster={true}
                onFullscreenUpdate={(e) => {
                    console.log(status)

                    if (e.fullscreenUpdate == 1) {
                        ScreenOrientation.unlockAsync()
                        //ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
                    }

                    if (e.fullscreenUpdate == 3) {
                        ScreenOrientation.unlockAsync()
                        //ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
                    }
                    console.log(e)
                }}
                onPlaybackStatusUpdate={(status: any) => {
                    setStatus(status)
                    setProgress(status?.positionMillis / status?.durationMillis);
                    var minutes = Math.floor(status.positionMillis / 60000);
                    var seconds = ((status.positionMillis % 60000) / 1000).toFixed(0);
                    setDuration(minutes + ":" + (Number(seconds) < 10 ? '0' : '') + Number(seconds))
                    var minutes = Math.floor(status.durationMillis / 60000);
                    var seconds = ((status.durationMillis % 60000) / 1000).toFixed(0);
                    setMaxDuration(minutes + ":" + (Number(seconds) < 10 ? '0' : '') + Number(seconds))
                }}
            />

            {
                optionsVisible ? <View style={styles.videoOptionsContainer}>
                    <View style={styles.videoHeader}>
                        <TouchableOpacity>
                            <MaterialIcons
                                name={'tune'}
                                size={26}
                                color={'white'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <MaterialIcons
                                name={fullScreenButton ? 'close-fullscreen' : 'fullscreen'}
                                size={26}
                                color={'white'}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.videoManagerContainer}>
                        <TouchableOpacity style={styles.videoSkip}>
                            <MaterialIcons
                                name={'restore'}
                                color={'white'}
                                size={24}
                            />
                            <Text style={styles.textSkip}>-10 segundos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={videoPause}>
                            <MaterialIcons
                                name={pause ? 'pause' : 'play-arrow'}
                                color={'white'}
                                size={64}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.videoSkip}>
                            <MaterialIcons
                                name={'update'}
                                color={'white'}
                                size={24}
                            />
                            <Text style={styles.textSkip}>+10 segundos</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.videoDurationContent}>

                        <ProgressBar style={styles.videoProgress} progress={progress} color={colors.blue} />
                        <View style={styles.videoDuration}>
                            <Text style={styles.videoDurationText}>{duration}</Text>
                            <Text style={styles.videoDurationText}>{maxDuration}</Text>
                        </View>
                    </View>
                </View> : <></>
            }


        </View>



    )

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'black',
    },

    video: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 420
    },

    videoOptionsContainer: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
        width: '100%',
        bottom: 0,
    },

    videoProgress: {
        width: '100%',
        height: 5,

    },

    videoDurationContent: {
        paddingHorizontal: 12,
        bottom: 6
    },

    videoDuration: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    videoDurationText: {
        fontFamily: fonts.heading,
        color: colors.white
    },

    videoManagerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 55,
        marginBottom: 0
    },

    videoSkip: {
        alignItems: 'center',
        marginTop: 14,
        marginHorizontal: 50,

    },

    textSkip: {
        color: 'white',
        fontFamily: fonts.text,
        fontSize: 12
    },

    videoHeader: {
        top: 10,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        flexDirection: 'row'
    }

})