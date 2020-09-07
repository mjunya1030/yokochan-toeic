import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
      iconfont: 'mdi'
    },
    theme: {
        themes: {
            light: {
                primary: '#CE3772',
                secondary: '#3F557F',
                accent: '#CFC34C',
                error: '#b71c1c', 
                text_main:'#212121',
                text_sub: '#767676',
                background:'#BDC4D2'
            },
        },
    },
    customVariables: ['~/sass/variables.scss'],
});