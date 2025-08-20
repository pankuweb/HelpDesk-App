import CustomTabs from '../../../components/Tabs/CustomTabs';
import ClosedTickets from './ClosedTickets';
import OpenTickets from './OpenTickets';
import ResolvedTickets from './ResolvedTickets';

const MyRequestsScreen = ({ navigation }) => (
  <CustomTabs
    navigation={navigation}
    title="My Tickets"
    tabs={[
      { name: 'Open', label: 'Open (0)', component: OpenTickets },
      { name: 'Resolved', label: 'Resolved (0)', component: ResolvedTickets },
      { name: 'Closed', label: 'Closed (0)', component: ClosedTickets },
    ]}
  />
);

export default MyRequestsScreen;
