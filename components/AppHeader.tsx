import React, {Fragment} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import Button from '../components/Button';
import {ActivePage} from '../App';
import {sipgateIOLogo} from '../assets/images';

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
        <Fragment>
          {activePage === ActivePage.MAIN ? (
            <Button
              color="secondary"
              title="History"
              onPress={() => setActivePage(ActivePage.HISTORY)}
            />
          ) : (
            <Button
              color="secondary"
              title="Back"
              onPress={() => setActivePage(ActivePage.MAIN)}
            />
          )}
          <Button color="primary" title="Logout" onPress={logout} />
        </Fragment>
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
});

export default AppHeader;
