export default (context, inject) => {
  const openPopinMl =  () => document.querySelector('.popin').classList.add('visible')
  inject('openPopinMl', openPopinMl)
  context.$openPopinMl = openPopinMl
}
