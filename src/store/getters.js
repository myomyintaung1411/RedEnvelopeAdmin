const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  info: state => state.user.info,
  name: state => state.user.name,
  imageBase: state => state.stock.imageBase
}
export default getters
