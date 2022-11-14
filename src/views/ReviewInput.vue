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


        <b-form-group v-for="v in review_voc" :key="v.uri" label-cols="4" label-cols-lg="2" :label="v.term" label-for="input-default">
          <b-form-input id="input-default" :disabled="v.disabled"></b-form-input>
          <small><i>{{v.description}}</i></small>
        </b-form-group>

      </b-card-text>

      <b-button href="#" variant="primary">Post review</b-button>
    </b-card>
  </div>
</div>
</template>

<script>
export default {
  name: 'ReviewInput',
  data(){
    return{
      review_voc : [
        {term: "Performer", uri:	"http://purl.org/stuff/rev#Performer", description: "The work'k performer", display: true, fr: "en français", type: "input", disabled: true},
        {term: "Reviewer", uri:	"http://purl.org/stuff/rev#Intermediary", description: "The platform / intermediary", display: true, fr: "en français", type: "input", disabled: true},
        {term: "Type", uri:	"http://purl.org/stuff/rev#type", description: "The type of media of a work under review", display: true, fr: "en français", type: "input", disabled: true},
        {term: "Title", uri:	"http://purl.org/stuff/rev#title", description: "The title of the review", display: true, fr: "en français", type: "input", disabled: true},
        {term: "Reviewer", uri:	"http://purl.org/stuff/rev#reviewer", description: "The person that has written the review", display: true, fr: "en français", type: "login"},
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
        {term: "Rating", uri:	"http://purl.org/stuff/rev#rating", description: "A numeric value", display: true, fr: "en français", type: "number", min: 0, max: 10},

        // {term: "TotalVotes", uri:	"http://purl.org/stuff/rev#totalVotes", description: "Number of usefulness votes (integer)", display: true, fr: "en français", type: "textarea"},

      ]
    }
  }


}
</script>

<style lang="css" scoped>
.review-input {

}
</style>
