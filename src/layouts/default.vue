<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <h3 style="font-weight: 200" class="flex flex-center">
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
            How it works
          </q-timeline-entry>

          <q-timeline-entry
            title="Write your letter"
            subtitle="Fill in names and emails, the activation date and take time to review your corespondance"
            side="left"
          >
            <div>
              <span style="font-size: 12px">You got one shot at this.</span>
            </div>
          </q-timeline-entry>


          <q-timeline-entry
            title="Click the button, and send it in the future"
            subtitle="The letter is stored encrypted, and you can't delete it. A link is created that you can share to who you want."
            side="left"
          >
            <div>
              <span style="font-size: 12px">You will probably forget about it.</span>
            </div>
          </q-timeline-entry>



          <q-timeline-entry
            title="Time flys"
            subtitle="When the specified activation day comes, a link is sent to the letter's recipient who will be able to read the un-edited decrypted content."
            side="left"
          >
            <div>
              <span style="font-size: 12px">And you might get an answer ( or not )</span>
            </div>
          </q-timeline-entry>
        </q-timeline>

        <q-btn color="secondary" @click="help=!help">
          Got it !
        </q-btn>
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
