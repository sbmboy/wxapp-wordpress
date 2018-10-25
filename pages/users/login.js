const app = getApp()
const { setJWT } = app

const API_BASE = 'https://wxapp.lanthy.com/wp-json'
const API_ROUTE = 'jwt-auth/v1/token'

Page({
  data:{
    username:'',
    password:'',
    showMessage:false,
    message:''
  },
  onInputUsername(event){
    this.setData({
      username:event.detail.value
    })
  },
  onInputPassword(event){
    this.setData({
      password:event.detail.value
    })
  },
  onTapSubmitButton(){
    console.log(this.data.username, this.data.password)

    wx.request({
      url: `${ API_BASE }/${ API_ROUTE }`,
      method: 'POST',
      data:{
        username: this.data.username,
        password: this.data.password
      },
      success:(response)=>{
        console.log(response)
        const { data, statusCode } = response

        if (data.hasOwnProperty('code')) {
          switch (data.code) {
            case '[jwt_auth] invalid_username':
              this.setData({
                message:'用户名错误'
              })
              break
              case '[jwt_auth] incorrect_password':
                this.setData({
                  message:'密码错误'
                })
                break
            default:
              this.setData({
                message:'用户名或密码错误'
              })
          }
        }

        switch (statusCode) {
          case 403:
            this.setData({
              showMessage:true
            })

            setTimeout(()=>{
              this.setData({
                showMessage:false
              })
            },3000)
            break
          case 200:
              setJWT(response.data)
              wx.switchTab({
                url:'/pages/users/show'
              })
              break
          default:
            console.log(response)

        }
      }
    })
  }
})
