import { View } from 'react-native';
import CustomTabs from '../../../components/Tabs/CustomTabs';
import ApprovedTickets from './ApprovedTickets';
import CancelledTickets from './CancelledTickets';
import PendingTickets from './PendingTickets';
import RejectedTickets from './RejectedTickets';
import AddTicketButton from '../../../components/Buttons/AddTicketButton';
import globalStyles from '../../../components/globalstyles';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../../../redux/rootReducer';
import { useMyApprovalsTickets, useMyApprovedApprovalsTickets, useMyCancelledApprovalsTickets, useMyClosedRequestsTickets, useMyOpenRequestsTickets, useMyPendingApprovalsTickets, useMyRejectedApprovalsTickets, useMyRequestsTickets, useMyResolvedRequestsTickets, useMyTickets } from '../../../hooks/useTickets';
import { fetchCurrentUser } from '../../../backend/RequestAPI';


const ApprovalsScreen = ({ navigation }) => {
  const { isLoading, refetch } = useMyApprovalsTickets();
  const { isLoading: isMyPendingApprovalsTicketsLoading, refetch: refetchMyPendingApprovalsTickets } = useMyPendingApprovalsTickets();
  const { isLoading: isMyApprovedApprovalsTicketsLoading, refetch: refetchMyApprovedApprovalsTickets } = useMyApprovedApprovalsTickets();
  const { isLoading: isMyRejectedApprovalsTicketsLoading, refetch: refetchMyRejectedApprovalsTickets } = useMyRejectedApprovalsTickets();
  const { isLoading: isMyCancelledApprovalsTicketsLoading, refetch: refetchMyCancelledApprovalsTickets } = useMyCancelledApprovalsTickets();

  useEffect(()=>{
    console.log(isLoading)
  },[isMyPendingApprovalsTicketsLoading, isMyApprovedApprovalsTicketsLoading, isMyRejectedApprovalsTicketsLoading,isMyCancelledApprovalsTicketsLoading])

  const tickets = useSelector((state: RootState) => state.tickets.approvals.all);

  const pendingTickets = useSelector((state: RootState) => state?.tickets?.approvals?.pending);
  const approvedTickets = useSelector((state: RootState) => state?.tickets?.approvals?.approved);
  const rejectedTickets = useSelector((state: RootState) => state?.tickets?.approvals?.rejected);
  const cancelledTickets = useSelector((state: RootState) => state?.tickets?.approvals?.cancelled);

  return (
    <View style={globalStyles.container}>
      <CustomTabs
        navigation={navigation}
        title="Approvals"
        ticketsData={tickets}
        tabs={[
          { 
            name: 'Pending', 
            label: `Pending (${pendingTickets?.length})`, 
            component: PendingTickets, 
            data: pendingTickets,
            onRefresh: refetchMyPendingApprovalsTickets,
            loading: isMyPendingApprovalsTicketsLoading, 
          },
          { 
            name: 'Approved', 
            label: `Approved (${approvedTickets?.length})`, 
            component: ApprovedTickets, 
            data: approvedTickets,
            onRefresh: refetchMyApprovedApprovalsTickets,
            loading: isMyApprovedApprovalsTicketsLoading,
          },
          { 
            name: 'Rejected', 
            label: `Rejected (${rejectedTickets?.length})`, 
            component: RejectedTickets, 
            data: rejectedTickets,
            onRefresh: refetchMyRejectedApprovalsTickets,
            loading: isMyRejectedApprovalsTicketsLoading,
          },
          { 
            name: 'Cancelled', 
            label: `Cancelled (${cancelledTickets?.length})`, 
            component: CancelledTickets, 
            data: cancelledTickets,
            onRefresh: refetchMyCancelledApprovalsTickets,
            loading: isMyCancelledApprovalsTicketsLoading,
          },
        ]}
      />
    </View>
  );
};

export default ApprovalsScreen;