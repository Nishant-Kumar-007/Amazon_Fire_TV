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
    startTime?: number;
  };
  ParityLab: undefined;
};

export type DrawerParamList = {
  Home: undefined;
  Explore: undefined;
  TV: undefined;
  ParityLab: undefined;
  Settings: undefined;
};
