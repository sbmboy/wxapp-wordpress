const app = getApp()

const API_BASE = 'https://wxapp.lanthy.com/wp-json'
const API_ROUTE = 'wp/v2/posts'

Page({
  data: {
    entities:[],
    embed:true,
    total:0,
    totalPages:0,
    currentPage:1,
    isLoading:true,
    isEarth:false
  },
  onLoad () {
    wx.request({
      url:`${ API_BASE }/${ API_ROUTE }?_embed=${ this.data.embed }`,
      success: (response) => {
        console.log(response)
        const entities = response.data
        this.setData({
          entities,
          isLoading:false,
          total: response.header['X-WP-Total'],
          totalPages: response.header['X-WP-TotalPages'],
          currentPage:1,
          isEarth:false
        })
      }
    })
  },
  onPullDownRefresh(){
    wx.request({
      url:`${ API_BASE }/${ API_ROUTE }?_embed=${ this.data.embed }`,
      success: (response) => {
        console.log(response)
        const entities = response.data
        this.setData({
          entities,
          isLoading:false,
          total: response.header['X-WP-Total'],
          totalPages: response.header['X-WP-TotalPages'],
          currentPage:1,
          isEarth:false
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  onReachBottom(){
    let{ currentPage, totalPages, isLoading } = this.data

    if( currentPage >= totalPages || isLoading ){
      return
    }

    this.setData({
      isLoading:true
    })

    currentPage = currentPage + 1

    wx.request({
      url:`${ API_BASE }/${ API_ROUTE }?_embed=${ this.data.embed }&page=${ currentPage }`,
      success: (response) => {
        console.log(response)
        const entities = [...this.data.entities, ...response.data]
        this.setData({
          entities,
          currentPage,
          isLoading:false,
          total: response.header['X-WP-Total'],
          totalPages: response.header['X-WP-TotalPages'],
          isEarth: currentPage >= totalPages
        })
      }
    })
  }
})
