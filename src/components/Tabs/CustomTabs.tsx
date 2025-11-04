import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Searchbar } from 'react-native-paper';
import styles from './styles';
import { clearLoginData } from '../../redux/slices/loginSlice';
import { useDispatch } from "react-redux";
import moment from 'moment';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CustomTabs = ({ navigation, title = 'Tabs', tabs: initialTabs = [] }) => {
  const [activeTab, setActiveTab] = useState(initialTabs?.[0]?.name || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [tabs, setTabs] = useState(initialTabs);
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const contentTranslateX = useRef(new Animated.Value(0)).current;
  const indicatorTranslateX = useRef(new Animated.Value(0)).current;
  const prevTabIndex = useRef(0);
  const [showIndicator, setShowIndicator] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setTabs(initialTabs);
  }, [initialTabs]);

  const filterTickets = (tickets, query) => {
    if (!query) return tickets;
    const lowerQuery = query?.toLowerCase();

    return tickets?.filter((ticket) =>
      ticket?.TicketSeqnumber?.toLowerCase()?.includes(lowerQuery) ||
      ticket?.DepartmentName?.toLowerCase()?.includes(lowerQuery) ||
      ticket?.Title?.toLowerCase()?.includes(lowerQuery) ||
      ticket?.TicketDescription?.toLowerCase()?.includes(lowerQuery) ||
      ticket?.AssignedTo?.Title?.toLowerCase()?.includes(lowerQuery) ||
      ticket?.RequesterName?.toLowerCase()?.includes(lowerQuery) ||
      moment(ticket?.Created)?.format('MM/DD/YYYY')?.includes(lowerQuery)
    );
  };

  const getFilteredTabs = () => {
    return tabs.map((tab) => ({
      ...tab,
      filteredData: filterTickets(tab?.data || [], searchQuery),
      label: `${tab?.name} (${filterTickets(tab?.data || [], searchQuery)?.length})`,
    }));
  };

  const [filteredTabs, setFilteredTabs] = useState(getFilteredTabs());

  useEffect(() => {
    setFilteredTabs(getFilteredTabs());
  }, [searchQuery, tabs]);

  const getActiveTabIndex = (tabName) => {
    return tabs.findIndex((tab) => tab?.name === tabName);
  };

  const calculateTabWidth = (text) => {
    const baseWidth = 10;
    const charWidth = 8;
    const padding = 10;
    return baseWidth + (text?.length || 0) * charWidth + padding;
  };

  const calculateIndicatorWidth = (text) => {
    return calculateTabWidth(text) - 10;
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeSearch = () => {
    Animated.timing(translateX, {
      toValue: SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsSearchOpen(false);
      setSearchQuery('');
    });
  };

  const toggleMoreOptions = () => {
    setIsMoreOptionsOpen(!isMoreOptionsOpen);
  };

  const onSignOut = () => {
    dispatch(clearLoginData());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  React.useLayoutEffect(() => {
    navigation?.setOptions?.({
      title: title || 'Tabs',
      headerRight: () => (
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={onSignOut} style={styles.headerIconButton}>
            <MaterialIcons name="logout" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, title]);
  const opacity = translateX.interpolate({
    inputRange: [0, SCREEN_WIDTH],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const handleTabChange = (tabName, index) => {
    const currentIndex = getActiveTabIndex(activeTab);
    const isMovingRight = index > currentIndex;
    const slideOutDirection = isMovingRight ? -SCREEN_WIDTH : SCREEN_WIDTH;
    const slideInDirection = isMovingRight ? SCREEN_WIDTH : -SCREEN_WIDTH;

    let targetIndicatorPosition = 0;
    for (let i = 0; i < index; i++) {
      const tabLabel = filteredTabs?.[i]?.label || filteredTabs?.[i]?.name || 'Tab';
      targetIndicatorPosition += calculateTabWidth(tabLabel);
    }

    if (tabs?.length > 3 && index >= 2) {
      const newTabs = [...tabs];
      const temp = newTabs?.[1];
      newTabs[1] = newTabs?.[index];
      newTabs[index] = temp;
      setTabs(newTabs);
      targetIndicatorPosition = calculateTabWidth(filteredTabs?.[0]?.label || filteredTabs?.[0]?.name || 'Tab');
      index = 1;
    }

    const shouldAnimateIndicator = !(tabs?.length > 3 && index >= 2);

    setShowIndicator(tabs?.length <= 3 || index < 2);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(contentTranslateX, {
          toValue: slideOutDirection,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateX, {
          toValue: slideInDirection,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
      shouldAnimateIndicator &&
        Animated.timing(indicatorTranslateX, {
          toValue: targetIndicatorPosition + 5,
          duration: 250,
          useNativeDriver: true,
        }),
    ].filter(Boolean)).start();

    prevTabIndex.current = index;
    setActiveTab(tabName);
  };

  const renderTabContent = () => {
    const activeTabData = filteredTabs?.find?.((tab) => tab?.name === activeTab);
    return activeTabData?.component ? (
      <Animated.View
        style={[
          styles.tabContent,
          {
            transform: [{ translateX: contentTranslateX }],
            opacity: contentTranslateX.interpolate({
              inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
              outputRange: [0, 1, 0],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        {React.createElement(activeTabData?.component, { tickets: activeTabData?.filteredData || [], onRefresh: activeTabData?.onRefresh,loading: activeTabData?.loading })}
      </Animated.View>
    ) : null;
  };

  const visibleTabs = filteredTabs?.length <= 3 ? filteredTabs : filteredTabs?.slice?.(0, 2) ?? [];
  const moreTabs = filteredTabs?.length > 3 ? filteredTabs?.slice?.(2) ?? [] : [];

  return (
    <View style={styles.container}>
      <View style={styles.tabBarWrapper}>
        <View style={styles.tabBar}>
          {visibleTabs?.map?.((tab, index) => {
            const tabLabel = tab?.label || tab?.name || 'Tab';
            const tabWidth = calculateTabWidth(tabLabel);
            return (
              <TouchableOpacity
                key={tab?.name ?? `tab-${index}`}
                style={[styles.tabItem, { width: tabWidth }]}
                onPress={() => handleTabChange(tab?.name, index)}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === tab?.name ? styles.activeTabLabel : styles.inactiveTabLabel,
                  ]}
                >
                  {tabLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
          {filteredTabs?.length > 3 && (
            <TouchableOpacity style={[styles.tabItem, styles.moretabItem]} onPress={toggleMoreOptions}>
              <Icon name="ellipsis-horizontal" size={22} color="#026367" />
            </TouchableOpacity>
          )}
          {showIndicator && (
            <Animated.View
              style={[
                styles.tabIndicator,
                {
                  transform: [{ translateX: indicatorTranslateX }],
                  width: calculateIndicatorWidth(filteredTabs?.[prevTabIndex?.current]?.label || filteredTabs?.[prevTabIndex?.current]?.name || 'Tab'),
                },
              ]}
            />
          )}
        </View>
        <TouchableOpacity onPress={openSearch} style={styles.iconContainer}>
          <Icon name="search" size={22} color="#026367" />
        </TouchableOpacity>
        {isSearchOpen && (
          <Animated.View style={[styles.searchOverlay, { transform: [{ translateX }], opacity }]}>
            <Searchbar
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchBar}
              inputStyle={styles.searchInput}
              iconColor="#026367"
              placeholderTextColor="#000"
              autoFocus
              autoCorrect={false}
              autoComplete="off"
              spellCheck={false}
            />
            <TouchableOpacity onPress={closeSearch} style={styles.closeIcon}>
              <Icon name="close" size={22} color="#026367" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
      <Modal
        visible={isMoreOptionsOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleMoreOptions}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleMoreOptions}
        >
          <View style={styles.modalContent}>
            {moreTabs?.map?.((tab, index) => (
              <TouchableOpacity
                key={tab?.name ?? `more-tab-${index}`}
                style={styles.modalItem}
                onPress={() => {
                  handleTabChange(tab?.name, index + 2);
                  setIsMoreOptionsOpen(false);
                }}
              >
                <Text style={styles.modalItemText}>{tab?.label || tab?.name || 'Tab'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      <View style={styles.tabContentContainer}>{renderTabContent()}</View>
    </View>
  );
};

export default CustomTabs;
