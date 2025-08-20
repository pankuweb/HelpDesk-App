import HelpScreen from "../screens/Help/HelpScreen";
import TabScreen from "../screens/Tab/TabScreen";
import InfoScreen from "../screens/Info/InfoScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import MyTickets from "../screens/Tickets/MyTickets/MyTickets";
import MyTicketsScreen from "../screens/Tickets/MyTickets/MyTickets";
import TeamsTicketsScreen from "../screens/Tickets/TeamsTickets/TeamsTickets";
import ApprovalsScreen from "../screens/Tickets/Approvals/Approvals";
import MyRequestsScreen from "../screens/Tickets/MyRequests/MyRequests";
import UnassignedTicketsScreen from "../screens/Tickets/UnassignedTickets";
import CreateTicket from "../components/Tickets/CreateTicket/CreateTicket";

export const drawerItems   = [
  {
    name: 'Tab',
    component: MyTicketsScreen,
    title: 'My Tickets',
    icon: 'home-outline',
    hideFromDrawer: true,
  },
  {
    name: 'UnassignedTickets',
    component: UnassignedTicketsScreen,
    title: 'Unassigned Tickets',
    icon: 'clipboard-outline',
  },
  {
    name: 'TeamsTickets',
    component: TeamsTicketsScreen,
    title: 'Teams Tickets',
    icon: 'people-outline',
  },
  {
    name: 'MyTickets',
    component: MyTicketsScreen,
    title: 'My Tickets',
    icon: 'ticket-outline',
  },
  {
    name: 'MyRequests',
    component: MyRequestsScreen,
    title: 'My Requests',
    icon: 'paper-plane-outline',
  },
  {
    name: 'Approvals',
    component: ApprovalsScreen,
    title: 'Approvals',
    icon: 'checkmark-done-outline',
  },
  {
    name: 'CreateTicket',
    component: CreateTicket,
    title: 'Create Ticket',
    icon: '',
    hideFromDrawer: true,
  },
];
