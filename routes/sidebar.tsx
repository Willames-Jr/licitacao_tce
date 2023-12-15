/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 */

interface IRoute{
  path?: string
  icon?: string
  name: string
  routes?: IRoute[]
  checkActive?(pathname: String, route: IRoute): boolean
  exact?: boolean
}

export function routeIsActive (pathname: String, route: IRoute): boolean {
  if (route.checkActive) {
    return route.checkActive(pathname, route)
  }

  return route?.exact
    ? pathname == route?.path
    : (route?.path ? pathname.indexOf(route.path) === 0 : false)
}

const routes: IRoute[] = [
  {
    path: '/home', // the url
    icon: 'HomeIcon', // the component being exported from icons/index.js
    name: 'Home', // name that appear in Sidebar
    exact: true,
  },
  {
    icon: 'FormsIcon',
    name: 'Geral',
    routes: [
      {
        path: '/pessoa',
        name: 'Pessoa'
      }
    ]
  },
  {
    icon: 'FormsIcon',
    name: 'Fase Interna',
    routes: [
      {
        path: '/licitacao',
        name: 'Licitação'
      },
      {
        path: '/contratacao',
        name: 'Contratação direta'
      },
      {
        path: '/item-licitacao',
        name: 'Item da licitação'
      },
      {
        path: '/grupo-licitacao',
        name: 'Grupo/Lote da licitação'
      },
      {
        path: '/grupo-item-licitacao',
        name: 'Item do Grupo/Lote da licitação'
      },
      {
        path: '/orgao-participante',
        name: 'Orgão participante de licitação'
      },
      {
        path: '/orgao-participante-item',
        name: 'Item do Orgão participante'
      },
      {
        path: '/adjudicacao-licitacao',
        name: 'Adjudicação da licitação'
      },
      {
        path: '/propostas',
        name: 'Propostas'
      },
      ,
      {
        path: '/ata-registro-preco',
        name: 'Ata de registro de preços'
      },
    ]
  },
  {
    path: '/home/forms',
    icon: 'FormsIcon',
    name: 'Forms',
  },
  {
    path: '/home/cards',
    icon: 'CardsIcon',
    name: 'Cards',
  },
  {
    path: '/home/charts',
    icon: 'ChartsIcon',
    name: 'Charts',
  },
  {
    path: '/home/buttons',
    icon: 'ButtonsIcon',
    name: 'Buttons',
  },
  {
    path: '/home/modals',
    icon: 'ModalsIcon',
    name: 'Modals',
  },
  {
    path: '/home/tables',
    icon: 'TablesIcon',
    name: 'Tables',
  },
  {
    icon: 'PagesIcon',
    name: 'Pages',
    routes: [
      // submenu
      {
        path: '/home/create-account',
        name: 'Create account',
      },
      {
        path: '/home/forgot-password',
        name: 'Forgot password',
      },
      {
        path: '/home/404',
        name: '404',
      },
      {
        path: '/home/blank',
        name: 'Blank',
      },
    ],
  },
]

export type {IRoute}
export default routes
