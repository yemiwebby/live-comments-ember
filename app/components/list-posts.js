
  import Component from '@ember/component';
  import axios from 'npm:axios';
  import Pusher from 'npm:pusher-js';
  
  const SAD_EMOJI = [55357, 56864];
  const HAPPY_EMOJI = [55357, 56832];
  const NEUTRAL_EMOJI = [55357, 56848];
  
  export default Component.extend({
      comments: null,
      init() {
          this._super(...arguments);
          this.set('comments', []);
          let pusher = new Pusher('YOUR_APP_KEY', { // update your APP_KEY
              cluster: 'CLUSTER',
              encrypted: true
          });
          const channel = pusher.subscribe('chat');
          channel.bind('post', data => {
              const analysis = data.sentiment > 0 ? HAPPY_EMOJI : (data.sentiment === 0 ? NEUTRAL_EMOJI : SAD_EMOJI);
              const response = {
                  text: data.text,
                  mood: String.fromCodePoint(...analysis)
              }
              this.get('comments').pushObject(response);
          });
      },
      actions: {
          newPost() {
              const text = this.get('newPost');      
              axios.post('http://localhost:3000/posts', { text });
              this.set('newPost', '');
          }
      }
  });