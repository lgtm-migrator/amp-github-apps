/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {IssueBuilder} from '../src/issue_builder';
import {ErrorReport} from '../src/types';

describe('IssueBuilder', () => {
  let builder: IssueBuilder;
  const report: ErrorReport = {
    errorId: 'CL6chqbN2-bzBA',
    firstSeen: new Date('Feb 25, 2020'),
    dailyOccurrences: 54647,
    stacktrace:
      `Error: null is not an object (evaluating 'b.acceleration.x')
        at x (https://raw.githubusercontent.com/ampproject/amphtml/2004030010070/extensions/amp-delight-player/0.1/amp-delight-player.js:421:13)
        at event (https://raw.githubusercontent.com/ampproject/amphtml/2004030010070/src/event-helper-listen.js:58:27)`
  };

  beforeEach(() => {
    builder = new IssueBuilder('test_org', 'test_repo', report);
  });

  describe('title', () => {
    it('contains the error message', () => {
      expect(builder.title).toEqual(
        '🚨 Error: null is not an object (evaluating \'b.acceleration.x\')'
      );
    });
  });

  describe('labels', () => {
    it('contains the error report label', () => {
      expect(builder.labels).toContain('Type: Error Report');
    });
  });

  describe('bodyDetails', () => {
    it('links to the error', () => {
      expect(builder.bodyDetails).toContain(
        '**Error report:** [link](go/ampe/CL6chqbN2-bzBA'
      );
    });

    it('records the date first seen', () => {
      expect(builder.bodyDetails).toContain('**First seen:** Feb 25, 2020');
    });

    it('records the daily frequency', () => {
      expect(builder.bodyDetails).toContain('**Frequency:** ~ 54,647/day');
    });
  });

  describe('bodyStacktrace', () => {
    it('renders the indented stacktrace in markdown', () => {
      expect(builder.bodyStacktrace).toContain(
        '```\n' +
        'Error: null is not an object (evaluating \'b.acceleration.x\')\n' +
        '    at x (https://raw.githubusercontent.com/ampproject/amphtml/2004030010070/extensions/amp-delight-player/0.1/amp-delight-player.js:421:13)\n' +
        '    at event (https://raw.githubusercontent.com/ampproject/amphtml/2004030010070/src/event-helper-listen.js:58:27)\n' +
        '```'
      );
    });
  });
});
