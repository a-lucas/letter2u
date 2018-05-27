<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-lg-3 form-padding col-sm-8">
        <q-field
          label="Activation Date"
          helper="This letter will be readable after this date"
        >
          <q-datetime v-model="form.expirationDate" type="date"
                      @blur="$v.form.expirationDate.$touch"
                      format="Do MMM YYYY"
                      :min="addDays(new Date(), 1)"
                      :error="$v.form.expirationDate.$error"/>
        </q-field>
      </div>

      <div class="col-lg-4 form-padding col-sm-8">
        <q-field
          label="From"
          helper="Information about yourself"
        >
          <q-input v-model="form.name" float-label="Your name"
                   @blur="$v.form.name.$touch"
                   :error="$v.form.name.$error"/>

          <q-input v-model="form.email" float-label="Your email"
                   @blur="$v.form.email.$touch"
                   :error="$v.form.email.$error"/>
        </q-field>

      </div>
      <div class="col-lg-4 form-padding col-sm-8">
        <q-field
          label="To"
          helper="Where do we send this letter?"
        >
          <q-input v-model="form.rname" float-label="Recipent's name"
                   @blur="$v.form.rname.$touch"
                   :error="$v.form.rname.$error"/>

          <q-input v-model="form.remail" float-label="Recipent's email"
                   @blur="$v.form.remail.$touch"
                   :error="$v.form.remail.$error"/>
        </q-field>
      </div>
    </div>
    <div class="flex justify-center row q-mt-xl">
      <div class="col-11">
        <vue-editor v-model="form.content"></vue-editor>
      </div>


    </div>
    <div class="row q-ma-md" style="justify-content: center">
      <q-btn @click="valid()" color="purple">Create</q-btn>
    </div>


    <q-modal v-model="opened" no-route-dismiss content-css="padding: 10px">
      <p style="text-align: center"><u>You are responsible of what you send.</u></p>
      <p style="text-align: center">This letter will be sent - no matter what happens, <b>you won't be able to modify it, or cancel it.</b></p>
      <p style="text-align: center">This letter will only be readable after the following date: <b>{{format(form.expirationDate, 'Do of MMMM YYYY')}}</b></p>

      <div class="flex flex-center">
        <q-btn
          color="red"
          @click="opened = false"
          size="lg"
          label="No, let me check it again."
        />
        <q-btn
          color="primary"
          @click="send()"
          label="I understand and wish to proceed"
        />
      </div>

    </q-modal>
  </q-page>
</template>

<style lang="scss">

  @mixin breakpoint($class) {
    @if $class == xs {
      @media (max-width: 767px) { @content; }
    }

    @else if $class == sm {
      @media (min-width: 768px) { @content; }
    }

    @else if $class == md {
      @media (min-width: 992px) { @content; }
    }

    @else if $class == lg {
      @media (min-width: 1200px) { @content; }
    }

    @else {
      @warn "Breakpoint mixin supports: xs, sm, md, lg";
    }
  }

  .form-padding {
    padding: 10px;
    margin: 10px;
    border: 2px solid #ececec;

    @include breakpoint(md) {
      margin: 0;
      border: 0;
      padding: 10px;
    }

    @include breakpoint(lg) {
      padding: 20px;
    }

  }
  .ql-container {
    height: auto !important;

    @include breakpoint(md) {
      min-height: 50vh !important;
    }

    @include breakpoint(lg) {
      min-height: 40vh !important;
    }
  }
</style>

<script>
  import { VueEditor, Quill } from 'vue2-editor'
  import { required, email } from 'vuelidate/lib/validators'
  import {format, addDays} from 'date-fns';

  export default {
    name: 'PageIndex',
    data() {
      return {
        form: {
          email: '',
          expirationDate: '',
          content: '',
          name: '',
          rname: '',
          remail: ''
        },
        opened: false,
        help: true,
      }
    },
    validations: {
      form: {
        email: { required, email  },
        expirationDate: { required},
        content: { required},
        name: { required},
        rname: { required},
        remail: { required, email  }
      }
    },
    methods: {
      format,
      addDays,
      valid() {
        this.$v.form.$touch();

        if (this.$v.form.$error) {
          this.$q.notify('Please review fields again.');
          return
        }
        this.opened = true;
      },
      send() {
        this.$axios.post('letters',this.form).then(({data}) => {
          this.$router.push({ name: 'letter', params: { letterID: data._id }})
        }, (err) => {
          console.log(err);
        });
      }
    },
    created() {
      console.log(process.env);
    },
    components: {
      VueEditor
    },
  }
</script>
