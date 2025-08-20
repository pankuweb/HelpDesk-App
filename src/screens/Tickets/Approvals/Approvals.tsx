import CustomTabs from '../../../components/Tabs/CustomTabs';
import ApprovedTickets from './ApprovedTickets';
import CancelledTickets from './CancelledTickets';
import PendingTickets from './PendingTickets';
import RejectedTickets from './RejectedTickets';

const ApprovalsScreen = ({ navigation }) => (
  <CustomTabs
    navigation={navigation}
    title="My Tickets"
    tabs={[
      { name: 'Pending', label: 'Pending (0)', component: PendingTickets },
      { name: 'Approved', label: 'Approved (0)', component: ApprovedTickets },
      { name: 'Rejected', label: 'Rejected (0)', component: RejectedTickets },
      { name: 'Cancelled', label: 'Cancelled (0)', component: CancelledTickets },
    ]}
  />
);

export default ApprovalsScreen;
