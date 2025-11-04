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
import { useMyClosedTickets, useMyOpenTickets, useMyResolvedTickets, useMyTickets } from '../../../hooks/useTickets';


const MyTicketsScreen = ({ navigation }) => {
  const { isLoading: isMyTicketsLoading, refetch: refetchMyTickets } = useMyTickets();
  const { isLoading: isMyOpenTicketsLoading, refetch: refetchMyOpenTickets } = useMyOpenTickets();
  const { isLoading: isMyClosedTicketsLoading, refetch: refetchMyClosedTickets } = useMyClosedTickets();
  const { isLoading: isMyResolvedTicketsLoading, refetch: refetchMyResolvedTickets } = useMyResolvedTickets();

  const tickets = useSelector((state: RootState) => state.tickets.myTickets.all);
  const openTickets = useSelector((state: RootState) => state.tickets.myTickets.open);
  const resolvedTickets = useSelector((state: RootState) => state.tickets.myTickets.resolved);
  const closedTickets = useSelector((state: RootState) => state.tickets.myTickets.closed);

  useEffect(()=>{
    console.log(isMyOpenTicketsLoading)
  },[isMyOpenTicketsLoading, isMyClosedTicketsLoading, isMyResolvedTicketsLoading])
  
  return (
    <View style={globalStyles.container}>
      <CustomTabs
        navigation={navigation}
        title="My Tickets"
        ticketsData={tickets}
        tabs={[
          { 
            name: 'Open', 
            label: `Open (${openTickets?.length})`, 
            component: OpenTickets, 
            data: openTickets,
            onRefresh: refetchMyOpenTickets,
            loading: isMyOpenTicketsLoading, 
          },
          { 
            name: 'Resolved', 
            label: `Resolved (${resolvedTickets?.length})`, 
            component: ResolvedTickets, 
            data: resolvedTickets,
            onRefresh: refetchMyOpenTickets,
            loading: isMyTicketsLoading,  
          },
          { 
            name: 'Closed', 
            label: `Closed (${closedTickets?.length})`, 
            component: ClosedTickets, 
            data: closedTickets,
            onRefresh: refetchMyOpenTickets,
            loading: isMyTicketsLoading, 
          },
        ]}
      />
      <AddTicketButton />
    </View>
  );
};

export default MyTicketsScreen;