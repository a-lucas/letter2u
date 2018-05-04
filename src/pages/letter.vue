<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div v-if="data.content==null" class="q-pa-md">

          <div class="row">
            <h4 class="col-12">
              Hi {{data.rname}}, this is a message from the future.
            </h4>

            <p class="col-12">
              <b>{{data.name}}</b> will write you a letter in  <strong>{{format(data.createdOn, 'Do of MMMM YYYY')}}</strong>
            </p>
            <p  class="col-12">When this will happen, you will get notified.</p>
          </div>
        </div>

        <div class="q-pa-md"  v-if="data.content != null">
          <div class="flex flex-center">
            <p >
              <strong>{{data.name}}</strong> wrote you a letter on the {{format(data.activationDate, 'Do of MMMM YYYY')}}

            </p>
          </div>
          <div class="flex flex-center">
            <div  v-html="data.content"></div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
  import {format} from 'date-fns';

  export default {
    name: 'LetterIndex',
    data() {
      return {
        data: {}
      }
    },
    methods: {
        format,
    },
    created: function() {
        console.log(this.$route.params);

        this.$axios.get(`/letter/${this.$route.params.letterID}`).then(({data}) => {
          console.log(data);
          this.data = data;
          this.data.expirationData = new Date(data.expirationDate);
          this.data.createdOn = new Date(data.createdOn);
        });
    },
  }
</script>
