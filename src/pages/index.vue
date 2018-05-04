<template>
  <q-page>

    <div class="flex flex-center" style="justify-content: center">

      <q-field
        label="Activation Date"
        helper="This letter will be readable after this date"
        class="q-ma-md"
      >
        <q-datetime v-model="form.expirationDate" type="date"
                    @blur="$v.form.expirationDate.$touch"
                    :min="addDays(new Date(), 1)"
                    :error="$v.form.expirationDate.$error"/>
      </q-field>

      <q-field
        label="Sender (YOU)"
        class="q-ma-md"
      >
        <q-input v-model="form.name" float-label="Your name"
                 @blur="$v.form.name.$touch"
                 :error="$v.form.name.$error"/>

        <q-input v-model="form.email" float-label="Your email"
                 @blur="$v.form.email.$touch"
                 :error="$v.form.email.$error"/>
      </q-field>

      <q-field
        label="Recipient"
        class="q-ma-md"
      >
        <q-input v-model="form.rname" float-label="Recipent's name"
                 @blur="$v.form.rname.$touch"
                 :error="$v.form.rname.$error"/>

        <q-input v-model="form.remail" float-label="Recipent's email"
                 @blur="$v.form.remail.$touch"
                 :error="$v.form.remail.$error"/>
      </q-field>
    </div>

    <div class="flex flex-center">
      <q-field
        :error="$v.form.content.$error">
      <vue-editor v-model="form.content"></vue-editor>
      </q-field>
    </div>

    <div class="flex flex-center q-ma-md">
      <q-btn @click="valid()">Create</q-btn>
    </div>

    <q-modal v-model="opened" no-route-dismiss content-css="padding: 30px">
      <h5>This is it, no coming back !</h5>
      <p>This letter will be created, <b>you won't be able to modify it, or cancel it.</b></p>
      <p>This letter will only be readable after the following date: {{format(form.expirationDate, 'Do of MMMM YYYY')}}</p>
      <q-btn
        color="red"
        @click="opened = false"
        label="Back"
      />
      <q-btn
        color="primary"
        @click="send()"
        label="Register and continue"
      />
    </q-modal>
  </q-page>
</template>

<style></style>

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
        this.$axios.post('/letters',this.form).then(({data}) => {
          console.log('success', data);
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
