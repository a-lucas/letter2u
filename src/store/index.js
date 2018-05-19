import Vue from 'vue';
import Vuex from 'vuex';
import letter from './letter';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    letter
  },
});

export default store;
