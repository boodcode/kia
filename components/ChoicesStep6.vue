<template>
  <div>
    <h3 v-html="title"></h3>
    <p>{{subtitle}}</p>
    <div class="content">
      <form class="form" @submit.prevent="submit">
        <div class="field">
          <BaseRadioButtonGroup v-model="user.civ" :options="civs" />
        </div>
        <div class="field">
          <span class="required">
            <span class="desc">Email</span>
          <input id="email" v-model="user.email" type="email" placeholder="Email" required aria-required="true" autocomplete="email">
        </span>
        </div>
        <div class="fields">
          <div class="field">
          <span class="required">
            <span class="desc">Nom</span>
            <input id="lastname" v-model="user.lastname" type="text" placeholder="Nom" required aria-required="true" autocomplete="family-name">
          </span>
          </div>
          <div class="field">
          <span class="required">
            <span class="desc">Prénom</span>
            <input id="firstname" v-model="user.firstname" type="text" placeholder="Prénom" required aria-required="true" autocomplete="given-name">
          </span>
          </div>
        </div>
        <div class="field">
          <span class="required">
            <span class="desc">N° de téléphone</span>
            <input id="tel" v-model="user.tel" type="text" placeholder="N° de téléphone" required aria-required="true" autocomplete="tel">
          </span>
        </div>
        <div class="fields">
          <div class="field">
            <span class="required">
              <span class="desc">Code postal</span>
              <input id="cp" v-model="user.cp" type="text" placeholder="Code postal" required aria-required="true" autocomplete="postal-code">
            </span>
          </div>
          <div class="field">
            <span class="required">
              <span class="desc">Ville</span>
              <input id="ville" v-model="user.ville" type="text" placeholder="Ville" required aria-required="true" >
            </span>
          </div>
        </div>
        <div class="field">
          <span class="required">
            <div class="desc concession">Concession</div>
            <v-select
              id="concession"
              :options="dealersListe"
              label="label"
              :reduce="(option)=> option.dealer_internalid"
              placeholder="Sélectionnez votre concession"
              autoscroll
              @input="oninput"
            ></v-select>
          </span>
        </div>
        <div class="field last">
          <span class="required">
            <span class="desc"></span>
            <input id="optin" type="checkbox" :checked="user.optin">
            <label for="optin">J’accepte les <nuxt-link to="cgu"  target="_blank">conditions générales d’utilisation</nuxt-link></label>
          </span>
        </div>
        <input class="send" type="submit" value="Lancer l'analyse" >
      </form>
    </div>
    <NavButtons></NavButtons>
  </div>
</template>
<script>
import gsap, {Expo} from "gsap";
// import { createPopper } from '@popperjs/core'
import dealers from '~/assets/json/dealers'

