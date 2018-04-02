const menuData = [
  {
    title: 'Video',
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
        to: '/video/archived',
        icon: 'trash'
      }
    ]
  },
  {
    title: 'Series',
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
        to: '/series/archived',
        icon: 'trash'
      }
    ]
  },
  {
    title: 'Channel',
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
        to: '/channel/archived',
        icon: 'trash'
      }
    ]
  }
]

export default menuData
