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
            <span class="desc">Email <sup>*</sup></span>
          <input id="email" v-model="user.email" type="email" placeholder="Email" required aria-required="true" autocomplete="email">
        </span>
        </div>
        <div class="fields">
          <div class="field">
          <span class="required">
            <span class="desc">Nom <sup>*</sup></span>
            <input id="lastname" v-model="user.lastname" type="text" placeholder="Nom" required aria-required="true" autocomplete="family-name">
          </span>
          </div>
          <div class="field">
          <span class="required">
            <span class="desc">Prénom<sup>*</sup></span>
            <input id="firstname" v-model="user.firstname" type="text" placeholder="Prénom" required aria-required="true" autocomplete="given-name">
          </span>
          </div>
        </div>
        <div class="field">
          <span class="required">
            <span class="desc">N° de téléphone<sup>*</sup></span>
            <input id="tel" v-model="user.tel" type="text" placeholder="N° de téléphone" required aria-required="true" autocomplete="tel">
          </span>
        </div>
        <div class="fields">
          <div class="field">
            <span class="required">
              <span class="desc">Code postal<sup>*</sup></span>
              <input id="cp" v-model="user.cp" type="text" placeholder="Code postal" required aria-required="true" autocomplete="postal-code">
            </span>
          </div>
          <div class="field">
            <span class="required">
              <span class="desc">Ville<sup>*</sup></span>
              <input id="ville" v-model="user.ville" type="text" placeholder="Ville" required aria-required="true" >
            </span>
          </div>
        </div>
        <div class="field">
          <span class="required">
            <span class="desc concession">Concession<sup>*</sup></span>
            <v-select
              id="concession"
              ref="vselect"
              :options="dealersListe"
              label="label"
              :reduce="(option)=> option.dealer_internalid"
              placeholder="Sélectionnez votre concession"
              :calculate-position="withPopper"
              :searchable=searchable
              @input="oninput"
            ></v-select>
          </span>
        </div>
<!--        <div class="field">
          <div class="desc offres" >Je souhaite recevoir les offres commerciales,<br>les nouveautés et exclusivités de la marque</div>
          <BaseRadioButtonGroup v-model="user.offres" :options="offres" />
        </div>-->
        <div class="field">
          <span class="required">
            <span class="desc"></span>
            <input id="accept" type="checkbox" :checked="user.accept">
            <label for="accept">J’accepte d’être recontacté par un conseiller Kia dans le cadre de mon expérience*</label>
          </span>
        </div>
        <div class="field">
          <span class="">
            <span class="desc"></span>
            <input id="optin" type="checkbox" :checked="user.optin">
            <label for="optin">Je consens au traitement de mes données personnelles à des fins de marketing, tels que définis dans <a href="https://www.kia.com/fr/politique-de-confidentialite/" target="_blank">la Politique de confidentialité</a>. Je pourrais à tout moment exercer mon droit d’opposition à l’utilisation de mes données personnelles.</label>
          </span>
        </div>
        <input class="send" type="submit" value="Lancer l'analyse" >
        <p class="obligatoire">* Champ obligatoire</p>
      </form>
    </div>
    <NavButtons></NavButtons>
  </div>
</template>
<script>
import gsap, {Expo} from "gsap";
import { createPopper } from '@popperjs/core'