export default {
  components: {
  },
  data(){
    return {
      title: 'Et vous ?',
      subtitle: 'Nous avons besoin d’en savoir un peu plus',
      checkForm: false,
      fieldsOK:0,
      dealersListe: dealers,
      civs:[
        {
          label:"Monsieur",
          checked: "checked",
          value:"M"
        },
        {
          label:"Madame",
          checked: false,
          value:"Mme"
        }
      ],
      user : {
        civ:'',
        email:'',
        firstname:'',
        lastname:'',
        tel:'',
        cp:'',
        ville:'',
        concession: '',
        optin: false
      },
      // placement: 'bottom'
    }
  },
  computed: {

  },
  created(){
    this.$nuxt.$on('RADIO_CHECKED', (v)=> {
      this.$store.commit('user/updateInfos', {...this.$store.state.user.infos, civ:v})
    })
  },
  mounted() {
    this.user.civ = this.$store.state.user.infos.civ;
    this.dealersListe.map(function(d) {
      d.label = (d.dealer_postcode).toString().substring(0,2) +' — '+ (d.dealer_residence).toUpperCase();
      return d;
    })
    document.querySelector('input[type="checkbox"]').addEventListener('click', (e)=>{
      if(e.target.checked === true || e.target.checked === "checked") {
        e.target.checked = "checked";
      } else {
        e.target.checked = null;
      }
      //
      this.user.optin = e.target.checked;
      this.$store.commit('user/updateInfos', {...this.$store.state.user.infos, optin: this.user.optin})
    })
    document.querySelectorAll('input[type="radio"]').forEach((elem) => {
      elem.addEventListener('click', (e) => {
       if(e.target.checked){
         this.$store.commit('user/updateInfos', {...this.$store.state.user.infos, civ: e.target.value})
         this.user.civ = this.$store.state.user.infos.civ;
       }
      })
    })

    /* affichage des labels(desc) */
    document.querySelectorAll('.form input').forEach((elem)=> {
      elem.addEventListener('keypress', (e) => {
        const desc  = e.target.closest('span').querySelector('.desc')
        gsap.to(desc, {opacity:1, duration:0.5})
      })
    })
    /* document.querySelector('select').addEventListener('change', (e)=>{
      const desc  = e.target.closest('span').querySelector('.desc')
      gsap.to(desc, {opacity:1, duration:0.5})
    }) */
  },
  updated() {
    console.log('updated')
    this.checkFields();
    },
  methods: {
    oninput(value){
      this.user.concession= value;
      this.$store.commit('user/updateInfos', {...this.$store.state.user.infos, concession:value})
      this.checkFields()

    },
    checkFields() {
      const regCp = new RegExp(/[0-9]{5}/, 'g');
      const regTel = new RegExp(/[0-9]{10}/, 'g');
      const regFirstname = new RegExp(/[a-zA-Z- ]{2,}/, 'g')
      const regLastname = new RegExp(/[a-zA-Z- ]{2,}/, 'g')
      const regVille = new RegExp(/[a-zA-Z- ]{2,}/, 'g')

      document.querySelectorAll('.error').forEach(e => e.remove());
      this.fieldsOK=0;
      if(this.validateEmail()){this.fieldsOK++;} else {this.fieldAlert('email', 'Adresse Email incorrecte')}
      if(regLastname.test(this.user.lastname)){this.fieldsOK++;} else {this.fieldAlert('lastname', 'champ incorrect');}
      if(regFirstname.test(this.user.firstname)){this.fieldsOK++;} else {this.fieldAlert('firstname', 'champ incorrect');}
      if(regTel.test(this.user.tel)){this.fieldsOK++;} else {this.fieldAlert('tel', 'champ incorrect, ex: 0622446688');}
      if(regCp.test(this.user.cp)){this.fieldsOK++;} else {this.fieldAlert('cp', 'champ incorrect');}

      if(regVille.test(this.user.ville)) {this.fieldsOK++; } else { this.fieldAlert('ville', 'champ incorrect');}

      if(this.user.concession !==''){this.fieldsOK++;} else {this.fieldAlert('concession', 'champ obligatoire');}
      if(this.user.optin){this.fieldsOK++;} else {this.fieldAlert('optin', 'champ obligatoire');}

      // gsap.to('.desc', {opacity:1, duration:0.5})

      if(this.fieldsOK === 8){
        gsap.to('.send', {backgroundColor:'#FFFFFF', color: '#000000', duration:0.5, ease:Expo.easeOut})
      } else {
        gsap.to('.send', {backgroundColor:'transparent', color: '#FFFFFF', duration:0.5, ease:Expo.easeIn})
      }

      return this.fieldsOK === 8;
    },
    fieldAlert(id,m){
      const error = document.createElement("div");
      error.classList.add('error');
       console.log(this.fieldsOK)

      if(id==='optin'){
        error.innerHTML = (this.fieldsOK === 0) ? '' : ' | ' + m;
        document.querySelector('#' + id).parentNode.querySelector('label').after(error);
      } else if(this.fieldsOK === 0){
          console.log('-->')
          error.innerHTML = '';
        } else {
          console.log('<--')
          document.querySelectorAll('.desc').forEach(desc => {
            gsap.to(desc, {opacity:1, duration:0.5})
            error.innerHTML = ' | ' + m;
            document.querySelector('#' + id).before(error);
          })
        }
    },
    checkTop3Cars(){
      this.$store.commit('top3/initTop3', {ev: 0, phev: 0, hev: 0})
      const kmByDay = this.$store.state.user.conduite.kmByDay;
      const kmByYear = this.$store.state.user.conduite.kmByYear;
      const frequenceExtraUrbain = this.$store.state.user.conduite.frequenceExtraUrbain;
      const frequenceAutoroute = this.$store.state.user.conduite.frequenceAutoroute;
      const frequenceVille = this.$store.state.user.conduite.frequenceVille;
      const rechargeBorne = this.$store.state.user.conduite.rechargeBorne;
      const rechargeDomicile = this.$store.state.user.conduite.rechargeDomicile;
      const voyagesOver400km = this.$store.state.user.conduite.voyagesOver400km;
      const coefPriority = [2, 1.5, 1, 0.5];
      const p1 = this.$store.state.user.conduite.priority.p1;
      const p2 = this.$store.state.user.conduite.priority.p2;
      const p3 = this.$store.state.user.conduite.priority.p3;
      const p4 = this.$store.state.user.conduite.priority.p4;



      if (kmByDay < 30) {
        this.$store.commit('top3/updateTop3', {ev: 3, phev: 3, hev: 2})
      } else if (kmByDay >= 30 && kmByDay < 90) {
        this.$store.commit('top3/updateTop3', {ev: 3, phev: 2, hev: 2})
      } else if (kmByDay >= 90) {
        this.$store.commit('top3/updateTop3', {ev: 1, phev:1, hev:3})
      }

      if (kmByYear < 10000) {
        this.$store.commit('top3/updateTop3', {ev: 3, phev: 3, hev: 1})
      } else if (kmByYear >= 10000 && kmByYear < 20000) {
        this.$store.commit('top3/updateTop3', {ev: 2, phev: 2, hev: 2})
      } else if (kmByYear >= 20000) {
        this.$store.commit('top3/updateTop3', {ev: 1, phev:1, hev:3})
      }

      if(voyagesOver400km === 'Rarement') {
        this.$store.commit('top3/updateTop3', {ev: 3, phev: 2, hev: 1})
      } else if(voyagesOver400km === 'De temps en temps') {
        this.$store.commit('top3/updateTop3', {ev: 2, phev: 2, hev: 2})
      } else if(voyagesOver400km === 'Souvent') {
        this.$store.commit('top3/updateTop3', {ev: 1, phev: 2, hev: 3})
      }

      if(frequenceVille === 'Parfois') {
        this.$store.commit('top3/updateTop3', {ev: 2, phev: 2, hev: 2})
      } else if(frequenceVille === 'Régulièrement') {
        this.$store.commit('top3/updateTop3', {ev: 3, phev: 2, hev: 2})
      } else if(frequenceVille === 'Souvent') {
        this.$store.commit('top3/updateTop3', {ev: 3, phev: 2, hev: 2})
      }

      if(frequenceAutoroute === 'Parfois') {
        this.$store.commit('top3/updateTop3', {ev: 2, phev: 2, hev: 2})
      } else if(frequenceAutoroute === 'Régulièrement') {
        this.$store.commit('top3/updateTop3', {ev: 1, phev: 2, hev: 3})
      } else if(frequenceAutoroute === 'Souvent') {
        this.$store.commit('top3/updateTop3', {ev: 1, phev: 1, hev: 3})
      }

      if(frequenceExtraUrbain === 'Parfois') {
        this.$store.commit('top3/updateTop3', {ev: 3, phev: 3, hev: 2})
      } else if(frequenceExtraUrbain === 'Régulièrement') {
        this.$store.commit('top3/updateTop3', {ev: 2, phev: 2, hev: 3})
      } else if(frequenceExtraUrbain === 'Souvent') {
        this.$store.commit('top3/updateTop3', {ev: 1, phev: 1, hev: 3})
      }

      if(rechargeDomicile === 1) {
        this.$store.commit('top3/updateTop3', {ev: 3, phev: 3, hev: 0})
      } else if(rechargeDomicile === 0 || rechargeDomicile === false) {
        this.$store.commit('top3/updateTop3', {ev: -2, phev: -1, hev: 1})
      }

      if(rechargeBorne === 1) {
        this.$store.commit('top3/updateTop3', {ev: 3, phev: 3, hev: 0})
      } else if(rechargeBorne === 0 || rechargeBorne === false) {
        this.$store.commit('top3/updateTop3', {ev: -1, phev: -1, hev: 1})
      }

      /* PRIO EV */
      const prioScoreAutonomieEV = 1;
      let scoreEV
      if(p1 === 'autonomie') {
        scoreEV = coefPriority[0] * prioScoreAutonomieEV;
      } else if(p2 === 'autonomie') {
        scoreEV = coefPriority[1] * prioScoreAutonomieEV;
      } else if(p3 === 'autonomie') {
        scoreEV = coefPriority[2] * prioScoreAutonomieEV;
      } else if(p4 === 'autonomie') {
        scoreEV = coefPriority[3] * prioScoreAutonomieEV;
      }

      const prioScorePuissanceEv = 2;
      if(p1 === 'puissance') {
        scoreEV += coefPriority[0] * prioScorePuissanceEv;
      } else if(p2 === 'puissance') {
        scoreEV += coefPriority[1] * prioScorePuissanceEv;
      } else if(p3 === 'puissance') {
        scoreEV += coefPriority[2] * prioScorePuissanceEv;
      } else if(p4 === 'puissance') {
        scoreEV += coefPriority[3] * prioScorePuissanceEv;
      }

      const prioScoreSilenceEv = 3;
      if(p1 === 'silence') {
        scoreEV += coefPriority[0] * prioScoreSilenceEv;
      } else if(p2 === 'silence') {
        scoreEV += coefPriority[1] * prioScoreSilenceEv;
      } else if(p3 === 'silence') {
        scoreEV += coefPriority[2] * prioScoreSilenceEv;
      } else if(p4 === 'silence') {
        scoreEV += coefPriority[3] * prioScoreSilenceEv;
      }

      const prioScoreCoffreEv = 3;
      if(p1 === 'coffre') {
        scoreEV += coefPriority[0] * prioScoreCoffreEv;
      } else if(p2 === 'coffre') {
        scoreEV += coefPriority[1] * prioScoreCoffreEv;
      } else if(p3 === 'coffre') {
        scoreEV += coefPriority[2] * prioScoreCoffreEv;
      } else if(p4 === 'coffre') {
        scoreEV += coefPriority[3] * prioScoreCoffreEv;
      }

      /* PRIO PHEV */
      const prioScoreAutonomiePHEV = 2;
      let scorePHEV = 0;

      if(p1 === 'autonomie') {
        scorePHEV = coefPriority[0] * prioScoreAutonomiePHEV;
      } else if(p2 === 'autonomie') {
        scorePHEV = coefPriority[1] * prioScoreAutonomiePHEV;
      } else if(p3 === 'autonomie') {
        scorePHEV = coefPriority[2] * prioScoreAutonomiePHEV;
      } else if(p4 === 'autonomie') {
        scorePHEV = coefPriority[3] * prioScoreAutonomiePHEV;
      }

      const prioScorePuissancePHEV = 2;
      if(p1 === 'puissance') {
        scorePHEV += coefPriority[0] * prioScorePuissancePHEV;
      } else if(p2 === 'puissance') {
        scorePHEV += coefPriority[1] * prioScorePuissancePHEV;
      } else if(p3 === 'puissance') {
        scorePHEV += coefPriority[2] * prioScorePuissancePHEV;
      } else if(p4 === 'puissance') {
        scorePHEV += coefPriority[3] * prioScorePuissancePHEV;
      }

      const prioScoreSilencePHEV = 2;
      if(p1 === 'silence') {
        scorePHEV += coefPriority[0] * prioScoreSilencePHEV;
      } else if(p2 === 'silence') {
        scorePHEV += coefPriority[1] * prioScoreSilencePHEV;
      } else if(p3 === 'silence') {
        scorePHEV += coefPriority[2] * prioScoreSilencePHEV;
      } else if(p4 === 'silence') {
        scorePHEV = coefPriority[3] * prioScoreSilencePHEV;
      }

      const prioScoreCoffrePHEV = 1;
      if(p1 === 'coffre') {
        scorePHEV += coefPriority[0] * prioScoreCoffrePHEV;
      } else if(p2 === 'coffre') {
        scorePHEV += coefPriority[1] * prioScoreCoffrePHEV;
      } else if(p3 === 'coffre') {
        scorePHEV += coefPriority[2] * prioScoreCoffrePHEV;
      } else if(p4 === 'coffre') {
        scorePHEV += coefPriority[3] * prioScoreCoffrePHEV;
      }

      /* PRIO HEV */
      const prioScoreAutonomieHEV = 3;
      let scoreHEV = 0;

      if(p1 === 'autonomie') {
        scoreHEV = coefPriority[0] * prioScoreAutonomieHEV;
      } else if(p2 === 'autonomie') {
        scoreHEV = coefPriority[1] * prioScoreAutonomieHEV;
      } else if(p3 === 'autonomie') {
        scoreHEV = coefPriority[2] * prioScoreAutonomieHEV;
      } else if(p4 === 'autonomie') {
        scoreHEV = coefPriority[3] * prioScoreAutonomieHEV;
      }

      const prioScorePuissanceHEV = 1;
      if(p1 === 'puissance') {
        scoreHEV += coefPriority[0] * prioScorePuissanceHEV;
      } else if(p2 === 'puissance') {
        scoreHEV += coefPriority[1] * prioScorePuissanceHEV;
      } else if(p3 === 'puissance') {
        scoreHEV += coefPriority[2] * prioScorePuissanceHEV;
      } else if(p4 === 'puissance') {
        scoreHEV += coefPriority[3] * prioScorePuissanceHEV;
      }

      const prioScoreSilenceHEV = 1;
      if(p1 === 'silence') {
        scoreHEV += coefPriority[0] * prioScoreSilenceHEV;
      } else if(p2 === 'silence') {
        scoreHEV += coefPriority[1] * prioScoreSilenceHEV;
      } else if(p3 === 'silence') {
        scoreHEV += coefPriority[2] * prioScoreSilenceHEV;
      } else if(p4 === 'silence') {
        scoreHEV = coefPriority[3] * prioScoreSilenceHEV;
      }

      const prioScoreCoffreHEV = 3;
      if(p1 === 'coffre') {
        scoreHEV += coefPriority[0] * prioScoreCoffreHEV;
      } else if(p2 === 'coffre') {
        scoreHEV += coefPriority[1] * prioScoreCoffreHEV;
      } else if(p3 === 'coffre') {
        scoreHEV += coefPriority[2] * prioScoreCoffreHEV;
      } else if(p4 === 'coffre') {
        scoreHEV += coefPriority[3] * prioScoreCoffreHEV;
      }

      if(scoreEV === scorePHEV || scoreEV === scoreHEV || scorePHEV === scoreHEV || (scoreEV === scorePHEV && scoreEV === scoreHEV)){
        scoreEV *= 1.2;
        scorePHEV*= 1.1
        scoreHEV *= 1
      }

      this.$store.commit('top3/updateTop3', {ev: scoreEV, phev: scorePHEV, hev: scoreHEV})
    },
    submit() {
      this.checkTop3Cars();

       if(this.checkFields()){
        console.log('all Fields are OK', this.user);


        this.$store.commit('user/updateInfos', this.user)
        this.checkTop3Cars();
        this.$router.push('/vos-modeles')
        console.log(this.$store.state.user.infos)

        // console.log(this.register);
         this.$axios.$post('/webservice/rest/kia/lp_niro_2022.php?step=1', this.user).then(
          (res) => {
            console.log(res);
            this.$store.commit('user/updateId', res.id);
          },
          (err) => console.log(err)
        );
      } else {
         console.log('all Fields are not OK');
      };
    },
    validateEmail() {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.user.email).toLowerCase());
    },
  }
}
</script>
<style lang="scss">
:root {
  --vs-colors--lightest: #fff;
  --vs-colors--light: #FFF;
  --vs-colors--dark: #999;
  --vs-colors--darkest: #999;

  /* Search Input */
  --vs-search-input-color: var(--vs-colors--dark);
  --vs-search-input-placeholder-color: var(--vs-colors--dark);

  /* Font */
  --vs-font-size: 13px;
  --vs-line-height: 1.4;

  /* Disabled State */
  --vs-state-disabled-bg: rgb(248, 248, 248);
  --vs-state-disabled-color: var(--vs-colors--light);
  --vs-state-disabled-controls-color: var(--vs-colors--light);
  --vs-state-disabled-cursor: not-allowed;

  /* Borders */
  --vs-border-color: var(--vs-colors--dark);
  --vs-border-width: 1px;
  --vs-border-style: solid;
  --vs-border-radius: 0px;

  /* Actions: house the component controls */
  --vs-actions-padding: 4px 6px 0 3px;

  /* Component Controls: Clear, Open Indicator */
  --vs-controls-color: var(--vs-colors--light);
  --vs-controls-size: 1;
  --vs-controls--deselect-text-shadow: 0 1px 0 #fff;

  /* Selected */
  --vs-selected-bg: #f0f0f0;
  --vs-selected-color: var(--vs-colors--dark);
  --vs-selected-border-color: var(--vs-border-color);
  --vs-selected-border-style: var(--vs-border-style);
  --vs-selected-border-width: var(--vs-border-width);

  /* Dropdown */
  --vs-dropdown-bg: #fff;
  --vs-dropdown-color: inherit;
  --vs-dropdown-z-index: 1000;
  --vs-dropdown-min-width: 450px;
  --vs-dropdown-max-height: 350px;
  --vs-dropdown-box-shadow: 0px 3px 6px 0px var(--vs-colors--darkest);

  /* Options */
  --vs-dropdown-option-bg: #000;
  --vs-dropdown-option-color: var(--vs-dropdown-color);
  --vs-dropdown-option-padding: 3px 20px;

  /* Active State */
  --vs-dropdown-option--active-bg: #5897fb;
  --vs-dropdown-option--active-color: #fff;

  /* Deselect State */
  --vs-dropdown-option--deselect-bg: #fb5858;
  --vs-dropdown-option--deselect-color: #fff;

  /* Transitions */
  --vs-transition-timing-function: cubic-bezier(1, -0.115, 0.975, 0.855);
  --vs-transition-duration: 150ms;
}

