<template>
  <div class="exit-intent-popup">
    <div class="newsletter">
      <div class="visuel">
        <figure>
          <img src="~/assets/images/top1-ev-desktop2.jpg" alt="Kia">
        </figure>
      </div>
      <h3>Ne nous quittez pas !</h3>
      <p>Vous souhaitez avoir des nouvelles de Kia,<br>Inscrivez-vous à notre newsletter</p>
      <div class="exit-form">
        <input type="email" placeholder="Votre adresse email" class="email" autocomplete="email" />
        <div class="cta">Recevoir la newsletter</div>
      </div>

    </div>
    <div class="close">Fermer</div>
  </div>
</template>
<script>
export default{
  mounted(){
    if (!getCookie('exitIntentShown')) {
      setTimeout(() => {
        document.addEventListener('mouseout', this.mouseEvent);
        document.addEventListener('keydown', this.exit);
        document.querySelector('.exit-intent-popup').addEventListener('click', this.exit);
      }, 100);
    }
  },
  methods: {
    mouseEvent(e) {
      const shouldShowExitIntent = !e.toElement && !e.relatedTarget && e.clientY < 10;

      if (shouldShowExitIntent) {
        document.removeEventListener('mouseout', this.mouseEvent);
        document.querySelector('.exit-intent-popup').classList.add('visible');

        setCookie('exitIntentShown', true, 30);

      }
    },
    exit(e){
      const shouldExit =
        [...e.target.classList].includes('exit-intent-popup') || // user clicks on mask
        e.target.className === 'close' || // user clicks on the close icon
        e.target.className === 'cta' ||
        e.keyCode === 27; // user hits escape

      if (shouldExit) {
        document.querySelector('.exit-intent-popup').classList.remove('visible');
      }
    },

  }
}
</script>
<style lang="scss">
.exit-intent-popup {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10000000;
  background: rgba(33, 33, 33, 0.9);
  transform: translateY(60%) scale(0);
  transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);

  .newsletter {
    position: absolute;
    width:60%;
    max-width:800px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display:flex;
    flex-direction: column;
    align-items: center;
    background-color: #000;
    padding:0 0 30px;
  }
  .visuel {
    figure {
      width:100%;
      max-height:300px;
      overflow:hidden;
      margin:0;padding:0;
      img {
        width:100%;
        height: auto;
      }
    }
  }
  p {text-align: center;}
  .exit-form{

    input {
      width:300px;
      margin: 0 10px 0 0;
      border-radius: 0 !important;
      display: inline-block;
      cursor: pointer;
      font-family: "Kia Signature Fix Bold",serif;
      font-size: 16px;
      color: #000;
      background: #FFF;
      text-align: left;
      text-decoration: none;
      outline: none;
      padding: 12px 22px;
    }
    .cta {
      box-shadon: none;
    }
  }

  .close {
    padding:20px;
    cursor: pointer;
    float: right;
    color:#FFF;
  }

}

.exit-intent-popup.visible {
  transform: translateY(0) scale(1);
}

</style>
