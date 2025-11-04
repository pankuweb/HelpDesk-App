import { View } from 'react-native';
import CustomTabs from '../../../components/Tabs/CustomTabs';
import ClosedTickets from './ClosedTickets';
import OpenTickets from './OpenTickets';
import ResolvedTickets from './ResolvedTickets';
import AddTicketButton from '../../../components/Buttons/AddTicketButton';
import globalStyles from '../../../components/globalstyles';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../../../redux/rootReducer';
import { useMyClosedRequestsTickets, useMyOpenRequestsTickets, useMyRequestsTickets, useMyResolvedRequestsTickets, useMyTickets } from '../../../hooks/useTickets';
import { fetchCurrentUser } from '../../../backend/RequestAPI';


const MyRequestsScreen = ({ navigation }) => {
  const { isLoading, refetch } = useMyRequestsTickets();
  const { isLoading: isMyOpenRequestsTicketsLoading, refetch: refetchMyOpenRequestsTickets } = useMyOpenRequestsTickets();
  const { isLoading: isMyClosedRequestsTicketsLoading, refetch: refetchMyClosedRequestsTickets } = useMyClosedRequestsTickets();
  const { isLoading: isMyResolvedRequestsTicketsLoading, refetch: refetchMyResolvedRequestsTickets } = useMyResolvedRequestsTickets();

  useEffect(()=>{
    console.log(isLoading)
  },[isMyOpenRequestsTicketsLoading, isMyClosedRequestsTicketsLoading,isMyResolvedRequestsTicketsLoading])
  
  const tickets = useSelector((state: RootState) => state?.tickets?.myRequests?.all)
  const openTickets = useSelector((state: RootState) => state?.tickets?.myRequests?.open);
  const resolvedTickets = useSelector((state: RootState) => state?.tickets?.myRequests?.resolved);
  const closedTickets = useSelector((state: RootState) => state?.tickets?.myRequests?.closed);
  return (
    <View style={globalStyles.container}>
      <CustomTabs
        navigation={navigation}
        title="My Requests"
        ticketsData={tickets}
        tabs={[
          { 
            name: 'Open', 
            label: `Open (${openTickets?.length})`, 
            component: OpenTickets, 
            data: openTickets,
            onRefresh: refetchMyOpenRequestsTickets,
            loading: isMyOpenRequestsTicketsLoading, 
          },
          { 
            name: 'Resolved', 
            label: `Resolved (${resolvedTickets?.length})`, 
            component: ResolvedTickets, 
            data: resolvedTickets,
            onRefresh: refetchMyResolvedRequestsTickets,
            loading: isMyResolvedRequestsTicketsLoading,
          },
          { 
            name: 'Closed', 
            label: `Closed (${closedTickets?.length})`, 
            component: ClosedTickets, 
            data: closedTickets,
            onRefresh: refetchMyClosedRequestsTickets,
            loading: isMyClosedRequestsTicketsLoading,
          },
        ]}
      />
      <AddTicketButton />
    </View>
  );
};

export default MyRequestsScreen;