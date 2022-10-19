import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacityProps,
    View,
} from 'react-native';

import { Video } from 'expo-av';

import Slider from '@react-native-community/slider';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, RectButtonProps } from 'react-native-gesture-handler';
import { loadEpisode, Stream, StreamSave } from '../libs/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';

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

interface ButtonParams extends TouchableOpacityProps {
    name: string | undefined,
    episode: Stream | undefined,
    click: any,
    style: any,
    uri: any,
    getPosition: any,
    getMaxDuration: any
}


export function VideoPlayer({ name, episode, click, style, uri, getPosition, getMaxDuration }: ButtonParams) {

    const navigation = useNavigation()

    const [status, setStatus]: any = useState<any>();
    const [duration, setDuration]: any = useState(0)
    const [maxDuration, setMaxDuration]: any = useState(0)
    const [pause, setPause] = useState(true);

    const [optionsVisible, setOptionsVisible] = useState(false);
    const [fullScreenButton, setFullScreenButton] = useState(false);

    const [initialPosition, setInitialPosition] = useState(0);
    const [shouldPlay, setShouldPlay] = useState(false);

    let videoRef: any = React.useRef(null);
    const mountedRef = useRef(true)

    function handleRemoveSeconds() {
        videoRef.setPositionAsync(status.positionMillis - 10000)
    }

    function handleAddSeconds() {
        videoRef.setPositionAsync(status.positionMillis + 10000)
    }

    function handleChangePosition(value: number) {
        videoRef.setPositionAsync(value)
    }

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

    async function loadEpisodeState() {

        try {
            const data = await AsyncStorage.getItem('@animex:' + episode?.category_id);
            const episodesState: any = data ? (JSON.parse(data) as StreamSave) : {};

            if (episodesState[0]) {

                episodesState.map((item: StreamSave) => {
                    if (item.video_id == episode?.video_id) {
                        console.log('Setou a posição inicial')
                        setInitialPosition(item.duration)
                    }
                    console.log(item, episode)
                })
                
            }

            setShouldPlay(true);
            //console.log("Com o salvamento a lista ficou assim: ", episodesState)
        } catch (Error) {
            console.log(Error)
        }
    }


    useEffect(() => {
        setInitialPosition(0);
        setDuration(0);
        loadEpisodeState();
        return () => { 
            mountedRef.current = false
        }
    }, [uri])

    return (

        <View
            onTouchStart={() => {
                showOptions();
            }}
            style={styles.container}
        >

            <Video
                ref={(ref) => videoRef = ref}
                style={[styles.video, style]}
                source={{
                    uri: uri,
                }}
                useNativeControls={false}
                onReadyForDisplay={() => {
                    loadEpisodeState();
                    showOptions();
                }}
                positionMillis={initialPosition}
                shouldPlay={shouldPlay}
                resizeMode="contain"
                isLooping={false}
                progressUpdateIntervalMillis={1000}

                onPlaybackStatusUpdate={(statusUpdate: any) => {
                    if (statusUpdate.isLoaded) {

                        setStatus(statusUpdate)
                        getPosition(statusUpdate.positionMillis)
                        getMaxDuration(statusUpdate.durationMillis)

                        var minutes = Math.floor(statusUpdate.positionMillis / 60000);
                        var seconds = ((statusUpdate.positionMillis % 60000) / 1000).toFixed(0);
                        setDuration(minutes + ":" + (Number(seconds) < 10 ? '0' : '') + Number(seconds))
                        var minutes = Math.floor(statusUpdate.durationMillis / 60000);
                        var seconds = ((statusUpdate.durationMillis % 60000) / 1000).toFixed(0);
                        setMaxDuration(minutes + ":" + (Number(seconds) < 10 ? '0' : '') + Number(seconds))
                    }
                }}
            />





            {
                optionsVisible ? <View style={[styles.videoOptionsContainer, fullScreenButton && { height: 400, }]}>
                    <View style={styles.videoHeader}>
                        <Text style={styles.videoName}>{name}</Text>

                        <TouchableOpacity
                            onPress={() => {
                                click()
                                setFullScreenButton(!fullScreenButton)
                            }}
                        >
                            <MaterialIcons
                                name={fullScreenButton ? 'close-fullscreen' : 'fullscreen'}
                                size={26}
                                color={'white'}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.videoManagerContainer, fullScreenButton && { paddingTop: 130, }]}>
                        <TouchableOpacity onPress={handleRemoveSeconds} style={styles.videoSkip}>
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
                        <TouchableOpacity onPress={handleAddSeconds} style={styles.videoSkip}>
                            <MaterialIcons
                                name={'update'}
                                color={'white'}
                                size={24}
                            />
                            <Text style={styles.textSkip}>+10 segundos</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={[styles.videoDurationContent, fullScreenButton && { paddingTop: 95, }]}>
                        <Text style={styles.videoDurationText}>{duration}</Text>
                        <Slider
                            style={styles.videoProgress}
                            value={status?.positionMillis}
                            onValueChange={(e) => handleChangePosition(e)}
                            minimumValue={0}
                            maximumValue={status?.durationMillis || 0}
                            minimumTrackTintColor={colors.blue}
                            maximumTrackTintColor={colors.blue_light}
                            thumbTintColor={colors.blue}
                        />


                        <Text style={styles.videoDurationText}>{maxDuration}</Text>

                    </View>
                </View> : <></>
            }

        </View>
    )

}

const styles = StyleSheet.create({

    container: {
        backgroundColor: 'black',
        width: '100%'
    },

    video: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 240
    },

    videoName: {
        fontFamily: fonts.heading,
        color: colors.white
    },

    videoOptionsContainer: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
        width: '100%',
        bottom: 0,
    },

    videoProgress: {
        width: '80%',

    },

    videoDurationContent: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 4,
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
        padding: 60,
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