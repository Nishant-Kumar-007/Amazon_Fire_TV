"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootNavigator;
const native_stack_1 = require("@react-navigation/native-stack");
const DrawerNavigator_1 = __importDefault(require("./DrawerNavigator"));
const DetailsScreen_1 = __importDefault(require("../screens/DetailsScreen"));
const PlayerScreen_1 = __importDefault(require("../screens/PlayerScreen"));
const ParityLabScreen_1 = __importDefault(require("../screens/ParityLabScreen"));
const Stack = (0, native_stack_1.createNativeStackNavigator)();
function RootNavigator() {
    return (<Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator_1.default}/>
      <Stack.Screen name="Details" component={DetailsScreen_1.default}/>
      <Stack.Screen name="Player" component={PlayerScreen_1.default}/>
      <Stack.Screen name="ParityLab" component={ParityLabScreen_1.default}/>
    </Stack.Navigator>);
}
