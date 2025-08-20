import Open from './Open';
import Resolved from './Resolved';
import Closed from './Closed';
import DynamicTicketTabs from '../../../components/Tabs/DynamicTicketTabs';

const MyTicketsScreen = ({ navigation }) => (
  <DynamicTicketTabs
    navigation={navigation}
    title="My Tickets"
    tabs={[
      { name: 'Open', label: 'Open (0)', component: Open },
      { name: 'Resolved', label: 'Resolved (0)', component: Resolved },
      { name: 'Closed', label: 'Closed (0)', component: Closed },
    ]}
  />
);

export default MyTicketsScreen;
