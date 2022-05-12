<template>
  <div class="choices">
    <div class="nav-steps">
      <div class="progress"></div>
      <div v-for="(step, index) in steps" :id="step.id" :key="step.id" :class="{active: activeStep>=index+1, 'nav-step': true }"><span></span></div>
    </div>

    <div class="steps">

      <transition-group :name="animType">
        <ChoicesStep1 v-show="activeStep===1" id="step-1" key="step1" class="step"></ChoicesStep1>
        <ChoicesStep2 v-show="activeStep===2" id="step-2" key="step2" class="step"></ChoicesStep2>
        <ChoicesStep3 v-show="activeStep===3" id="step-3" key="step3" class="step"></ChoicesStep3>
        <ChoicesStep4 v-show="activeStep===4" id="step-4" key="step4" class="step"></ChoicesStep4>
        <ChoicesStep5 v-show="activeStep===5" id="step-5" key="step5" class="step"></ChoicesStep5>
        <ChoicesStep6 v-show="activeStep===6" id="step-6" key="step6" class="step"></ChoicesStep6>
      </transition-group>

    </div>

  </div>
</template>
<script>

import gsap, {Expo} from "gsap";

const timingNavStep = 4;
export default {
  data: () => {
    return {
      btActive: false,
      steps: [
        {id:'step1'},
        {id:'step2'},
        {id:'step3'},
        {id:'step4'},
        {id:'step5'},
        {id:'step6'}
      ],
      animType:'fade'
    }
  },
  computed: {
    activeStep(){
      return this.$store.state.activeStep;
    }
  },
  created() {

  },
  mounted() {
    const spanWidth = document.querySelector('.nav-step span').getBoundingClientRect().width
    gsap.to('.progress', {width: this.$store.state.activeStep * spanWidth, duration:timingNavStep, ease:Expo.easeOut})

    window.addEventListener('resize', this.onResize)
  },
  updated(){
    const spanWidth = document.querySelector('.nav-step span').getBoundingClientRect().width
    gsap.to('.progress', {width: this.$store.state.activeStep* spanWidth, duration:timingNavStep, ease:Expo.easeOut})

  },
  methods: {

    onResize(){
      const spanWidth = document.querySelector('.nav-step span').getBoundingClientRect().width
      gsap.to('.progress', {width: this.$store.state.activeStep * spanWidth, duration:0.2})
    }
  }
}
</script>
<style lang="scss">
.choices {
  position: relative;
  width:100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;

  .nav-steps {
    display:flex;
    flex-direction: row;
    justify-content: center;
    width:75%;
    margin: 0 auto;
    position: relative;

    .progress{
      position:absolute;
      left:0;top:0;width:0;height:100%;
      content:"";
      background: #FFF;
      z-index:10;
    }

    .nav-step {
      position: relative;
      height:2px;
      background-color: #4c392b;
      flex-grow: 1;
      margin:0 0px;

      span {
        content:"";
        position: absolute;
        width:0;
        height: 100%;
        left:0;top:0;
        background:#4c392b;
        transition: all 2s;
        &:before {
          position:absolute;
          left:0;top:0;width:4px;height:100%;
          content:"";
          background: #28201c;
          z-index: 20;
        }
      }
      &.active span {
        width:100%;
      }
    }
  }

  .steps{
    width:100%;
    flex-grow: 1;
    & > span {
      display: flex;
      align-items: flex-start;


      .step {
        position: absolute;
        width:100%;
        height: calc(100vh - 100px - 95px);
        display: flex;
        flex-direction: column;
        //justify-content: flex-start;
        .content {
          width:100%;
          margin: 0 auto;
          display:flex;
          flex-direction: row;
          flex-grow: 1;
          justify-content: space-evenly;
          text-align: left;
          @media only screen and (max-width : 640px) {
            flex-direction: column;
          }
        }
        &#step-1{
          justify-content: space-between;
          .content {
            justify-content: center;
            align-items: center;
            @media only screen and (max-width: 640px) {
              //margin-top: 50px;
            }
          }
        }
        &#step-2{
          .content {

            align-items: center;

            @media only screen and (max-width: 640px) {
              //margin-top: 50px;
            }
          }
        }
        &#step-3{
          .content {
            width:720px;
            //height: 100%;
            align-items: center;
            padding:20px 0;
          }
          @media only screen and (max-width : 640px) {
            .content {
              width:100%;
              flex-direction: row;
            }
          }
        }
        &#step-4{
          .content {
            flex-direction: column;
            align-items: center;
            margin-top: 50px;
            justify-content: center;

            @media only screen and (max-width : 640px) {
              margin-top: 50px;
            }
          }
        }
        &#step-5{
          .content {
            flex-direction: row;
            justify-content: center;
            align-items: center;
          }
        }
        &#step-6{
          .nav{padding-bottom:150px;}
        }
      }
    }


    .nav {
      width:30%;
      margin: 0 auto;
      height: 100px;
      position:relative;

      .nav-prev {
        position:absolute;
        padding: 20px 0 20px;
        width: 50px;height:50px;
        left:0;
        transform: rotate(180deg);
      }
      .nav-next {
        position:absolute;
        padding: 20px 0 20px;
        width: 50px;height:50px;
        right:0;
      }

      @media only screen and (max-width : 640px) {
        width: 100%;
        height: 100px;
        .nav-prev,.nav-next {
          padding: 10px 0 10px;
          width: 40px;height:40px;
        }
      }
    }

  }

  @media only screen and (max-width : 640px) {
    .nav-steps {
      width: 100%;
    }
  }


  .fade-enter-active {
    transition: all 500ms cubic-bezier(1, 0.5, 0.8, 1);
  }
  .fade-leave-active {
    transition: none 100ms cubic-bezier(1, 0.5, 0.8, 1);
  }
  .fade-leave {
    opacity: 1;
  }
  .fade-leave-to {
    opacity: 0;
  }
  .fade-enter {
    opacity: 0;
  }
  .fade-enter-to {
    opacity: 1;
  }



}



</style>
