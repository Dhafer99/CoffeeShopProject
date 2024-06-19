// src/navigation/types.ts
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
    Login: undefined;
    "Barista interface": undefined;
    Admin: undefined;
    AdminTodos: undefined;
    AdminDetails: undefined;
    addServers: undefined;
    WorkdayList: undefined;
    BaristaDetails: { workday: string };
    BaristaSales: { email: string };
 
    Todos: undefined;
    Details: undefined;
    tables:undefined ;
    tablesales:{ tablenumber: number };
  };
  