const regCp = /[0-9]{5}/
const regTel = /[0-9]{10}/
const regFirstname = /[a-zA-Z- ]{2,}/
const regLastname = /[a-zA-Z- ]{2,}/
const regVille = /[a-zA-Z- ]{2,}/
export default {

  components: {
  },
  data(){
    return {
      title: 'Et vous ?',
      subtitle: 'Nous avons besoin d’en savoir un peu plus',
      checkForm: false,
      fieldsOK:0,
      fieldsRequiredFilled:0,
      dealersListe: [],
      civs:[
        {
          label:"Monsieur",
          checked: "checked",
          value:"M",
          name:'civ'
        },
        {
          label:"Madame",
          checked: false,
          value:"Mme",
          name:'civ'
        }
      ],
      /* offres:[
        {
          label:"Oui",
          checked: false,
          value:"oui",
          name:'offres'
        },
        {
          label:"Non",
          checked: "checked",
          value:"non",
          name:'offres'
        }
      ], */
      user : {
        civ:'',
        email:'',
        firstname:'',
        lastname:'',
        tel:'',
        cp:'',
        ville:'',
        concession: '',
        // offres: 'non',
        accept:false,
        optin: false,
      },
      placement: 'top',
      searchable: false,
      csvDataCP:null,
    }
  },
  computed: {

  },
  created(){
    this.$nuxt.$on('RADIO_CHECKED', (v)=> {
      this.$store.commit('user/updateInfos', {...this.$store.state.user.infos, civ:v})
    })

    fetch('/dealers.json')
      .then(r => r.json())
      .then(json => {
        this.dealersListe = json
        this.dealersListe.map(function(d) {
          d.label = (d.dealer_postcode).toString().substring(0,2) +' — '+ (d.dealer_residence).toUpperCase();
          return d;
        })
      })


     if(this.$device.isDesktop){
      this.searchable = true
    } else {
      this.searchable = false
    }
  },
  mounted() {
    this.user.civ = this.$store.state.user.infos.civ;
    // this.user.offres = this.$store.state.user.infos.offres;

   document.querySelectorAll('input[type="checkbox"]').forEach(cb=> cb.addEventListener('click', (e)=>{
      if(e.target.checked === true || e.target.checked === "checked") {
        e.target.checked = "checked";
      } else {
        e.target.checked = null;
      }
      //
     console.log()
     if(e.target.id==="accept"){
       this.user.accept = e.target.checked;
       this.checkField('accept')
       this.$store.commit('user/updateInfos', {...this.$store.state.user.infos, accept: this.user.accept})
     }
     if(e.target.id==="optin"){
       this.user.optin = e.target.checked;
       this.checkField('optin')
       this.$store.commit('user/updateInfos', {...this.$store.state.user.infos, optin: this.user.optin})
     }

    })
   )

    document.querySelectorAll('input[type="radio"]').forEach((elem) => {
      elem.addEventListener('click', (e) => {
       if(e.target.checked){
         if(e.target.name==="offres"){
           this.$store.commit('user/updateInfos', {...this.$store.state.user.infos, offres: e.target.value})
           this.user.offres = this.$store.state.user.infos.offres;
         } else {
           this.$store.commit('user/updateInfos', {...this.$store.state.user.infos, civ: e.target.value})
           this.user.civ = this.$store.state.user.infos.civ;
         }
       }
      })
    })
    /* affichage des labels(desc) */
    document.querySelectorAll('.form input').forEach((elem)=> {
      elem.addEventListener('keypress', (e) => {
        const desc  = e.target.closest('span').querySelector('.desc')
        gsap.to(desc, {opacity:1, duration:0.5})
      })
      elem.addEventListener('blur', (e)=> {
        this.onblur(e);
      })
    })
  },
  methods: {
    withPopper(dropdownList, component, { width }) {
      /**
       * We need to explicitly define the dropdown width since
       * it is usually inherited from the parent with CSS.
       */
      dropdownList.style.width = width

      /**
       * Here we position the dropdownList relative to the $refs.toggle Element.
       *
       * The 'offset' modifier aligns the dropdown so that the $refs.toggle and
       * the dropdownList overlap by 1 pixel.
       *
       * The 'toggleClass' modifier adds a 'drop-up' class to the Vue Select
       * wrapper so that we can set some styles for when the dropdown is placed
       * above.
       */
      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: this.placement,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -1],
            },
          },
          {
            name: 'toggleClass',
            enabled: true,
            phase: 'write',
            fn({ state }) {
              component.$el.classList.toggle(
                'drop-up',
                state.placement === 'top'
              )
            },
          },
        ],
      })

      /**
       * To prevent memory leaks Popper needs to be destroyed.
       * If you return function, it will be called just before dropdown is removed from DOM.
       */
      return () => popper.destroy()
    },
    onblur(e){
      this.checkField(e.target.id)
    },
    oninput(value){
      this.user.concession= value;
      this.$store.commit('user/updateInfos', {...this.$store.state.user.infos, concession:value})
      this.checkFields()
    },
    checkField (id) {
      if (id === 'email') {
        if (this.validateEmail()) {
          this.fieldAlert('email', 'valide');
        } else if (this.user.email === '') {
          this.fieldAlert('email', 'champ obligatoire');
        } else {
          this.fieldAlert('email', 'Adresse Email incorrecte');
        }
      } else if (id === 'lastname') {
        if (regLastname.test(this.user.lastname)) {
          this.fieldAlert('lastname', 'valide');
        } else if (this.user.lastname === '') {
          this.fieldAlert('lastname', 'champ obligatoire');
        } else {
          this.fieldAlert('lastname', 'champ invalide');
        }
      } else if (id === 'firstname') {
        if (regFirstname.test(this.user.firstname)) {
          this.fieldAlert('firstname', 'valide');
        } else if (this.user.firstname === '') {
          this.fieldAlert('firstname', 'champ obligatoire');
        } else {
          this.fieldAlert('firstname', 'champ invalide');
        }
      } else if (id === 'tel') {
        if (regTel.test(this.user.tel)) {
          this.fieldAlert('tel', 'valide');
        } else if (this.user.tel === '') {
          this.fieldAlert('tel', 'champ obligatoire');
        } else {
          this.fieldAlert('tel', 'champ incorrect, ex: 0622446688');
        }
      } else if (id === 'cp') {
        if (regCp.test(this.user.cp)) {
          this.fieldAlert('cp', 'valide');
          //
          const preOptionsSep = (opt)=> opt.label === '———————————————';
          const index = this.$refs.vselect.options.findIndex(preOptionsSep)
          if(index>0){
            this.$refs.vselect.options = this.$refs.vselect.options.slice(-(this.$refs.vselect.options.length-index-1))
          }
          const cpRes = this.$refs.vselect.options.filter(opt => opt.dealer_postcode.substring(0, 2) === this.user.cp.substring(0, 2))
          cpRes.push({
            "dealer_internalid": "0",
            "dealer_postcode":"",
            "dealer_residence": "",
            "dealer_longitude": 0,
            "dealer_latitude": 0,
            "label":"———————————————"
          })
          cpRes.reverse();
          cpRes.forEach(c => {
            this.$refs.vselect.options.unshift(c)
          })


          //

        } else if (this.user.cp === '') {
          this.fieldAlert('cp', 'champ obligatoire');
        } else {
          this.fieldAlert('cp', 'champ incorrect');
        }
      } else if (id === 'ville') {
        if (regVille.test(this.user.ville)) {
          this.fieldAlert('ville', 'valide');
        } else if (this.user.ville === '') {
          this.fieldAlert('ville', 'champ obligatoire');
        } else {
          this.fieldAlert('ville', 'champ incorrect');
        }
      } else if (id === 'accept') {
        if(this.user.accept) {
          this.fieldAlert('accept', 'valide');
        } else {
          this.fieldAlert('accept', 'champ obligatoire');
        }
      }

      if (this.user.email !== '' &&
        this.user.lastname !== '' &&
        this.user.firstname !== '' &&
        this.user.tel !== '' &&
        this.user.cp !== '' &&
        this.user.ville !== '' &&
        this.user.concession !== '' && this.user.concession !=='0' &&
        this.user.accept
        ) {
        gsap.to('.send', {backgroundColor: '#FFFFFF', color: '#000000', duration: 0.5, ease: Expo.easeOut})
      } else {
        gsap.to('.send', {backgroundColor: 'transparent', color: '#FFFFFF', duration: 0.5, ease: Expo.easeIn})
      }

    },
    checkFields () {
      document.querySelectorAll('.error').forEach(e => e.remove());
      this.fieldsOK = 0;
      if (this.validateEmail()) {
        this.fieldsOK++;
        this.fieldAlert('email', 'valide');
      } else if(this.user.email ==='') {
        this.fieldAlert('email', 'champ obligatoire');
      } else  {
        this.fieldAlert('email', 'Adresse Email incorrecte');
      }
      if (regLastname.test(this.user.lastname)) {
        this.fieldsOK++;
        this.fieldAlert('lastname', 'valide');
      } else if(this.user.lastname ==='') {
        this.fieldAlert('lastname', 'champ obligatoire');
      } else {
        this.fieldAlert('lastname', 'champ invalide');
      }
      if (regFirstname.test(this.user.firstname)) {
        this.fieldsOK++;
        this.fieldAlert('firstname', 'valide');
      } else if(this.user.firstname ==='') {
        this.fieldAlert('firstname', 'champ obligatoire');
      } else {
        this.fieldAlert('firstname', 'champ invalide');
      }
      if (regTel.test(this.user.tel)) {
        this.fieldsOK++;
        this.fieldAlert('tel', 'valide');
      } else if(this.user.tel ==='') {
        this.fieldAlert('tel', 'champ obligatoire');
      } else {
        this.fieldAlert('tel', 'champ incorrect, ex: 0622446688');
      }
      if (regCp.test(this.user.cp)) {
        this.fieldsOK++;
        this.fieldAlert('cp', 'valide');
      } else if(this.user.cp ==='') {
        this.fieldAlert('cp', 'champ obligatoire');
      } else {
        this.fieldAlert('cp', 'champ incorrect');
      }
      if (regVille.test(this.user.ville)) {
        this.fieldsOK++;
        this.fieldAlert('ville', 'valide');
      } else if(this.user.ville ==='') {
        this.fieldAlert('ville', 'champ obligatoire');
      } else {
        this.fieldAlert('ville', 'champ incorrect');
      }
      if (this.user.concession !== '' && this.user.concession !== '0') {
        this.fieldsOK++;
      } else {
        this.fieldAlert('concession', 'champ obligatoire');
      }

      if(this.user.accept){
        this.fieldsOK++;
      } else {
        this.fieldAlert('accept', 'champ obligatoire');
      }

      //
      return this.fieldsOK === 8;
    },
    fieldAlert(id,m){
      if(document.querySelector('#'+id).parentNode.querySelector('.error')!==null || m==="valide"){
        document.querySelector('#'+id).parentNode.querySelectorAll('.error').forEach(e=>e.remove())
      } else if(m!=="valide"){
        const error = document.createElement("div");
        error.classList.add('error');
        error.innerHTML = m
        document.querySelector('#' + id).before(error);
      }

      document.querySelectorAll('.desc').forEach(desc => {
        gsap.to(desc, {opacity:1, duration:0.5})
      })

    },
    validateEmail() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.user.email).toLowerCase());
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
        // console.log('all Fields are OK', this.user);
        this.$store.commit('user/updateInfos', this.user)
        this.checkTop3Cars();
        this.$router.push('/vos-modeles')

        // START SEND TO WS
        const bestCarModel = this.getSortedKeys(this.$store.state.top3).slice(0, 1)[0]
        let best=''
        if(bestCarModel === 'ev'){ best = 'NIRO EV (SG2 EV)'}
        else if(bestCarModel === 'phev'){ best = 'NIRO PHEV (SG2)'}
        else if(bestCarModel === 'hev'){ best = 'NIRO HEV (SG2)'}

         // console.log({ model: best, userInfos : this.user, userDatas : this.$store.state.user.conduite, source:  this.$store.state.source });

         this.$axios.$post('/webservice/rest/kia/lp_niro_2022.php?step=1', {
           model: best,
           userInfos : this.user,
           userPrefs : this.$store.state.user.conduite,
           source:  this.$store.state.source
         }).then(
          (res) => {
            // console.log(res);
            this.$store.commit('user/updateId', res.id);
          },
          (err) => console.log(err)
        );
         // END SEND TO WS

      } else {
         // console.log('all Fields are not OK');
      };
    },

    getSortedKeys(obj) {
      // console.log(obj)
      const keys = Object.keys(obj);
      const arr =  keys.sort(function(a,b){return obj[b]-obj[a]})
      if(arr[1]==='ev' && (arr[0] === 'phev' || arr[0]==='hev')){
        const arr1 = arr[0];
        arr[0] = 'ev';
        arr[1] = arr1;
      }
      if(arr[0]==='hev' && arr[1] === 'phev'){
        arr[0] = 'phev';
        arr[1] = 'hev';
      }
      // console.log(arr)
      return arr;
    }
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
  --vs-dropdown-max-height: 300px;
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

body {
  position:fixed;
  top:0;width:100vw;
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
      position: relative;
      display: inline;
      opacity:0;
      font-size: 14px;
      color:#FFF;
      font-family: "Kia Signature Fix Bold", serif;
      padding-bottom: 4px;

      sup {
        font-size: 1.4em;
        position:absolute;
        right:-10px;top:-3px;
        font-family: "Kia Signature Fix Light", serif;
      }

      &.concession, &.offres {
        opacity: 1;
      }
      &.offres {
        font-size: 12px;
        font-family: "Kia Signature Fix Regular", serif;
        margin-bottom: 16px;
      }
    }


    .error {
      display: inline;
      font-size: 12px;
      color:red;
      font-family: "Kia Signature Fix Bold", serif;
      float:right;
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
      margin: 0 10px 0 0;
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

  ul[role="listbox"]{
    max-height: 300px;
  }

  [data-popper-placement='top'] {
    border-radius: 4px 4px 0 0;
    border-top-style: solid;
    border-bottom-style: none;
    box-shadow: none;

  }

  .obligatoire {
    font-size: 12px;
    font-family: "Kia Signature Fix Regular", serif;
    margin-bottom: 16px;
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
