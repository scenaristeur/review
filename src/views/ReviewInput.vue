<template>
  <div class="review-input container">
    <div>
      <b-card
      title="Review"
      img-src="https://picsum.photos/600/300/?image=25"
      img-alt="Image"
      img-top
      tag="article"
      style="max-width: 200rem;"
      class="mb-2"
      >
      <b-card-text>

        <SolidLogin />
        <div v-if="session == null">

          {{review["http://purl.org/stuff/rev#Intermediary"]}} ask you to post a review : <br>
          Performer : {{review["http://purl.org/stuff/rev#Performer"]}}<br>
          Type of work: {{review["http://purl.org/stuff/rev#type"]}}<br>
          Title: {{review["http://purl.org/stuff/rev#title"]}}<br>
          <b-alert  variant="warning" show>You must login to store the review on your Solid Pod</b-alert>

        </div>


        <div v-else>
          <b-form-group v-for="v in review_voc" :key="v.uri" label-cols="4" label-cols-lg="2" :label="v.term" label-for="input-default">


            <b-form-textarea
            v-if="v.type== 'textarea'"
            v-model="review[v.uri]"
            placeholder="Enter something..."
            rows="3"
            max-rows="6"
            ></b-form-textarea>
            <!-- <div v-else-if="v.type == 'login'">


          </div> -->
          <b-form-rating v-else-if="v.type == 'rating'" v-model="review[v.uri]" variant="warning"></b-form-rating>
          <b-form-input v-else-if="v.type!= 'login'" :type="v.type" :disabled="v.disabled" v-model="review[v.uri]"></b-form-input>

          <small><i>{{v.description}}</i></small>
        </b-form-group>


        <b-button href="#" :disabled="session == null || session.isLoggedIn != true" variant="primary" @click="postReview">Store review on my Pod and allow "<b>{{review['http://purl.org/stuff/rev#Intermediary']}}</b>" to manage this review.
        </b-button>
      </div>

    </b-card-text>

  </b-card>
</div>
</div>
</template>

<script>
export default {
  name: 'ReviewInput',
  components: {
    'SolidLogin': ()=>import('@/components/SolidLogin'),
    // 'DataCaching': ()=>import('@/views/experiments/DataCaching'),
    // 'LevelgraphJsonld': ()=>import('@/views/experiments/LevelgraphJsonld'),
  },
  data(){
    return{
      review_voc : [
        {term: "Performer", uri:	"http://purl.org/stuff/rev#Performer", description: "The work'k performer", display: true, fr: "en français", type: "text", disabled: true},
        {term: "Intermediary", uri:	"http://purl.org/stuff/rev#Intermediary", description: "The platform / intermediary", display: true, fr: "en français", type: "text", disabled: true},
        {term: "Type", uri:	"http://purl.org/stuff/rev#type", description: "The type of media of a work under review", display: true, fr: "en français", type: "text", disabled: true},
        {term: "Title", uri:	"http://purl.org/stuff/rev#title", description: "The title of the review", display: true, fr: "en français", type: "text", disabled: true},
        // {term: "Reviewer", uri:	"http://purl.org/stuff/rev#reviewer", description: "The person that has written the review", display: true, fr: "en français", type: "login"},
        {term: "Text", uri:	"http://purl.org/stuff/rev#text", description: "The text of the review", display: true, fr: "en français", type: "textarea"},
        // {term : "Comment", uri:	"http://purl.org/stuff/rev#Comment", description: "A comment on a review", display: true, fr: "en français", type: "textarea"},
        // {term: "Feedback", uri:	"http://purl.org/stuff/rev#Feedback", description: "Feedback on the review", display: true, fr: "en français", type: "textarea"},
        // {term: "Review", uri:	"http://purl.org/stuff/rev#Review", description: "A review of an work", display: true, fr: "en français", type: "textarea"},
        // {term: "Commenter", uri:	"http://purl.org/stuff/rev#commenter", description: "The commenter on the review", display: true, fr: "en français", type: "textarea"},
        // {term: "Has Review", uri:	"http://purl.org/stuff/rev#hasReview", description: "Associates a work with a a review", display: true, fr: "en français", type: "textarea"},
        // {term: "HasComment", uri:	"http://purl.org/stuff/rev#hasComment", description: "Used to associate a review with a comment on the review", display: true, fr: "en français", type: "textarea"},
        // {term: "HasFeedback", uri:	"http://purl.org/stuff/rev#hasFeedback", description: "Associates a review with a feedback on the review", display: true, fr: "en français", type: "textarea"},
        // {term: "Max Rating", uri:	"http://purl.org/stuff/rev#maxRating", description: "Maximum value for rating property", display: true, fr: "en français", type: "textarea"},
        // {term: "Min Rating", uri:	"http://purl.org/stuff/rev#minRating", description: "Minimum value for rating property", display: true, fr: "en français", type: "textarea"},
        // {term: "PositiveVotes", uri:	"http://purl.org/stuff/rev#positiveVotes", description: "Number of positive usefulness votes (integer)", display: true, fr: "en français", type: "textarea"},
        {term: "Rating", uri:	"http://purl.org/stuff/rev#rating", description: "A numeric value", display: true, fr: "en français", type: "rating"},
        // {term: "TotalVotes", uri:	"http://purl.org/stuff/rev#totalVotes", description: "Number of usefulness votes (integer)", display: true, fr: "en français", type: "textarea"},
      ],
      review:{"rdfs:type": "http://purl.org/stuff/rev#Review"}
    }
  },
  created(){
    this.$checkSolidSession()
    this.processQuery()
  },
  methods:{
    processQuery(){
      console.log(this.$route.query)
      this.review["http://purl.org/stuff/rev#Performer"] = this.$route.query.performer
      this.review["http://purl.org/stuff/rev#Intermediary"] = this.$route.query.intermediary
      this.review["http://purl.org/stuff/rev#type"] = this.$route.query.type
      this.review["http://purl.org/stuff/rev#title"] = this.$route.query.title
    },
    postReview(){
      console.log(this.review)
    }
  },
  computed:{
    session:{
      get () { return this.$store.state.solid.session },
      set (/*value*/) { /*this.updateTodo(value)*/ }
    },
  }


}
</script>

<style lang="css" scoped>
.review-input {

}
</style>
