import DrawerNavigation from "../routes/drawer-navigation";
import HelpScreen from "../screens/Help/HelpScreen";
import TabScreen from "../screens/Tab/TabScreen";
import InfoScreen from "../screens/Info/InfoScreen";
import SplashScreen from "../screens/Splash/SplashScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import UnassignedTickets from "../screens/Tickets/UnassignedTickets";
import MyTicketsScreen from "../screens/Tickets/MyTickets/MyTickets";
import ApprovalsScreen from "../screens/Tickets/Approvals/Approvals";
import TeamsTicketsScreen from "../screens/Tickets/TeamsTickets/TeamsTickets";
import MyRequestsScreen from "../screens/Tickets/MyRequests/MyRequests";
import CreateTicket from "../components/Tickets/CreateTicket/CreateTicket";

export const routes = [
  {
    name: 'Splash',
    component: SplashScreen,
    options: {
        headerShown: false
    }
  },
  {
    name: 'Tab',
    component: TabScreen,
    options: {
        headerShown: false
    }
  },
  {
    name: 'Drawer',
    component: DrawerNavigation,
    options: {
        headerShown: false
    }
  },
  {
    name: 'Info',
    component: InfoScreen,
    options: {
        headerShown: false
    }
  },
  {
    name: 'Help',
    component: HelpScreen,
    options: {
        headerShown: false
    }
  },
  {
    name: 'Login',
    component: LoginScreen,
    options: {
        headerShown: false
    }
  },
  {
    name: 'UnassignedTickets',
    component: UnassignedTickets,
    options: {
        headerShown: false
    }
  },
  {
    name: 'TeamsTickets',
    component: TeamsTicketsScreen,
    options: {
        headerShown: false
    }
  },
  {
    name: 'MyTickets',
    component: MyTicketsScreen,
    options: {
        headerShown: false
    }
  },
  {
    name: 'MyRequests',
    component: MyRequestsScreen,
    options: {
        headerShown: false
    }
  },
  {
    name: 'CreateTicket',
    component: CreateTicket,
    options: {
        headerShown: false
    }
  },
];
