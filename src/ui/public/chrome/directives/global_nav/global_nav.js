
import './app_switcher';
import './global_nav_link';

import globalNavTemplate from './global_nav.html';
import './global_nav.less';
import { uiModules } from 'ui/modules';

const module = uiModules.get('kibana');

module.directive('globalNav', (es, kbnIndex, globalNavState, chrome) => {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      chrome: '=',
      isVisible: '=',
      logoBrand: '=',
      smallLogoBrand: '=',
      appTitle: '=',
    },
    template: globalNavTemplate,
    link: scope => {
      // App switcher functionality.
      function updateGlobalNav() {
        const isOpen = globalNavState.isOpen();
        scope.isGlobalNavOpen = isOpen;
        scope.globalNavToggleButton = {
          classes: isOpen ? 'global-nav-link--close' : undefined,
          title: isOpen ? 'Collapse' : 'Expand',
          tooltipContent: isOpen ? 'Collapse side bar' : 'Expand side bar',
        };

        // Notify visualizations, e.g. the dashboard, that they should re-render.
        scope.$root.$broadcast('globalNav:update');
      }

      updateGlobalNav();

      scope.$root.$on('globalNavState:change', () => {
        updateGlobalNav();
      });

      scope.getHref = path => {
        return chrome.addBasePath(path);
      };

      scope.toggleGlobalNav = event => {
        event.preventDefault();
        globalNavState.setOpen(!globalNavState.isOpen());
      };

      es.search({
       index: '.kibana',
       body: {
         query: {
           match: {
             _id:  "metadashboard"
           }
         }
       }
      }).then(function (resp) {
      	scope.metadash = resp.hits.hits[0]._source.metadashboard;
      })
    }
  };
});
