import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify, {
    theme: {
        primary: '#CE3772',
        secondary: '#3F557F',
        accent: '#CFC34C',
        error: '#b71c1c', 
        text_main:'#212121',
        text_sub: '#767676',
        background:'#BDC4D2'
    },
})

const opts = {
    theme: {
        primary: '#CE3772',
        secondary: '#3F557F',
        accent: '#CFC34C',
        error: '#b71c1c', 
        text_main:'#212121',
        text_sub: '#767676',
        background:'#BDC4D2'
    },
}

export default new Vuetify()