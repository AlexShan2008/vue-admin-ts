import Main from '@/components/main'

const userRouters = {
  path: '/user',
  name: 'user',
  meta: {
    title: '账户',
    access: ['ADMIN', 'MANAGER', 'OPERATE']
  },
  component: Main,
  children: []
}

export default userRouters
