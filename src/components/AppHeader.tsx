import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {ActivePage} from '../App';
import {sipgateIOLogo} from '../../assets/images';
import {historyIcon, logoutIcon, faxIcon} from '../../assets/icons';

interface Props {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  logout: () => void;
  showControls: boolean;
}

const AppHeader = ({
  activePage,
  setActivePage,
  logout,
  showControls,
}: Props) => {
  return (
    <View style={styles.header}>
      <Image style={styles.logo} source={sipgateIOLogo} />
      {showControls && (
        <View style={styles.navigation}>
          {activePage === ActivePage.MAIN ? (
            <TouchableOpacity onPress={() => setActivePage(ActivePage.HISTORY)}>
              <Image style={styles.icon} source={historyIcon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setActivePage(ActivePage.MAIN)}>
              <Image style={styles.icon} source={faxIcon} />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={logout}>
            <Image style={styles.icon} source={logoutIcon} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    flexGrow: 0,
    flexShrink: 1,
  },
  logo: {
    width: 8 * 16,
    height: 4 * 16,
    resizeMode: 'contain',
  },
  icon: {
    height: 24,
    resizeMode: 'contain',
  },
  navigation: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default AppHeader;
