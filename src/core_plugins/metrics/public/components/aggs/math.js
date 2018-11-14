/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import uuid from 'uuid';
import AggRow from './agg_row';
import AggSelect from './agg_select';

import createChangeHandler from '../lib/create_change_handler';
import createSelectHandler from '../lib/create_select_handler';
import createTextHandler from '../lib/create_text_handler';
import Vars from './vars';
import {
  htmlIdGenerator,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormLabel,
  EuiTextArea,
  EuiLink,
  EuiFormRow,
  EuiCode,
} from '@elastic/eui';

class MathAgg extends Component {
  componentWillMount() {
    if (!this.props.model.variables) {
      this.props.onChange(
        _.assign({}, this.props.model, {
          variables: [{ id: uuid.v1() }],
        })
      );
    }
  }

  render() {
    const { siblings } = this.props;
    const htmlId = htmlIdGenerator();

    const defaults = { script: '' };
    const model = { ...defaults, ...this.props.model };

    const handleChange = createChangeHandler(this.props.onChange, model);
    const handleSelectChange = createSelectHandler(handleChange);
    const handleTextChange = createTextHandler(handleChange);

    return (
      <AggRow
        disableDelete={this.props.disableDelete}
        model={this.props.model}
        onAdd={this.props.onAdd}
        onDelete={this.props.onDelete}
        siblings={this.props.siblings}
      >
        <EuiFlexGroup direction="column" gutterSize="l">
          <EuiFlexItem>
            <EuiFormLabel htmlFor={htmlId('aggregation')}>Aggregation</EuiFormLabel>
            <AggSelect
              id={htmlId('aggregation')}
              siblings={this.props.siblings}
              value={model.type}
              onChange={handleSelectChange('type')}
            />
          </EuiFlexItem>

          <EuiFlexItem>
            <EuiFormLabel htmlFor={htmlId('variables')}>Variables</EuiFormLabel>
            <Vars
              id={htmlId('variables')}
              metrics={siblings}
              onChange={handleChange}
              name="variables"
              model={model}
              includeSiblings={true}
            />
          </EuiFlexItem>

          <EuiFlexItem>
            <EuiFormRow
              id="mathExpressionInput"
              label="Expression"
              fullWidth
              helpText={
                <div>
                  This field uses basic math expressions (see{' '}
                  <EuiLink
                    href="https://github.com/elastic/tinymath/blob/master/docs/functions.md"
                    target="_blank"
                  >
                    TinyMath
                  </EuiLink>) - Variables are keys on the <EuiCode>params</EuiCode> object,
                  i.e. <EuiCode>params.&lt;name&gt;</EuiCode> To access all the data use
                  <EuiCode>params._all.&lt;name&gt;.values</EuiCode> for an array of the
                  values and <EuiCode>params._all.&lt;name&gt;.timestamps</EuiCode>
                  for an array of the timestamps. <EuiCode>params._timestamp</EuiCode>
                  is available for the current bucket&apos;s timestamp,
                  <EuiCode>params._index</EuiCode> is available for the current
                  bucket&apos;s index, and <EuiCode>params._interval</EuiCode>s
                  available for the interval in milliseconds.
                </div>
              }
            >
              <EuiTextArea
                data-test-subj="mathExpression"
                onChange={handleTextChange('script')}
                fullWidth
                value={model.script}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
      </AggRow>
    );
  }
}

MathAgg.propTypes = {
  disableDelete: PropTypes.bool,
  fields: PropTypes.object,
  model: PropTypes.object,
  onAdd: PropTypes.func,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  panel: PropTypes.object,
  series: PropTypes.object,
  siblings: PropTypes.array,
};

export default MathAgg;
