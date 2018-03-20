import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import jQuery from 'jquery';
import { later } from '@ember/runloop';
const { Promise, hash } = RSVP;
const someCondition = true;

export default Route.extend({
  model() {
    return hash({
      foo: this._loadFoo(),
      bar: this._loadBar()
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  },

  resetController(controller, isExiting) {
    if (isExiting && someCondition) {
      console.log('unloading foo');
      controller.get('foo').unloadRecord();
    }
  },

  _loadFoo() {
    const foo = this.get('store').peekRecord('foo', 1);
    if (foo) {
      console.log('peeking foo');
      return foo;
    } else {
      console.log('finding foo');
      return this.get('store').findRecord('foo', 1);
    }
  },

  _loadBar() {
    return new Promise(resolve => {
      later(resolve, 250);
    });
  },

  actions: {
    refresh() {
      this.refresh();
    }
  }
});

jQuery.mockjax({
  url: '/foos/1',
  responseText: {
    data: {
      id: 1,
      type: 'foo',
      attributes: {
        name: 'Foo 1'
      }
    }
  }
});
