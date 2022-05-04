export default function(context){
  const device = (context.$device.isMobile) ? 'mobile' : ((context.$device.isTablet) ? 'tablet' : 'desktop');
  context.app.store.commit('setDevice', device)
}
