<template>
  <div class="circle-voyages">
    <div class="activity">
      <div :class="{active:(valuestep2 >=60 && valuestep2 <= 100), 'act':true}">Souvent</div>
      <div :class="{active:(valuestep2 >=40 && valuestep2 <60), 'act':true}">De temps en temps</div>
      <div :class="{active:((valuestep2 >= 0 ||  valuestep2 === undefined) && valuestep2 <40), 'act':true}">Rarement</div>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="inner-glow">
          <feFlood flood-color="red"/>
          <feComposite in2="SourceAlpha" operator="out"/>
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feComposite operator="atop" in2="SourceGraphic"/>
        </filter>
      </defs>
    </svg>
  </div>
</template>
<script>


export default {
  props: ['valuestep2'],
  data: () => ({
  }),
  mounted(){
  }
}
</script>
<style lang="scss">
$circle-radius : 150px;


.circle-voyages {
  display:flex;
  flex-direction:row;
  justify-content: flex-start;
  align-items: center;
  position:relative;
  height: calc(2 * #{$circle-radius});
  margin: 40px 0;

  .activity{
    position: relative;
    z-index:1;
    width:180px;
    border-left:1px solid #514634;
    border-right:none;
    //transform: translate3d(12px, 0px, 0);
    .act{
      position:relative;
      padding:40px 12px;
      border-bottom:1px solid #514634;
      color:#eeddca;
      opacity: 0.3;
      font-size: 18px;
      transition: all 0.5s 'ease-out';
      @media only screen and (max-width : 640px) {
        font-size: 14px;
      }

      &:last-child{
        border-bottom:none;
      }

      &.active {
        color: #eeddca;
        opacity: 1;
        &:before{
          content: "";
          position: absolute;
          top:0;left:0;
          width:3px;
          height:100%;
          background-color: #eeddca;
        }
      }
    }

  }
  svg {
    position: relative;
    z-index:2;
    transform: rotate(180deg);
    z-index:1000;

    #path2 {
      filter: drop-shadow(0 0 15px rgba(224, 135, 46, 0.9));
    }
    #outerCircle2{
      filter:drop-shadow(-4px 0px 4px #352b29);
    }
    .unitTextBg{
      filter: drop-shadow(0 0 10px #352b29);
    }
    text {
      fill:#8e7a5c;
      font-size: 12px;
      font-family: "Kia Signature Fix Regular";
      filter: drop-shadow(0 0 5px rgba(0, 0, 0, 1));
      background-color: #000;
    }
    #pad {
      z-index: 100;
    }
  }

  @media only screen and (max-width : 640px) {
    transform: translate3d(-10px,0, 0);
    height: calc(2 * #{$circle-radius} - 40px);
  }

}


</style>
