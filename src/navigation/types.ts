
export type RootTabParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: undefined; 
  ProductDetails: { productId: number }; // We MUST pass an ID to open this screen
};