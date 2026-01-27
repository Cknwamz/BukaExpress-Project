
export type RootTabParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Tabs: undefined;
  
  // Tab Internals
  HomeMain: undefined;     // <--- Added for Home Stack
  ProfileMain: undefined;  // <--- Added for Profile Stack
  
  // Screens
  ProductDetails: { productId: number };
  Checkout: undefined;
  Orders: undefined;
  Wishlist: undefined;
  EditProfile: undefined;
  ShippingAddress: undefined;
  PrivacyPolicy: undefined;
  Settings: undefined;
};