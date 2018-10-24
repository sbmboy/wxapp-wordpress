const app = getApp()
const { towxml } = app

const API_BASE = 'https://wxapp.lanthy.com/wp-json'
const API_ROUTE = 'wp/v2/posts'

Page({
  data: {
    title:'',
    content:{},
    featured_media:'',
    author:{},
    isLoading:true
  },
  onLoad(options){
    const id = options.id

    wx.request({
      url: `${ API_BASE }/${ API_ROUTE }/${ id }?_embed=true`,
      success:(response) => {
        const entity = response.data
        const title = entity.title.rendered
        // const content = entity.content.rendered
        const content = towxml.toJson(entity.content.rendered, 'html')
        const featuredMedia =
           entity.featured_media ? entity._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url : ''
        const author = entity._embedded.author[0]

        this.setData({
          ...entity,
          title,
          content,
          featuredMedia,
          author,
          isLoading: false
        })

        wx.setNavigationBarTitle({
          title
        })
      }
    })
  }
})
