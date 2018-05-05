<template>
  <q-layout>
    <q-page-container>
      <q-page v-if="!loading">
        <div v-if="data.deleted">
          <h1 style="text-align: center">
            This letter has been deleted
          </h1>
        </div>
        <div v-if="data.content==null && !data.deleted" class="q-pa-md" style="max-width: 700px;margin: auto">

          <div class="row">
            <h4 class="col-12">
              Hi {{data.rname}},
            </h4>

            <p class="col-12 nice" style="">
              <b>{{data.name}}</b> wrote you a private letter. It will be opened in...
            </p>

            <div class="col-12" style="font-size: 150px; text-align: center">
                9<span style="font-size: 25px">days</span>
            </div>

            <p  class="col-12"><strong>A -</strong> The letter will be viewable at this URL, you can save this link for future.</p>

            <p  class="col-12"><strong>B -</strong> You can request for it to be deleted by clicking <q-btn @click="deleteOn=true">here</q-btn>.</p>

            <p  class="col-12"  v-if="!emailRegistered">
              <strong>C -</strong> You should register your email to get notified when this letter is opened.
            </p>
            <p  class="col-12"  v-if="emailRegistered">
              C - An email has already been registered, and you will be notified when this letter becomes active.
            </p>


            <div class="row" v-if="!emailRegistered">
              <div class="col-10">
                <q-input v-model="form.email"
                         @blur="$v.form.email.$touch"
                         @keyup.enter="registerEmail"
                         :error="$v.form.email.$error"
                         stack-label="Your Email" />
              </div>

              <div class="col-2">
                <q-btn @click="registerEmail" color="green">Ok</q-btn>
              </div>

            </div>
          </div>
          <q-modal v-model="deleteOn">
            <q-modal-layout>
              <q-toolbar slot="header" color="red">
                <q-btn
                  flat
                  round
                  dense
                  v-close-overlay
                  icon="keyboard_arrow_left"
                />
                <q-toolbar-title>
                  Are you sure ?
                </q-toolbar-title>
              </q-toolbar>

              <div class="layout-padding">
                <h4 style="text-align: center">
                  The content of this letter will be permanently deleted.
                </h4>

              </div>
              <q-toolbar slot="footer" color="black">
                <q-btn
                  color="red"
                  @click="deleteThis()"
                  label="Yes"
                />
                <q-toolbar-title>
                  forever.
                </q-toolbar-title>

                <q-btn
                  color="primary"
                  @click="deleteOn = false"
                  label="No"
                />

              </q-toolbar>
            </q-modal-layout>

          </q-modal>

        </div>
        <div class="q-pa-md" style="max-width: 700px;margin: auto" v-if="data.content!=null  && !data.deleted">
          <div class="flex flex-center">
            <p style="font-size: 20px;">
              <strong>{{data.name}}</strong> wrote you a letter on the <strong>{{format(data.expirationDate, 'Do of MMMM YYYY')}}</strong>
            </p>
          </div>
          <div v-html="data.content" class="nice"></div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
  import {format, differenceInCalendarDays} from 'date-fns';
  import { required, email } from 'vuelidate/lib/validators'
  import {
    Loading,

    // optional!, for example below
    // with custom spinner
    QSpinnerGears
  } from 'quasar';

  export default {
    name: 'LetterIndex',
    data() {
      return {
        data: {},
        seconds: 0,
        days: 0,
        deleteOn: false,
        form: {
          email: '',
        },
        loading: true,
        emailRegistered: false,
      }
    },
    validations: {
      form: {
        email: { required, email  }
      }
    },
    methods: {
      format,
      deleteThis() {
        this.data.deleted = true;
      },
      registerEmail () {
        this.$v.form.$touch();

        if (this.$v.form.$error) {
          this.$q.notify('Please review fields again.');
          return;
        }

        this.emailRegistered = true;
      },
    },
    created: function() {
      Loading.show();
      this.$axios.get(`/_letter/${this.$route.params.letterID}`).then(({data}) => {
        this.data = data;
        this.data.expirationDate = new Date(data.expirationDate);
        this.data.createdOn = new Date(data.createdOn);
        this.days = differenceInCalendarDays(this.data.expirationDate, this.data.createdOn);
        this.loading = false;
        Loading.hide();
        console.log('this.data', this.data);
      }).catch((err) => {
        console.error('Error', err);
      });
    },
  }
</script>

<style lang="scss" scoped>
  .nice {
    font-size: 1rem; line-height: 1.5rem
  }
</style>
