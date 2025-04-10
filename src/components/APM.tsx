import React, { useEffect } from 'react';
import { View } from 'react-native';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ParamListBase,
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import {
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import merge from 'deepmerge';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SnackBar from './commonui/Snackbar';
import Home from './portrait/View';
import { useNoxSetting } from '@stores/useApp';
import PlaylistDrawer from './playlists/View';
import { NoxRoutes } from '../enums/Routes';
import Settings from './setting/View';
import Explore from './explore/View';
import '../localization/i18n';
import { ScreenIcons } from '@enums/Icons';
import NoxBottomTab from './bottomtab/NoxBottomTab';
import NoxMiniPlayer from './miniplayer/View';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

const HomeIcon = () => <IconButton icon={ScreenIcons.HomeScreen} />;
const ExploreIcon = () => <IconButton icon={ScreenIcons.ExploreScreen} />;
const SettingIcon = () => <IconButton icon={ScreenIcons.SettingScreen} />;

const AzusaPlayer = () => {
  const { t } = useTranslation();
  const Drawer = createDrawerNavigator();
  const playerStyle = useNoxSetting(state => state.playerStyle);
  const defaultTheme = playerStyle.metaData.darkTheme
    ? CombinedDarkTheme
    : CombinedDefaultTheme;
  const defaultNavTheme = playerStyle.metaData.darkTheme
    ? NavigationDarkTheme
    : NavigationDefaultTheme;
  const insets = useSafeAreaInsets();
  const [navigation, setNavigation] =
    React.useState<DrawerNavigationProp<ParamListBase>>();

  const APMHome = ({ navigation }: NoxComponent.NavigationProps) => {
    useEffect(() => setNavigation(navigation), []);
    return <Home />;
  };

  return (
    <PaperProvider
      theme={{
        ...defaultTheme,
        colors: playerStyle.colors,
      }}
    >
      <NavigationContainer
        theme={{
          ...defaultTheme,
          colors: {
            ...defaultTheme.colors,
            ...playerStyle.colors,
            // HACK: compensate for my bad design. now applying background
            // at MainBackground level instaed of here.
            background: undefined,
          },
          fonts: defaultNavTheme.fonts,
        }}
      >
        <View
          style={{
            flex: 1,
            // Paddings to handle safe area
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          }}
        >
          <Drawer.Navigator
            initialRouteName={NoxRoutes.PlayerHome}
            drawerContent={PlaylistDrawer}
            screenOptions={{
              drawerType: 'slide',
              drawerStyle: {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
            }}
          >
            <Drawer.Screen
              name={NoxRoutes.PlayerHome}
              options={{
                drawerIcon: HomeIcon,
                title: t('appDrawer.homeScreenName'),
                header: () => null,
              }}
              component={APMHome}
            />
            <Drawer.Screen
              name={NoxRoutes.Explore}
              options={{
                drawerIcon: ExploreIcon,
                title: t('appDrawer.exploreScreenName'),
                header: () => null,
              }}
              component={Explore}
            />
            <Drawer.Screen
              name={NoxRoutes.Settings}
              options={{
                drawerIcon: SettingIcon,
                title: t('appDrawer.settingScreenName'),
                header: () => null,
              }}
              component={Settings}
            />
          </Drawer.Navigator>
          <NoxMiniPlayer />
          <NoxBottomTab navigation={navigation} />
        </View>
      </NavigationContainer>
      <SnackBar />
    </PaperProvider>
  );
};

export default AzusaPlayer;
