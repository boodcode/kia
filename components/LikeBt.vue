<template>
  <div class="like">
    <div id="emitter"></div>
  </div>
</template>
<script>

export default {
  data(){
    return {}
  },
  mounted(){

  },
  methods: {

  }
}



</script>
<style lang="scss">
.like {
  position: relative;

  #emitter {
    background-image: url('~/assets/images/unlike@2x.png');
    background-size: cover;
    position: absolute;
    width: 55px;
    height: 55px;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    cursor: pointer !important;

    &.liked{
      background-image: url('~/assets/images/like@2x.png');
    }
  }
}

.dot {
  background-image: url('~/assets/images/like@2x.png');
  background-size: cover;
  position: absolute;
  z-index:5000;
  pointer-events:none;
}

</style>
