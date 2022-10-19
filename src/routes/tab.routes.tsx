import React from 'react';
import {
    createBottomTabNavigator
} from '@react-navigation/bottom-tabs'

import colors from '../styles/colors';

import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Home } from '../pages/Home';
import { Favorites } from '../pages/Favorites';
import { Category } from '../pages/Category';

const AppTab = createBottomTabNavigator();

const AuthRoutes = () => {

    return (
        <AppTab.Navigator
            tabBarOptions={{
                activeTintColor: colors.blue,
                inactiveTintColor: colors.white,
                labelPosition: 'beside-icon',
                style: {
                    paddingVertical: Platform.OS == 'ios' ? 20 : 0,
                    height: 70,
                    backgroundColor: colors.background,
                    paddingBottom: 14,
                    borderTopColor: colors.background
                },
            }}>
                <AppTab.Screen
                    name="Inicio"
                    component={Home}
                    options={{
                        tabBarIcon: (({ size, color }) => (
                            <MaterialIcons
                                name="home"
                                size={size-5}
                                color={color}
                            />
                        ))
                    }}
                />

                <AppTab.Screen
                    name="Favoritos"
                    component={Favorites}
                    options={{
                        tabBarIcon: (({ size, color }) => (
                            <MaterialIcons
                                name="favorite"
                                size={size-5}
                                color={color}
                            />
                        ))
                    }}
                /> 

                <AppTab.Screen
                    name="Categorias"
                    component={Category}
                    options={{
                        tabBarIcon: (({ size, color }) => (
                            <MaterialIcons
                                name="format-list-bulleted"
                                size={size-5}
                                color={color}
                            />
                        ))
                    }}
                />

        </AppTab.Navigator>
    )
}

export default AuthRoutes;