.vs__dropdown-option{
  font-size: 13px !important;
  font-family: "Kia Signature Fix Light", serif !important;
}

.form {
  margin-top: 20px;
  width:470px;
  .fields{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    .field{
      width:calc(50% - 5px)
    }
  }
  .field {
    margin-bottom: 1em;
    &.last {
      margin-top: 30px;
      label {
        font-size: 12px;
        font-family: "Kia Signature Fix Regular", serif;
        color: #fff;
        a {
          color: inherit;
        }
      }
    }
    .desc {
      display: inline;
      opacity:0;
      font-size: 14px;
      color:#FFF;
      font-family: "Kia Signature Fix Bold", serif;
      padding-bottom: 4px;

      &.concession {
        opacity: 1;
      }
    }
    .error {
      display: inline;
      font-size: 12px;
      color:red;
      font-family: "Kia Signature Fix Bold", serif;
      padding-bottom: 4px;
    }
    input{
      width: calc(100% - 22px);
      border: 1px solid var(--vs-colors--dark);
      border-radius: none !important;
      height:38px;
      background-color: transparent !important;
      padding: 0 10px;
      font-size: 13px;
      font-family: "Kia Signature Fix Light", serif;
      color: #999;
    }

    ::selection{
      background-color: #999;
      color: white;
    }

    input[type="radio"] {
      position:relative;
      /* Add if not using autoprefixer */
      border:none;
      -webkit-appearance: none;
      appearance: none;
      /* For iOS < 15 to remove gradient background */
      background-color: transparent;
      /* Not removed via appearance */
      margin: 0 0 0 10px;
      padding: 0 !important;

      font: inherit;
      color: trasparent;
      width: 18px !important;
      height: 18px;
      border: 1px solid #999;
      border-radius: 50%;
    }
    input[type="radio"]::before {
      content:"";
      width:100%;height:100%;
      position:absolute;
      background-color: #fff;
      border-radius: 50%;
      transform: scale(0);
      transition: 120ms transform ease-in-out;
    }
    input[type="radio"]::after {
      content:"";
      width:100%;height:100%;
      position:absolute;
      background-color: #000;
      border-radius: 50%;
      transform: scale(0);
      transition: 120ms transform ease-in-out;
    }
    input[type="radio"]:checked::before {
      transform: scale(1);
    }
    input[type="radio"]:checked::after {
      transform: scale(0.3);
    }

    input[type="checkbox"] {
      position:relative;
      /* Add if not using autoprefixer */
      border:none;
      -webkit-appearance: none;
      appearance: none;
      /* For iOS < 15 to remove gradient background */
      background-color: transparent;
      /* Not removed via appearance */
      margin: 0 10px 0 0;
      padding: 0 !important;
      color: transparent;
      width: 18px !important;
      height: 18px;
      border: 1px solid #999;
      border-radius: 0 !important;
      vertical-align: middle;
      cursor: pointer;

      &:before {
        content:"";
        width:100%;height:100%;
        position:absolute;
        background-color: #fff;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
      }
      &:checked::before {
        transform: scale(0.9);
      }

      & + label {
        font-size: 12px;
        font-family: "Kia Signature Fix Regular", serif;
        color: #fff;
        a {
          color: inherit;
        }
      }
    }

  }

  input{
    &.send{
      width:160px;
      height:40px;
      display:flex;
      justify-content: center;
      align-items: center;
      margin: 20px auto 0;
      min-width: 160px;
      padding: 0 20px;
      font-size:16px;
      font-family: "Kia Signature Fix Bold", serif;
      background-color: transparent;
      color:#FFF;
      cursor:pointer;
      border:1px solid #999;
      border-radius: 0 !important;
      transition: all 300ms;
      -webkit-appearance: none;

      &.active, &:hover {
        background-color: #FFFFFF;
        color:#000;
        -webkit-appearance: none;
        border-radius: 0 !important;
      }
    }


    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus{
      //border: 1px solid green;
      -webkit-text-fill-color: #999;
      -webkit-box-shadow: 0 0 0px 1000px rgba(48, 37, 33, 1) inset;
      transition: background-color 5000s ease-in-out 0s;
    }



  }


  .v-select {
    width: 470px;
    .vs__dropdown-toggle{
      max-height: 38px;

    }
    .vs__selected-options{
      height: 38px;
      font-size: 13px;
      overflow: hidden;
      .vs__selected {
        height: 34px;
      }
    }
    .vs__search {
      margin: 0;
    }
    input{
      border: none;
    }
    ul{
      li {
        font-size: 13px;
        font-family: "Kia Signature Fix Light", serif;
      }
    }

    @media screen and (max-width:640px){
      width:100%;
    }
  }
  .v-select.drop-up.vs--open .vs__dropdown-toggle {
    border-radius: 0 0 4px 4px;
    border-top-color: transparent;
    border-bottom-color: #999;
  }

  [data-popper-placement='top'] {
    border-radius: 4px 4px 0 0;
    border-top-style: solid;
    border-bottom-style: none;
    box-shadow: none;

  }

  @media screen and(max-width: 640px) {
    width: 100%;
    margin-top: 20px;
    .field{
      margin-bottom: 0.5em;
    }
  }
}
</style>
