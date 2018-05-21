<template>
  <q-layout>
    <q-page-container>

      <q-page v-if="!loading">
        <h3 style="font-weight: 200;max-width: 700px;margin: auto; padding-top: 50px;">
          <a href="/" class="link-title">
            <img src="~assets/letter2u.svg" style="width: 70px;height: 70px;" class="q-mx-md"/>
            Letter 2 U
          </a>
        </h3>

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

            <p class="col-12 nice q-mb-lg" >
              <b>{{data.name}}</b> wrote you a letter on the <strong>{{format(data.createdOn, 'Do of MMMM YYYY')}}</strong>. It will be opened for you in...
            </p>

            <div class="col-12 big" v-show="days>=1">
              {{days}}
              <span>days</span>
            </div>

            <div class="col-12 big" v-show="days<1 && minutes >= 60 ">
              {{hours}}
              <span v-show="hours>1">hours</span>
              <span v-show="hours==1">hour</span>
            </div>

            <div class="col-12 big" v-show="minutes<60 && seconds > 60 ">
              {{minutes}}
              <span v-show="minutes>1">minutes</span>
              <span v-show="minutes==1">minute</span>
            </div>

            <div class="col-12 big" v-show="seconds<60 && seconds >0">
              {{seconds}}
              <span v-show="seconds>1">seconds</span>
              <span v-show="seconds==1">second</span>
            </div>

            <p  class="col-12 nice q-mt-lg">The letter will be viewable at this URL, you can save this link for future.</p>

            <p  class="col-12 small">You can request for it to be deleted by clicking <q-btn @click="deleteOn=true" size="xs" color="purple" rounded>here</q-btn>.</p>

          </div>
          <q-modal v-model="deleteOn" maximized>
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

              <div class="layout-padding">
                <h4 style="text-align: center">
                  The content of this letter will be permanently deleted.
                </h4>
              </div>

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

<style lang="scss" >
  @import "./../css/common.scss";

  .link-title {
    text-decoration: none;
    color: inherit;
    font-weight: inherit;
    font-size: inherit;
  }
  .nice {
    font-size: 20rem; line-height: 30rem
  }

  body, html {
    font-size: 0.2vw;

    @include breakpoint(lg) {
      font-size: 0.1vw !important;
    }
  }

  .big {
    font-size: 100rem;
    text-align: center;
    span {
      font-size: 15rem;
    }
  }
  .small {
    font-size: 12rem;
  }

</style>

<script>
  import {format, differenceInCalendarDays, differenceInMonths, differenceInHours, differenceInMinutes, differenceInSeconds} from 'date-fns';
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
        hours: 0,
        months: 0,
        minutes: 0,
        seconds: -1,
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
        console.log('data recived from server', data);
        this.data.expirationDate = new Date(data.expirationDate);
        this.data.createdOn = new Date(data.createdOn);
        console.log("ExpirationDate", this.data.expirationDate);


        const calcDiff = () => {
          this.days = differenceInCalendarDays(this.data.expirationDate, new Date());
          this.hours = differenceInHours(this.data.expirationDate, new Date());
          this.months = differenceInMonths(this.data.expirationDate, new Date());
          this.minutes = differenceInMinutes(this.data.expirationDate, new Date());

          const seconds = differenceInSeconds(this.data.expirationDate, new Date());
          if (seconds <= 0 && this.seconds > 0) {
            clearInterval(interval);
            setTimeout(() => {
              location.reload(true);
            }, 2000);
          } else {
            this.seconds = seconds;
          }
          //console.log('DIFF = ', this.days, this.hours, this.minutes, this.seconds);
        };

        calcDiff();

        let interval;
        if (this.seconds >0) {
          interval = setInterval(() => {
            calcDiff();
          }, 1000);
        }

        this.loading = false;
        Loading.hide();
        console.log('this.data', this.data);
      }).catch((err) => {
        console.error('Error', err);
      });
    },
  }
</script>

