import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import colors from '../styles/colors';
import AuthRoutes from './tab.routes';
import { EpisodeView } from '../pages/EpisodeView';
import { AnimeDetailsView } from './../pages/AnimeDetailsView';
import { AnimeListView } from './../pages/AnimeListView';
import { AnimeCategoryView } from './../pages/AnimeCategoryView';
import { SearchResultsView } from './../pages/SearchResultsView';

const stackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => (

    <stackRoutes.Navigator

        headerMode="none"
        screenOptions={{
            cardStyle: {
                backgroundColor: colors.white
            }
        }}
    >
        <stackRoutes.Screen
            name="Home"
            component={AuthRoutes}
        />

        <stackRoutes.Screen
            name="Favorites"
            component={AuthRoutes}
        />

        <stackRoutes.Screen
            name="Category"
            component={AuthRoutes}
        />

        <stackRoutes.Screen
            name="EpisodeView"
            component={EpisodeView}
        />

        <stackRoutes.Screen
            name="AnimeDetailsView"
            component={AnimeDetailsView}
        />

        <stackRoutes.Screen
            name="AnimeListView"
            component={AnimeListView}
        />

        <stackRoutes.Screen
            name="AnimeCategoryView"
            component={AnimeCategoryView}
        />

        <stackRoutes.Screen
            name="SearchResultsView"
            component={SearchResultsView}
        />

    </stackRoutes.Navigator>

)

export default AppRoutes;