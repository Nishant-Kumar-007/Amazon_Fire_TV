export type RootStackParamList = {
  DrawerNavigator: undefined;
  Details: {
    title: string;
    description: string;
    headerImage: string;
    movie: string;
    category?: string;
    genres?: string[];
    releaseYear?: number;
    rating?: number;
    ratingCount?: number;
    contentRating?: string;
    duration?: number;
  };
  Player: {
    movie: string;
    headerImage: string;
    title?: string;
    id?: string;
  };
  FocusLab: undefined;
};

export type DrawerParamList = {
  Home: undefined;
  Explore: undefined;
  TV: undefined;
  FocusLab: undefined;
  Settings: undefined;
};
