import { matches } from 'lodash';

import { deserialize } from '../src/index';
import { Document } from '../src/interfaces';

describe('deserialize', () => {

  it('should deserialize jsonapi spec example', () => {
    let example: Document = {
      'data': [{
        'type': 'articles',
        'id': '1',
        'attributes': {
          'title': 'JSON API paints my bikeshed!'
        },
        'links': {
          'self': 'http://example.com/articles/1'
        },
        'relationships': {
          'author': {
            'links': {
              'self': 'http://example.com/articles/1/relationships/author',
              'related': 'http://example.com/articles/1/author'
            },
            'data': { 'type': 'people', 'id': '9' }
          },
          'comments': {
            'links': {
              'self': 'http://example.com/articles/1/relationships/comments',
              'related': 'http://example.com/articles/1/comments'
            },
            'data': [
              { 'type': 'comments', 'id': '5' },
              { 'type': 'comments', 'id': '12' }
            ]
          }
        }
      }],
      'included': [{
        'type': 'people',
        'id': '9',
        'attributes': {
          'first-name': 'Dan',
          'last-name': 'Gebhardt',
          'twitter': 'dgeb'
        },
        'links': {
          'self': 'http://example.com/people/9'
        }
      }, {
        'type': 'comments',
        'id': '5',
        'attributes': {
          'body': 'First!'
        },
        'relationships': {
          'author': {
            'data': { 'type': 'people', 'id': '2' }
          }
        },
        'links': {
          'self': 'http://example.com/comments/5'
        }
      }, {
        'type': 'comments',
        'id': '12',
        'attributes': {
          'body': 'I like XML better'
        },
        'relationships': {
          'author': {
            'data': { 'type': 'people', 'id': '9' }
          }
        },
        'links': {
          'self': 'http://example.com/comments/12'
        }
      }]
    };

    let result: any = deserialize(example);

    let expected = [
      {
        'id': '1',
        'title': 'JSON API paints my bikeshed!',
        'author': {
          'id': '9',
          'first-name': 'Dan',
          'last-name': 'Gebhardt',
          'twitter': 'dgeb'
        },
        'comments': [
          { 'id': '5', 'body': 'First!' },
          { 'id': '12', 'body': 'I like XML better' }
        ]
      }
    ];

    expect(matches(expected)(result)).toBe(true);
  });

});
