<template>
  <q-layout>
    <q-page-container>
      <q-page>
          <h1 style="text-align: center">
            This letter has been deleted
          </h1>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
  export default {
    name: 'DeleteLetter',
    created: function() {
      this.$axios.delete(`/_letter/${this.$route.params.letterID}`).then((data) => {
        console.log(data);
      }).catch((err) => {
        console.error('Error', err);
      });
    },
  }
</script>

<style scoped>

</style>
