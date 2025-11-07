import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import NoDataAvailable from '../../components/NoDataAvailable';
import TicketCard from '../../components/Tickets/TicketCard/TicketCard';
import { useUnassignedTickets } from '../../hooks/useTickets';
import { clearLoginData } from '../../redux/slices/loginSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FlashList } from '@shopify/flash-list';
import AddTicketButton from '../../components/Buttons/AddTicketButton';
// import ticketData from './../../../ticket.json';

const PAGE_SIZE = 20;

const UnassignedTicketsScreen = () => {
  const { isLoading, refetch } = useUnassignedTickets();
  const unAssignedTickets = useSelector((state: RootState) => state?.tickets?.unAssignedTickets);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      setVisibleCount(PAGE_SIZE);
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setIsRefreshing(false);
    }
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
      headerRight: () => (
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={onSignOut} style={styles.headerIconButton}>
            <MaterialIcons name="logout" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const loadMore = useCallback(() => {
    if (isFetchingMore || visibleCount >= unAssignedTickets?.length) return;
    setIsFetchingMore(true);

    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setIsFetchingMore(false);
    }, 1500);
  }, [isFetchingMore, visibleCount, unAssignedTickets?.length]);

  const getItemType = useCallback((item) => {
    return item.Priority || 'default';
  }, []);

  const displayedData = useMemo(
    () => unAssignedTickets?.slice(0, visibleCount) || [],
    [unAssignedTickets, visibleCount]
  );

  const renderItem = useCallback(({ item }) => (
    <TicketCard
      ticketNumber={item?.TicketSeqnumber}
      department={item?.DepartmentName}
      status={item?.Status}
      date={item?.TicketCreatedDate}
      subtitle={item?.Title}
      description={item?.TicketDescription}
      assignee={item?.AssignedTo?.Title || ""}
      priority={item?.Priority}
      reporter={item?.RequesterName}
      item={item}
    />
  ), []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#026367" />
      </View>
    );
  }

  if (!unAssignedTickets || unAssignedTickets.length === 0) {
    return <NoDataAvailable />;
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={displayedData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={150}
        getItemType={getItemType}
        extraData={visibleCount}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#026367']}
            tintColor="#026367"
          />
        }
        ListFooterComponent={
          isFetchingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="large" color="#026367" />
            </View>
          ) : null
        }
      />
      <AddTicketButton />
    </View>
  );
};

export default UnassignedTicketsScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'flex-start', 
    marginHorizontal: 10, 
    marginTop: 10 
  },
  loaderContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  footerLoader: { 
    paddingVertical: 8, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  headerIconButton: { 
    paddingHorizontal: 18 
  },
  headerIcons: { 
    flexDirection: 'row' 
  },
});