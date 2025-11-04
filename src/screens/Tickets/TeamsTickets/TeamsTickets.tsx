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
import { useTeamsClosedTickets, useTeamsOpenTickets, useTeamsResolvedTickets, useTeamsTickets } from '../../../hooks/useTickets';


const TeamsTicketsScreen = ({ navigation }) => {
  const { isLoading, refetch } = useTeamsTickets();
  const { isLoading: isTeamsOpenTicketsLoading, refetch: refetchTeamsOpenTickets } = useTeamsOpenTickets();
  const { isLoading: isTeamsClosedTicketsLoading, refetch: refetchTeamsClosedTickets } = useTeamsClosedTickets();
  const { isLoading: isTeamsResolvedTicketsLoading, refetch: refetchTeamsResolvedTickets } = useTeamsResolvedTickets();

  const tickets = useSelector((state: RootState) => state?.tickets?.teamsTickets?.all);
  const openTickets = useSelector((state: RootState) => state?.tickets?.teamsTickets?.open);
  const resolvedTickets = useSelector((state: RootState) => state?.tickets?.teamsTickets?.resolved);
  const closedTickets = useSelector((state: RootState) => state?.tickets?.teamsTickets?.closed);

  useEffect(()=>{
    console.log(isTeamsOpenTicketsLoading)
  },[isTeamsOpenTicketsLoading, isTeamsClosedTicketsLoading, isTeamsResolvedTicketsLoading])
  
  return (
    <View style={globalStyles.container}>
      <CustomTabs
        navigation={navigation}
        title="Teams Tickets"
        ticketsData={tickets}
        tabs={[
          { 
            name: 'Open', 
            label: `Open (${openTickets?.length})`, 
            component: OpenTickets, 
            data: openTickets,
            onRefresh: refetchTeamsOpenTickets,
            loading: isTeamsOpenTicketsLoading, 
          },
          { 
            name: 'Resolved', 
            label: `Resolved (${resolvedTickets?.length})`, 
            component: ResolvedTickets, 
            data: resolvedTickets,
            onRefresh: refetchTeamsResolvedTickets,
            loading: isTeamsResolvedTicketsLoading,  
          },
          { 
            name: 'Closed', 
            label: `Closed (${closedTickets?.length})`, 
            component: ClosedTickets, 
            data: closedTickets,
            onRefresh: refetchTeamsClosedTickets,
            loading: isTeamsClosedTicketsLoading, 
          },
        ]}
      />
      <AddTicketButton />
    </View>
  );
};

export default TeamsTicketsScreen;