import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'dark',
  brandTitle: 'Mezzanine / React Hook Form',
  brandUrl: 'https://github.com/Mezzanine-UI/mezzanine-ui-react-hook-form'
});

addons.setConfig({
  theme,
  panelPosition: 'bottom',
  sidebar: {
    showRoots: true,
  },
});
