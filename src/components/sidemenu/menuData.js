const menuData = [
  {
    title: 'Video Manager',
    items: [
      {
        title: 'Video list',
        to: '/video/list',
        icon: 'users'
      },
      {
        title: 'Add new video',
        to: '/video/add',
        icon: 'plus'
      },
      {
        title: 'Archived videos',
        to: '/video/trash',
        icon: 'trash'
      }
    ]
  },
  {
    title: 'Series Manager',
    items: [
      {
        title: 'Series list',
        to: '/series/list',
        icon: 'list'
      },
      {
        title: 'Add new Series',
        to: '/series/add',
        icon: 'plus'
      },
      {
        title: 'Archived Series',
        to: '/series/trash',
        icon: 'trash'
      }
    ]
  },
  {
    title: 'Channel Manager',
    items: [
      {
        title: 'Channel list',
        to: '/channel/list',
        icon: 'list'
      },
      {
        title: 'Add new channel',
        to: '/channel/add',
        icon: 'plus'
      },
      {
        title: 'Archived channel',
        to: '/channel/trash',
        icon: 'trash'
      }
    ]
  }
]

export default menuData
