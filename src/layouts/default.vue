<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <h3 style="font-weight: 200" class="flex flex-center">
        <img src="~assets/letter2u.svg" style="width: 70px;height: 70px" class="q-pa-md"/>
        Letter 2 U
      </h3>
      <div class="flex flex-center q-mb-lg">
        <q-btn color="purple"
               @click="help=!help"
               rounded
               outline
               size="md">What is this ?</q-btn>
      </div>


      <q-modal v-model="help" content-css="padding: 30px">

        <q-timeline color="secondary">
          <q-timeline-entry heading>
            What is it?
          </q-timeline-entry>

          <q-timeline-entry
            title="An authentic letter"
            subtitle="No registration, You can write a letter, and it will be delivered at a date of your choice."
            side="left"
          >
            <div>
              <span style="font-size: 12px">You got one shot at this.</span>
            </div>
          </q-timeline-entry>


          <q-timeline-entry
            title="No way to go back in time"
            subtitle="The letter is encrypted, and you won't be able to edit or cancel this."
            side="left"
          >
            <div>
              <span style="font-size: 12px">All sent letters are final</span>
            </div>
          </q-timeline-entry>



          <q-timeline-entry
            title="Time clocks"
            subtitle="When the choosen day comes, a link is sent to the recipient who will be able to read the decrypted letter."
            side="left"
          >
            <div>
              <span style="font-size: 12px">You might get an answer</span>
            </div>
          </q-timeline-entry>
        </q-timeline>

        <div class="flex flex-center">
          <q-btn color="secondary" @click="help=!help">
            Got it !
          </q-btn>
        </div>

      </q-modal>

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      help: true,
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
