<template>
    <div class="errorpage">
      <h1 v-if="error.statusCode === 404">Page non trouvée</h1>
      <h1 v-else>Une erreur s'est produite</h1>
      <nuxt-link to="/">Retournez sur la homepage</nuxt-link>
    </div>
</template>
<script>
export default {
  layout: 'error',
  props: ['error'] // you can set a custom layout for the error page
}
</script>
<style lang="scss">

.errorpage{
  height: calc(100vh - 100px);
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
  h1{
    font-family: "Kia Signature Fix Bold", serif;
    color:#FFF;
  }
  a {
    font-family: "Kia Signature Fix Regular";
    color:#FFF;
  }
}

</style>
