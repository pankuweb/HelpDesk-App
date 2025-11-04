import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator, Text } from 'react-native';
import NoDataAvailable from '../../../components/NoDataAvailable';
import TicketCard from '../../../components/Tickets/TicketCard/TicketCard';
import { useNavigation } from '@react-navigation/native';

const PAGE_SIZE: any = 10;

const CancelledTickets = ({ tickets = [], onRefresh: parentOnRefresh, loading }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const navigation = useNavigation();

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (parentOnRefresh) {
        await parentOnRefresh();
      }
      setVisibleCount(PAGE_SIZE); 
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadMore = () => {
    if (isFetchingMore || visibleCount >= tickets?.length) return;
    setIsFetchingMore(true);

    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setIsFetchingMore(false);
    }, 1500);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#026367" />
        <Text style={styles.loaderText}>Loading tickets...</Text>
      </View>
    );
  }

  if (tickets?.length === 0) {
    return <NoDataAvailable />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tickets?.slice(0, visibleCount)}
        keyExtractor={(item) => item?.TicketSeqnumber}
        renderItem={({ item }) => (
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
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingBottom: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#026367']}
            tintColor="#026367"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="large" color="#026367" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default CancelledTickets;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start' },
  text: { fontSize: 25, fontWeight: 'bold', fontFamily: 'Roboto-Regular' },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',    
    backgroundColor: '#fff',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#026367',
    fontWeight: '500',
  },
  footerLoader: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
