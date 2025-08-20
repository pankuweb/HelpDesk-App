import { View } from 'react-native';
import CustomTabs from '../../../components/Tabs/CustomTabs';
import ClosedTickets from './ClosedTickets';
import OpenTickets from './OpenTickets';
import ResolvedTickets from './ResolvedTickets';
import AddTicketButton from '../../../components/Buttons/AddTicketButton';
import globalStyles from '../../../components/globalstyles';

const MyTicketsScreen = ({ navigation }) => (
  <View style={globalStyles.container}>
    <CustomTabs
      navigation={navigation}
      title="My Tickets"
      tabs={[
        { name: 'Open', label: 'Open (0)', component: OpenTickets },
        { name: 'Resolved', label: 'Resolved (0)', component: ResolvedTickets },
        { name: 'Closed', label: 'Closed (0)', component: ClosedTickets },
      ]}
    />
    <AddTicketButton />
  </View>
);

export default MyTicketsScreen;
