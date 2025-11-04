import HelpScreen from "../screens/Help/HelpScreen";
import TabScreen from "../screens/Tab/TabScreen";
import InfoScreen from "../screens/Info/InfoScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import MyTicketsScreen from "../screens/Tickets/MyTickets/MyTickets";
import TeamsTicketsScreen from "../screens/Tickets/TeamsTickets/TeamsTickets";
import ApprovalsScreen from "../screens/Tickets/Approvals/Approvals";
import MyRequestsScreen from "../screens/Tickets/MyRequests/MyRequests";
import UnassignedTicketsScreen from "../screens/Tickets/UnassignedTickets";
import CreateTicket from "../components/Tickets/CreateTicket/CreateTicket";
import AboutScreen from "../screens/About/AboutScreen";

export const drawerItems   = [
  {
    name: 'Tab',
    component: TabScreen,
    title: '',
    icon: 'home-outline',
    hideFromDrawer: true,
  },
  {
    name: 'CreateTicket',
    component: CreateTicket,
    title: 'Create Ticket',
    icon: 'add-circle-outline',
    hideFromDrawer: true,
  },
  {
    name: 'About',
    component: AboutScreen,
    title: 'About Us',
    icon: 'information-circle-outline',
  },
];
