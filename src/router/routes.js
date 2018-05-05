
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      {
        path: '',
        component: () => import('pages/index'),
      },
    ]
  },
  {
    name: 'letter',
    path: '/letter/:letterID',
    component: () => import('pages/letter'),
  },
  {
    name: 'deleteLetter',
    path: '/delete/:letterID',
    component: () => import('pages/deleteLetter'),
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404'),
  }
]
