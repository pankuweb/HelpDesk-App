import HomeScreen from "../screens/Home/HomeScreen";
import MyTicketsScreen from "../screens/Tickets/MyTickets/MyTickets";
import TeamsTicketsScreen from "../screens/Tickets/TeamsTickets/TeamsTickets";
import MyRequestsScreen from "../screens/Tickets/MyRequests/MyRequests";
import ApprovalsScreen from "../screens/Tickets/Approvals/Approvals";
import UnassignedTicketsScreen from "../screens/Tickets/UnassignedTickets";

export const tabItems = [
  {
    name: 'MyTickets',
    component: MyTicketsScreen,
    title: 'My Tickets',
    icon: 'list-outline',
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
    name: 'MyRequests',
    component: MyRequestsScreen,
    title: 'My Requests',
    icon: 'reader-outline',
  },
  {
    name: 'Approvals',
    component: ApprovalsScreen,
    title: 'Approvals',
    icon: 'checkmark-done-outline',
  },
];


