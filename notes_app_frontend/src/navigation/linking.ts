import { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from '.';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['/'],
  config: {
    initialRouteName: 'NotesList',
    screens: {
      NotesList: '',
      NoteDetail: 'note/:id',
      NoteEdit: 'edit/:id?',
      Categories: 'categories',
    },
  },
};

export default linking;
